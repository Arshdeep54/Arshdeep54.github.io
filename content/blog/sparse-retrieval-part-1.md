You type two words into a search box and get back the ten most relevant pages out of millions, in a few milliseconds. Before embeddings and vector search, all of this was keyword search, and a lot of it still is. BM25 is still the default ranking in Lucene, Elasticsearch and OpenSearch, and it's the baseline every new retrieval model gets compared against.

So what exactly do I know about search? In this one, I start from the dumbest approach, scanning every document, and fix it one problem at a time: the inverted index for speed, TF-IDF for ranking, and then the three fixes that turn TF-IDF into BM25.

We have 100s of documents, and we need to find the documents related to a given search query, for now, a single word. What we do is search for that word in all the documents one by one, reading each whole document. We need relevant documents. This is a brute-force way to know. For each given word, we run through $N \times L$ words ($N$ documents × $L$ words in each doc).

And we want relevance-ranked documents. So, a naive way to add ranking is to count the number of times that word appears in the document: **term frequency (TF)**.

## The inverted index

Now this brute-force way is too slow; you go through the same docs every time you have a new word. If there are millions of docs with 100s of words in each, you know how slow it could be, and search engines are supposed to be fast, returning results in milliseconds.

How about we save some details about each doc or each word beforehand and just use those details, rather than looping over all the docs again and again? The solution is to organise documents by words, rather than going from documents to words. For every unique word in the collection, we save a list of the documents containing that word. This is the word's **posting list**.

This inversion, organising docs by words, is called an **inverted index**. We build it once by traversing all the docs in the collection, updating every word's posting list. So you don't scan the whole collection on each search.

Now this gives us one more thing: when searching for a query with multiple words, we get the posting lists of all the words in the query and intersect them, and we find the docs containing all of them.

And again, for relevance, we use term frequency, how many times a word occurred in each doc, and we rank the final list of documents according to it. Documents with higher counts are assumed to be more relevant.

## TF-IDF

Then Searchacians realised that these raw counts are flawed. How? Common words like "an", "the", "which" appear almost everywhere and don't help distinguish anything. So **inverse document frequency (IDF)** was introduced. According to it, words that are common across the collection are downweighted and rare words are upweighted. Multiply TF and IDF and it gives you the ranking. Happy.

$$
\text{TF-IDF}(q, D) = \text{TF}(q, D) \times \text{IDF}(q)
$$

$$
\text{IDF}(q) = \ln \frac{N}{n(q)}
$$

Here $\text{TF-IDF}(q, D)$ is the score of query word $q$ in document $D$, $N$ is the total number of docs, and $n(q)$ is the number of docs containing $q$.

## Where TF-IDF falls short

Now suppose two documents: document A is 10 words long and contains $q$ once, and document B is 1000 words long and contains it 10 times. $\text{TF}(B) > \text{TF}(A)$, but logically A should get more priority, because the word appears once in 10 words rather than 10 times in 1000 (1 in 100, ratio-wise). So calculating TF without considering document length is not realistic.

Second, if you look at TF-IDF's dependency on TF, the derivative is a constant:

$$
\frac{\partial\, \text{TF-IDF}}{\partial\, \text{TF}} = \text{IDF}(q)
$$

It should be some function of TF. Example: "cat" appearing twice in a document makes the document 2 times more important, but "cat" appearing 50 times should not make the document 50 times more important. There should be some cap on this importance, after which it saturates.

## BM25

So all these issues led to the Best Matching family of formulas, and after 25 variants we get BM25, which solves the issues above.

For a word in a query, BM25 computes its contribution to the final score. This contribution has 3 parts.

### 1. IDF

First, the same IDF (total number of docs divided by the number of docs containing the word), taking the log to compress this ratio into a more reasonable, slowly growing number. This is classic IDF. BM25 uses [probabilistic retrieval theory](#note-probabilistic-retrieval). The idea is that you are not just measuring rarity; rather, you are estimating an odds ratio: the odds that a word appears in a relevant document versus a non-relevant one. This leads to $N - n(q)$ in the numerator. Yeah, I didn't fully get this part either, but okay, we accept it.

Then 0.5 is added to both the numerator and the denominator (a Laplace-style continuity correction). This handles the $N = n(q)$ case, where a word is in all docs, and you know, $\log(0)$. So it stabilises the formula for extremely common words. It also handles the other end, $n(q) = 0$, a word in no docs, where the denominator would be 0. Now if you look at the [$\log(x)$ graph](#note-log), for $x < 1$, $\log(x)$ is negative, so we add $1$ to keep the input above 1:

$$
\text{IDF}(q) = \ln\left(\frac{N - n(q) + 0.5}{n(q) + 0.5} + 1\right)
$$

### 2. Saturated term frequency

Now the second term of BM25 is the saturated term frequency; here we solve the directly proportional TF issue. We need something that matters at low (actual) TF and saturates at higher TF, approaching a ceiling, which we call $k + 1$. So the second term is now:

$$
\frac{\text{TF} \cdot (k + 1)}{\text{TF} + k}
$$

$k$ (usually written $k_1$) is a tunable constant, usually somewhere around 1.2 to 2. If you [plot this new term against TF](#note-saturation), it is significant at low TF and approaches $k + 1$ as TF increases.

### 3. Length normalisation

Now the third part, the last issue: [length normalisation](#note-length-normalisation). We calculate

$$
\theta = \frac{|D|}{\text{avgdl}}
$$

the length of this document divided by the average document length across the whole collection. We tune θ's effect using another constant $b$ (usually 0.75). Now if a document is shorter than average, θ is small, and its effective TF should be boosted a little; each word in it carries more weight. If it's longer than average, the effective TF gets dampened. So the second term becomes:

$$
\frac{\text{TF} \cdot (k + 1)}{\text{TF} + k \cdot (1 - b + b \cdot \theta)}
$$

### Putting it together

For a query $Q$ containing words $q$:

$$
\text{BM25}(D, Q) = \sum_{q \in Q} \text{IDF}(q) \cdot \frac{\text{TF}(q, D) \cdot (k + 1)}{\text{TF}(q, D) + k \cdot \left(1 - b + b \cdot \frac{|D|}{\text{avgdl}}\right)}
$$

So for every word in the query: how rare it is in the collection, how many times it shows up in this doc (with a ceiling), and how long this doc is compared to the rest. Add these up across the query words and you get the doc's score. Sort by score, return the top ten.

## What BM25 doesn't see

BM25 is still a bag of words. All it knows is whether the exact query word is in the doc, how many times, and how long the doc is. That leaves a couple of gaps:

- **Exact words only.** For BM25, "car" and "automobile" are two unrelated words. If the query says one and the doc says the other, that word adds 0 to the score. This is called the vocabulary mismatch problem. Stemming (cutting "running" down to "run") and hand-made synonym lists help a bit, but only a bit.
- **No word order.** "dog bites man" and "man bites dog" get the same score.

There are also variants for smaller issues. The full BM25 has one more factor for words repeated in the query, with its own constant $k_3$, but queries are short, so it's usually dropped. BM25F scores fields like the title and the body separately and weighs them. BM25+ adds a small constant so that a very long doc containing the word never scores almost the same as a doc without it.

## What's next

Still, BM25 is fast, needs no training, and works out of the box on any collection. That's why it's still the baseline. So the next question is: can we keep the inverted index and the speed, but let a model decide which words a doc should match and how much each one should count? That's learned sparse retrieval, and that's what I'll write about next: **SPLADE**. Stay tuned.

---

**References**

1. [BM25: The Most Important Text Metric in Data Science (video)](https://youtu.be/ruBm9WywevM)

````note probabilistic-retrieval Probabilistic retrieval theory
The question BM25's IDF actually asks is not "how rare is this word?" but "if a document contains this word, how much more likely is it to be relevant?"

Split the collection into two piles: documents relevant to the query, and everything else. For a query word $q$, there are two probabilities:

$$
p = P(q \in D \mid D \text{ relevant})
$$

$$
u = P(q \in D \mid D \text{ not relevant})
$$

A good search word shows up a lot in the relevant pile and rarely in the other one. So we compare the odds of seeing it in each pile:

$$
w(q) = \log \frac{p \,/\, (1 - p)}{u \,/\, (1 - u)}
$$

This is the Robertson–Spärck Jones weight. The problem is that we don't know which docs are relevant; that's the whole thing search is trying to find out. So we guess both numbers.

**Guess for $p$.** With no information, a word is as likely to be in a relevant doc as not, so $p = 0.5$. Then $p / (1 - p) = 1$, and the relevant side drops out.

**Guess for $u$.** Almost every doc in the collection is not relevant to a given query (out of millions, maybe a few dozen are). So the non-relevant pile is basically the whole collection, and the chance of seeing $q$ in it is just the fraction of docs that contain $q$:

$$
u \approx \frac{n(q)}{N}
$$

Put both guesses in:

$$
\begin{aligned}
w(q) &= \log \frac{1 - u}{u} = \log \frac{1 - n(q)/N}{n(q)/N} \\
&= \log \frac{N - n(q)}{n(q)}
\end{aligned}
$$

That's where $N - n(q)$ comes from: it's the number of docs that **don't** contain the word. Classic IDF, $\log(N / n(q))$, compares all docs against the docs with the word. This one compares the docs without the word against the docs with it.

For rare words both give almost the same number, because $N - n(q) \approx N$. They differ for common words: once a word is in more than half the docs, $N - n(q) < n(q)$, the ratio drops below 1, and the log goes negative. That's the case the $+1$ inside BM25's log fixes.

The 0.5s come from the same model. Robertson and Spärck Jones estimated $p$ and $u$ from counts, and adding 0.5 to each count keeps the estimates away from 0 and 1, so there's no $\log(0)$ and no division by zero.
````

````note log The log graph
```figure log
ln x is negative for x < 1 and zero at x = 1. ln(x + 1) never goes below 0 for x ≥ 0.
```

$\ln x$ is negative for $x < 1$ and falls to $-\infty$ as $x \to 0$. In BM25's IDF, $x$ is $\frac{N - n(q) + 0.5}{n(q) + 0.5}$, which drops below 1 once a word is in more than half the docs. Adding 1 shifts the curve left, so the input is always at least 1 and the score is never negative.
````

````note saturation The saturation curve, and its slope
Take the second term on its own, writing $t$ for TF:

$$
S(t) = \frac{t \cdot (k + 1)}{t + k}
$$

Plot it next to raw TF (what TF-IDF uses), and drag $k$ to see how it changes the curve:

```figure saturation
BM25's TF term flattens out at k + 1. Raw TF keeps growing in a straight line.
```

A few things you can read straight off the formula:

- $S(1) = 1$ for every $k$. One occurrence is always worth exactly 1.
- As $t \to \infty$, $S(t) \to k + 1$. That's the ceiling.
- $S(k) = (k + 1)/2$. You reach half the ceiling when TF equals $k$, so $k$ decides how fast the curve flattens.

**Taking the derivative.** The derivative of the score with respect to TF answers one question: if the word shows up one more time, how much does the score go up? For TF-IDF the score is $\text{TF} \times \text{IDF}$, so the answer is always IDF. The 50th "cat" adds as much as the 1st.

For BM25's second term (quotient rule):

$$
\begin{aligned}
\frac{dS}{dt} &= \frac{(k + 1)(t + k) - t\,(k + 1)}{(t + k)^2} \\
&= \frac{k\,(k + 1)}{(t + k)^2}
\end{aligned}
$$

```figure saturation-slope
The slope starts at (k + 1) / k and falls like 1 / TF². Raw TF's slope never changes. Smaller k: steeper start, faster drop.
```

It starts at $(k + 1)/k$ when $t = 0$ and drops like $1/t^2$. With $k = 1.2$, the 1st occurrence adds 1, the 2nd adds about 0.38, the 3rd about 0.2, and going from 10 to 11 adds about 0.02. That's what saturation means: each extra occurrence is worth less than the one before.

**What $k$ does.** Look at the two extremes:

- $k \to 0$: $S(t) = 1$ for any $t \geq 1$. Only presence matters, the count is ignored.
- $k \to \infty$: $S(t) \to t$. Back to raw TF, no saturation.

So $k$ slides between "is the word there?" and "how many times is it there?". The usual 1.2 to 2 sits a lot closer to the first one.
````

````note length-normalisation Length normalisation, as a curve
Write $L = 1 - b + b \cdot \theta$ for the length factor, so the term is:

$$
S(t, \theta) = \frac{t \cdot (k + 1)}{t + k \cdot L}
$$

Divide the top and bottom by $L$:

$$
S = \frac{(t / L) \cdot (k + 1)}{(t / L) + k}
$$

That's the same saturation curve as before, just fed with $t / L$ instead of $t$. So length normalisation doesn't change the shape of the curve; it rescales TF before it goes in. With $b = 1$, $L = \theta$ and the input is $t / \theta$: TF relative to the average doc length, which is the ratio idea from the 10-word vs 1000-word example.

The same curve for docs of different lengths. Drag $k$ and $b$:

```figure length-tf
Every curve still tops out at k + 1. Longer docs (bigger θ) just get there slower.
```

**Taking the derivative with respect to length.** Now the question is: if the document gets longer while TF stays the same, what happens to the score? $L$ changes with $\theta$ at rate $b$, so:

$$
\frac{\partial S}{\partial \theta} = -\frac{t \cdot (k + 1) \cdot k \cdot b}{(t + k \cdot L)^2}
$$

Two things fall out of this:

- It's never positive. A longer doc with the same TF never scores higher.
- It's proportional to $b$. With $b = 0$ length is ignored completely; with $b = 1$ you get the full penalty.

```figure length-theta
Score for TF = 3 as the doc gets longer. Drag b to 0 and the penalty disappears; at 1 it's the steepest.
```

Back to the earlier example, with avgdl = 100, $k = 1.2$ and $b = 0.75$: document A (10 words, TF 1) scores about 1.58, and document B (1000 words, TF 10) scores about 1.14. A wins, which is what we wanted.
````
