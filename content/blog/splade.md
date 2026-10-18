Moving on from BM25 ([Part 1](/blog/bm25)). BM25 searches for almost the same words: the exact words, or, if the preprocessing does stemming ([covered in Part 1](/blog/bm25)), "running" and "runs" for the query "run". But it can't find a doc about a "marathon" when the query is "run". Because how will it? "marathon" is just a different word, it has its own posting list, and the query never touches it.

So either we define a dictionary mapping each word to its synonyms, and search for them too. That would be the brute-force way, and it must have come to the minds of Searchacians ([it did](#note-before-splade)). But who writes this dictionary, for every word, for every domain? And "run" next to "python" is not "marathon" anymore.

But no, the field of ML, DL solves it. How? SPLADE. What is SPLADE? -> What I had read about it at first: it gives you a vector for the given doc, a very high-dimensional vector, which stores mostly 0s, and the index at which the value is not 0 is a token ID, with a weight there, like 1.7. So it also has a vocabulary mapping every token to a token ID. Now when we search, related words match too, even if they were never in the doc. Still vague, so in this post we open it up: from that black box, down to BERT's insides (tokens, embeddings, attention, the MLM head), and back up to how SPLADE builds these vectors, how it's trained, and how search works with them.

**Contents** (the 13 min covers the main text; the dotted links open optional side notes, which add more on top):

- [Two roads](#two-roads)
- [SPLADE, as a black box](#splade-as-a-black-box)
- [Down the rabbit hole (optional)](#down-the-rabbit-hole-optional): BERT from scratch
- [Climbing back out: the SPLADE formula](#climbing-back-out-the-splade-formula)
- [BERT knows words, not relevance](#bert-knows-words-not-relevance)
- [Searching with it](#searching-with-it)
- [What SPLADE doesn't see](#what-splade-doesn-t-see)
- [What's next](#what-s-next)

## Two roads

Before going in: there are two roads here, and I've already been down the first one.

1. **Dense.** In the typical single-vector setup, turn every doc into one vector of ~768 numbers, all of them non-zero, and for a query, find the docs with the nearest vectors. It does get "run" ≈ "marathon". But instead of the inverted index, you need a different kind of index for nearest-neighbour search (that's the HNSW index I built for VortexDB: [the mental model](/blog/hnsw-index-part-1), [the Rust implementation](/blog/hnsw-index-part-2)), exact matches like a product ID or a person's name get fuzzy, and you can't really tell why a doc matched. ([more on dense](#note-dense))
2. **Learned sparse.** Keep the inverted index from [Part 1](/blog/bm25), keep the speed, but let a model decide which words a doc should be indexed under, and with what weight.

SPLADE is the second road, and the one this series is about.

## SPLADE, as a black box

So, SParse Lexical AnD Expansion model.

For now, we don't look inside. All we need to know: SPLADE is built on BERT, a model trained on huge amounts of text, which has learned the associations of run and marathon. So BERT knows that run and marathon are related. So SPLADE's first idea is simple: use BERT to expand a document with related words, like marathon and jogging for run. The model quietly adds weights to these words too, even when they never appeared in the text. This is the **Expansion** part.

Next thing that SPLADE does: BERT's output is very dense, a huge list of numbers, hundreds of dimensions, nothing like our sparse, word-based index. But SPLADE forces the output into a different shape: instead of hundreds of dense numbers, the output has one slot for every token in BERT's vocabulary, 30,522 slots. For each slot, the model predicts a weight: how relevant that word is to this document.

At first, thousands of these values are small but non-zero. SPLADE adds a penalty during training that pushes these weights down, and anything the model scores at or below 0 becomes exactly 0. So only a small number of words keep a meaningful weight: with the settings in the papers, typically a few dozen to a few hundred for a passage, fewer for a short query, but the count depends on how hard the penalty is set. This penalty is called **sparse regularization**.

So this is what we're going for:

```figure expansion
Same doc, two sparse vectors. BM25 counts the words that are there, SPLADE weighs them and adds new ones.
```

Now I will open this black box a little, to explain the above points better.

So BERT returns an embedding for every *token* of the document, 768 numbers per token, none of them 0. Now these numbers, they don't correspond to anything we understand. It's not like the 368th number is meant for the word "run", it's just an abstract dimension in maths space, meaningless to us, and more importantly, to an inverted index, which needs actual tokens/words, not these abstract dimensions.

Now SPLADE reshapes this thing. It forces the output to have exactly one slot per vocabulary token, all 30,522 tokens BERT knows. For example, slot 1037 is "a", slot 2448 is "run", and slot 8589 is "marathon" (these are the real IDs). So in this, every word gets its own fixed, known position.

So if SPLADE only does this reshaping, you will get 30,522 numbers, and thousands of them would be small but non-zero. Why so many? Because the layer SPLADE reads from gives a score to *every* vocab token by design, and plenty of those come out positive, we'll see it in a bit. That's not useful for an inverted index, whose whole purpose is that you only store and look up words that actually matter for a document. If every document had a small weight on all 30,522 words, your posting lists would include every document for every word, defeating the entire purpose of fast lookup.

So that's where the sparsity regularization comes in, the penalty during training. It pushes the weights down, hardest on words that show up in lots of docs, so the model learns to score most words at or below 0. The exact zeros come from a ReLU we'll see later, which turns every such score into 0. The penalty doesn't zero anything by itself or fix how many words survive, it just makes keeping a word cost something. So for our "run" example, after training, you'd end up with maybe "run" at a high weight, "marathon" and "jogging" at smaller but real weights, and almost all the other vocabulary words sitting at exactly zero, not stored.

How does it reshape? It uses BERT's internals, one of its layers. Here's where we're headed, the whole of SPLADE in one line:

$$
w_j = \max_{i \in \text{doc}} \log\big(1 + \text{ReLU}(w_{ij})\big)
$$

$w_{ij}$ is BERT's score for vocab word $j$ at token $i$ of the doc, and $w_j$ is the doc's final weight for word $j$. Every piece of this gets unpacked below.

## Down the rabbit hole (optional)

**Already know transformers? [Skip to the SPLADE formula](#climbing-back-out-the-splade-formula).** Otherwise, read on.

Okay, this is where I went down a rabbit hole. The SPLADE paper says it uses the "logits of the MLM layer". What's MLM? It's how BERT was trained. What's BERT? The encoder half of a transformer. What's a transformer? Attention, stacked. And attention needs Q, K, V, from where?? And the word vectors themselves, from where?? It kept going:

```figure rabbit-hole
How it went. Each answer had another question in it.
```

So now we start at the bottom of the hole and build back up, step by step, from raw text all the way up to the layer SPLADE uses, and I'll try to explain almost everything, assuming you know nothing about transformers (I didn't).

### Step 1: text → tokens → IDs

A model only does maths, so first, text has to become numbers. BERT has a fixed vocabulary of 30,522 tokens. The tokenizer (it's called [WordPiece](#note-wordpiece)) splits the text into tokens from that list and replaces each one with its ID, its row number in the list. Words that are not in the list get broken into pieces it does know: "splade" becomes `sp`, `##lad`, `##e` (the `##` means "glued to the previous piece"). Funny enough, "jog" is not a token, it's `jo` + `##g`, but "jogging" is one.

```figure wordpiece
Real BERT (bert-base-uncased) tokens and IDs. [CLS] and [SEP] are special tokens BERT adds at the start and end.
```

Remember this vocabulary, because SPLADE's 30,522 slots are exactly these tokens. SPLADE's "words" are BERT's tokens.

### Step 2: IDs → vectors

But an ID is just a label. 2448 isn't "bigger" than 1037 in any useful way. So BERT has a big table called the **embedding matrix** $E$, one row per vocab token: 30,522 rows × 768 numbers. The vector for a token is just its row. That's it, a lookup:

$$
\mathbf{x}_{\text{bank}} = E_{\text{id(bank)}} \qquad E \in \mathbb{R}^{30522 \times 768}
$$

```figure embedding
A toy version: 6 words, 4 numbers each.
```

Where did these numbers come from? Nobody wrote them, they start random and get learned during training ([how](#note-embeddings-learned)). One more thing: before going in, every token's vector also gets a [position vector](#note-positions) added to it, so the model knows the word order (and a segment vector in BERT, saying which sentence it belongs to).

### Step 3: one vector per word, but "bank"?

Now, same token, same row, always. "bank" in "river bank" and "bank loan" gets the exact same vector. That's not really better than BM25. Each word needs to look at its neighbours and change itself based on them. That's **attention**.

Every token makes three new vectors out of its own vector, by multiplying it with three matrices:

- a **query** $\mathbf{q} = \mathbf{x} W^Q$: what am I looking for?
- a **key** $\mathbf{k} = \mathbf{x} W^K$: what do I contain? like a label on me
- a **value** $\mathbf{v} = \mathbf{x} W^V$: what do I hand over if someone picks me?

Then for one word, we compare its query with every word's key using the dot product (big when the two vectors point the same way, and also when they're long: unlike cosine similarity, it doesn't normalize the lengths), divide by $\sqrt{d_k}$ to keep the numbers from getting too big, softmax them into percentages that add up to 100%, and the word's new vector is the weighted mix of everyone's values. For all words at once:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right) V
$$

$Q$, $K$, $V$ are just all the words' queries, keys and values stacked as rows, $d_k$ is the length of each key (64 in BERT), and $QK^\top$ is every query dotted with every key.

```figure attention-heat
A toy "river bank flows" with 4-number word vectors. Rows = the word asking, columns = who it listens to. "bank" puts 77% of its attention on "river", so its new vector is mostly river-flavoured. Numbers are a toy, but computed for real.
```

[See it step by step, with every number](#note-attention-steps). And yes, $W^Q$, $W^K$, $W^V$ are [learned too](#note-learned-weights), same as the embeddings. BERT does this 12 times in parallel in every layer, each with its own matrices (12 "heads" × 64 numbers = 768).

### Step 4: the rest of a layer, and stacking them

After attention, every token goes through a small neural network on its own (768 → 3,072 → 768, with a [GELU](#note-gelu) in between), plus some [plumbing](#note-plumbing) that keeps things stable. That's one layer. BERT-base stacks 12 of them.

```figure encoder-stack
One layer, two tokens. Attention mixes the tokens, the FFN works on each token alone, and the dashed lines carry each block's input around it to be added back. The output goes into the next layer, 12 times. Drawn after the Illustrated Transformer.
```

What comes out of the top: one 768-number vector per token, that now "knows" its context. Not one per document, one per token. The "bank" next to "river" now has a different vector from the "bank" next to "loan".

(BERT is only one half of the original transformer, by the way. [Transformer vs BERT vs GPT](#note-transformer-family).)

### Step 5: how BERT learned: hide a word, guess it

BERT was trained on Wikipedia and a pile of books, ~3.3 billion words, with a game: hide 15% of the tokens (mostly behind a `[MASK]`) and guess them, using the words on both sides. This is the **Masked Language Model**, MLM. The guessing is done by a small layer on top, the **MLM head**: it takes a token's final 768-number vector and gives a score (a "logit") for every one of the 30,522 vocab tokens. Highest score = BERT's guess.

```figure mlm-head
What the MLM head says for a masked word. Same word "bank", different neighbours, different guesses. Illustrative numbers.
```

And this is it. This is the layer SPLADE uses.

Think about it: for the token "run" in "i went for a run", the MLM head scores all 30,522 vocab tokens by "how well would this token fit here". Something like (illustrative, not a real model output): run high, jogging high, marathon some, banana very low. That's literally an expansion, already there, BERT learned it for free while playing its guessing game. And that's the "score for every vocab token" from earlier, the reason we get thousands of non-zeros before the penalty. ([what's inside the MLM head](#note-mlm-head))

## Climbing back out: the SPLADE formula

Okay, back up. Now we have, for every token $i$ in the doc, a score $w_{ij}$ for every vocab token $j$. A grid: (tokens in the doc) × 30,522. SPLADE turns this grid into one vector for the doc:

$$
w_j = \max_{i \in \text{doc}} \log\big(1 + \text{ReLU}(w_{ij})\big)
$$

Three moves, read it from inside out:

1. **ReLU**: negatives become 0. BERT says "banana" doesn't fit here at all, fine, that's a 0, not a negative.
2. **log(1 + x)**: saturation. Remember [BM25's saturation](/blog/bm25)? Same idea: the 10th unit of confidence should add less than the 1st, so one word can't dominate just because BERT is very sure about it. And $\log(1 + 0) = 0$, so zeros stay zeros (no log(0) problem here).
3. **max over tokens**: for every vocab word, keep its best score from any token in the doc.

```figure log-relu
The ReLU cuts the negatives, the log squashes the big ones.
```

```figure splade-pipeline
A 4-token doc and 8 of the 30,522 columns. Note "marathon" in the doc also lights up "race" and "run", and "ran" lights up "running". Also note "a" and "she" survive with real weight. That's what the penalty in the next section is for. Logits are made up, the maths is real.
```

(The first SPLADE paper actually used a sum over tokens here, the second one switched to max. [Why](#note-sum-vs-max).)

## BERT knows words, not relevance

One thing I missed at first: BERT alone knows run and marathon are related, but it doesn't know what makes a doc *relevant* to a query. Those are different. So SPLADE starts from BERT's weights and is trained more (fine-tuned) on MS MARCO, a dataset of real Bing search queries with passages marked as relevant.

For each query, we take its relevant passage $d^+$, a passage BM25 likes but that isn't relevant $d^-$ (a "hard negative"), and the other queries' passages in the same batch as extra negatives. Then we push the relevant one to the top:

$$
\mathcal{L}_{\text{rank}} = -\log \frac{e^{s(q, d^+)}}{e^{s(q, d^+)} + e^{s(q, d^-)} + \sum_j e^{s(q, d_j^-)}}
$$

If that looks familiar, it's the same softmax from attention, just over docs this time: "what % goes to the right doc", and we want it near 100%.

And then the penalty, added on top, with two knobs, one for queries and one for docs:

$$
\mathcal{L} = \mathcal{L}_{\text{rank}} + \lambda_q \, \mathcal{L}^{q}_{\text{reg}} + \lambda_d \, \mathcal{L}^{d}_{\text{reg}}
$$

The penalty is called the [FLOPS regularizer](#note-flops), and the fun thing about it: it doesn't just push all weights down, it pushes hardest on words that are active in lots of docs. Which are exactly the words with long posting lists, the ones that make search slow. Bigger $\lambda$, fewer words survive:

```figure flops
A toy of the effect, not the real training. As λ goes up, "a" dies first (it's in almost every doc), then the weak expansions, and the words that actually describe the doc stay.
```

Why two knobs? The query is what we pay for at search time, every time, so you can squeeze queries harder than docs.

## Searching with it

Now putting it all together.

**Indexing**: run every doc through SPLADE once, offline (a GPU makes this much faster, but it isn't required), and for each non-zero (token, weight), put the doc in that token's posting list with the weight. It's the same inverted index from Part 1, just storing learned weights instead of TF counts.

**Search**: run the query through SPLADE too, so the query gets expanded too, and the score is just a dot product over the tokens both have:

$$
s(q, d) = \sum_{j} q_j \, d_j
$$

And because both vectors are mostly 0, we only need to walk the posting lists of the query's few non-zero tokens. Same trick as BM25.

```figure splade-flow
The whole thing, end to end.
```

```figure sparse-dot
Query "morning run" against three docs. BM25 can never find A (no shared word) and happily matches B on "run". SPLADE ranks C, then A, then B. Weights are illustrative.
```

There's also a cheaper version, [SPLADE-doc](#note-splade-doc), that doesn't run BERT on the query at all.

And how much better is it? On MS MARCO, with MRR@10 (Mean Reciprocal Rank: for each query, find the first relevant passage in the top 10: rank 1 scores 1, rank 2 scores $\frac{1}{2}$, rank 3 scores $\frac{1}{3}$, not in the top 10 scores 0. Average over all queries, $\times 100$. Higher is better), on the MS MARCO dev set, from the SPLADE v2 paper (it reports them as fractions like 0.368, here ×100):

| model | MRR@10 |
| --- | --- |
| BM25 | 18.4 |
| doc2query-T5 | 27.7 |
| SPLADE (v1) | 32.2 |
| SPLADE-max | 34.0 |
| DistilSPLADE-max | 36.8 |

The best one gets about twice BM25's MRR@10, while still being an inverted index.

One detail: everything in the rabbit hole above is BERT-base, but the v2 models in this table start from DistilBERT-base, a smaller 6-layer version of BERT with the same vocabulary and the same kind of MLM head.

## What SPLADE doesn't see

Not free, though:

- **BERT everywhere.** Every doc goes through BERT at index time, and every query at search time (unless SPLADE-doc). BM25 needs no model at all.
- **Length limit.** BERT takes at most 512 tokens, and SPLADE was trained on 256, so long docs have to be split into chunks.
- **BERT's vocabulary.** The index stores BERT's tokens. A new product name or a typo gets chopped into pieces like `##lad`, and the weights land on those pieces.
- **Expansion can be wrong.** The model can add words that don't fit the doc, and it can't tell you why it did.
- **Bigger index.** Expansion terms make posting lists longer than BM25's. The FLOPS penalty keeps this in check, but it's a trade-off you tune.

## What's next

So that's SPLADE: BERT's guessing game, reshaped into an inverted index. I've been adding sparse vector support to VortexDB, so next I'll actually build it: storing these sparse vectors, an inverted index with weights, and searching it fast. Stay tuned.

---

**References**

1. [SPLADE: Sparse Lexical and Expansion Model for First Stage Ranking](https://arxiv.org/abs/2107.05720) (Formal, Piwowarski, Clinchant, SIGIR 2021)
2. [SPLADE v2: Sparse Lexical and Expansion Model for Information Retrieval](https://arxiv.org/abs/2109.10086) (Formal, Lassance, Piwowarski, Clinchant, 2021)
3. [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://arxiv.org/abs/1810.04805) (Devlin, Chang, Lee, Toutanova, NAACL 2019)
4. [Minimizing FLOPs to Learn Efficient Sparse Representations](https://arxiv.org/abs/2004.05665) (Paria, Yeh, Yen, Xu, Ravikumar, Póczos, ICLR 2020)
5. [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) (Jay Alammar)

````note before-splade How Searchacians tried before
The vocabulary mismatch problem is old, and people tried a lot before SPLADE:

- **Thesaurus expansion.** Use a hand-made dictionary like WordNet to add synonyms to the query. Works a bit, but synonyms depend on context ("run" a program vs "run" a marathon), and adding the wrong ones hurts.
- **Pseudo-relevance feedback.** Search once, assume the top few results are relevant, pick the frequent words from them, add those to the query, and search again. No dictionary needed, but if the first results are bad, the expansion makes it worse.
- **doc2query.** Expand the *document* instead: train a model to generate questions a doc could answer, and append them to the doc before indexing. This one is in the results table later on (doc2query-T5), and it was a big jump over BM25.
- **DeepCT.** Keep the doc's words, but use BERT to predict a better weight for each one instead of TF. Re-weighting, no expansion.

SPLADE does both: re-weighting *and* expansion, in one model, trained end to end.
````

````note dense Dense retrieval, the other road
In typical single-vector dense retrieval, a model (usually BERT-like) turns the whole doc into one vector, e.g. 768 numbers, and the query into another. Relevance = how close the two vectors are (dot product or cosine).

Good: it matches meaning, not words, so "run" and "marathon" are close.

The costs:

- You can't use an inverted index for these vectors. Every number is non-zero, so there's no posting list to look up. You need an approximate nearest-neighbour index (like HNSW) instead, which is a different system to build and run.
- Exact matches get fuzzy. A query for a specific error code or a rare name might return things that are "about the same topic" instead of the one doc that has that exact string. BM25 does better here, since the exact token is in the index, though typos, tokenization and the analyzer can still get in the way.
- It's hard to say *why* a doc matched. 768 abstract numbers, no words.

Learned sparse like SPLADE sits in between: the model decides the weights, but the output is still words, in an inverted index.
````

````note wordpiece WordPiece: where the 30,522 tokens come from
The vocabulary is built once, before BERT is trained. Start with single characters, and keep merging the pairs of pieces that show up together a lot more than you'd expect by chance into a new, longer piece, until the vocabulary has the size you want. So common words end up as one token ("run", "marathon"), and rare words have to be built from pieces ("sp", "##lad", "##e").

To tokenize a word, it takes the longest piece from the start that's in the vocabulary, then the longest piece of what's left (with `##` in front), and so on. That's why "jog" is `jo` + `##g`: "jog" itself never made it into the list, but "jogging" did.

bert-base-uncased also lowercases everything and strips accents first, so "Run" and "run" are the same token.

For SPLADE this matters a lot: the vocabulary *is* the index. A word that's split into pieces gets its weight spread over those pieces.
````

````note embeddings-learned Where the embedding matrix comes from
$E$ is learned, the same way as everything else in BERT:

1. **Start random.** All 30,522 × 768 numbers are random. "bank" and "banana" are both just noise.
2. **Play the guessing game.** Look up the rows for the tokens in a sentence like "i deposited the cash at the [MASK]", run them through the model, and guess the hidden word. Measure how wrong: $L = -\log p(\text{bank})$, where $p(\text{bank})$ is how sure BERT is that the hidden word is "bank": the MLM head's scores for all 30,522 tokens, put through a softmax. Sure and right, $p \approx 1$, loss $\approx 0$. Barely considered it, loss is big.
3. **Backprop all the way down.** The error flows back through every layer, down to the input vectors. The rows of the tokens in this sentence get nudged: $E_{\text{id}} \leftarrow E_{\text{id}} - \eta \, \frac{\partial L}{\partial \mathbf{x}_i}$.
4. **Repeat over billions of words.** Words that show up in similar contexts get pushed in similar directions again and again, so their rows end up close: money, loan and cash near each other, river, shore and stream near each other.

So $E$ is just 23.4 million of BERT's ~110 million parameters, nothing special. (word2vec, from 2013, learned a table like this on its own with a tiny model. BERT doesn't use word2vec, it learns its own $E$ together with the rest.)

Fun bit: BERT's MLM head reuses this same $E$ at the output, see [what's inside the MLM head](#note-mlm-head).
````

````note positions Position vectors: knowing the word order
Attention by itself doesn't care about order. Shuffle "river bank flows" and every word gets the same scores. So before the first layer, each token's vector gets a position vector added:

$$
\mathbf{x}_i = E_{\text{id}_i} + P_i \;(+\, S_{\text{seg}_i})
$$

The original transformer (2017) used waves of different speeds:

$$
P_{(pos,\,2i)} = \sin\left(\frac{pos}{10000^{2i/d}}\right), \qquad P_{(pos,\,2i+1)} = \cos\left(\frac{pos}{10000^{2i/d}}\right)
$$

```figure positions
Rows = positions, columns = the numbers in the position vector (32 here, 768 in BERT). Left columns wiggle fast, right ones slowly, like the hands of a clock, so every position gets a unique pattern.
```

BERT doesn't use these waves. It keeps a second table, just like the embedding matrix $E$: $P$ has 512 rows × 768 numbers, row 0 is "first token", row 1 is "second token", and so on. Starts random, learned in training like everything else. The catch: the table only has 512 rows. There is no row for position 513, so BERT simply can't take more than 512 tokens. (The waves don't have this problem, you can compute them for any position, but BERT went with the learned table.) $S$ is the segment vector: BERT was also trained on sentence pairs, and it marks which tokens are sentence A and which are B.
````

````note attention-steps Attention, step by step
Everything is computed live from the toy matrices.

```figure attention-formula
"river bank flows", 4-number word vectors, 2-number queries/keys/values. In BERT it's 768 → 64 per head.
```

1. **Q, K, V.** Every word's vector times three matrices.
2. **Scores.** The asking word's query, dot product with every key.
3. **Divide by $\sqrt{d_k}$.** A dot product of longer vectors adds up more terms, so scores grow with the size. Huge scores make softmax put ~100% on one word, and training gets stuck. Dividing by $\sqrt{64} = 8$ in BERT (here $\sqrt 2$) keeps them sane.
4. **Softmax.** $\text{softmax}(s)_i = \frac{e^{s_i}}{\sum_j e^{s_j}}$, scores → percentages that add up to 100%.
5. **Weighted sum.** The new vector is the mix of everyone's values by those percentages.

**Multi-head.** One attention gives one way of looking at the others. But a word might need to track several things: what it refers to, what describes it, which verb goes with it. So each layer runs several attentions side by side, each with its own $W^Q, W^K, W^V$, glues the outputs together, and multiplies by one more matrix $W^O$:

$$
\text{MultiHead}(X) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)\, W^O
$$

where each head is just one full run of the attention formula, with its own matrices:

$$
\text{head}_i = \text{Attention}(XW^Q_i,\; XW^K_i,\; XW^V_i)
$$

In BERT-base, for a doc of $n$ tokens:

1. 12 heads, each with its own $W^Q_i, W^K_i, W^V_i$ of size $768 \times 64$, so each head has its own queries, keys, values and its own percentages.
2. Each head gives every token a 64-number vector, $n \times 64$.
3. Concat glues the 12 side by side: $n \times (12 \times 64) = n \times 768$.
4. $W^O$ ($768 \times 768$) mixes the heads' pieces back into one 768-number vector per token.

```figure concat
One token, "bank", with 3 heads of 2 numbers each. In BERT: 12 heads of 64, glued into 768.
```

**Why $W^O$?** After the concat, every head's output still sits in its own slots: numbers 1 to 64 are only head 1, 65 to 128 only head 2, and so on. No number knows what the other heads found. $W^O$ is one more learned matrix ($768 \times 768$, learned like $W^Q$, nobody designs it) that fixes this: each output number is a weighted sum of *all* 768 concat numbers, so it can combine "head 1 saw river" with "head 2 saw flows". The "O" is for output. And the result is 768 numbers again, the same size as the token's vector, so it can be added back to it (that's the [Add in Add & Norm](#note-plumbing)).

So 12 heads × 64 costs about the same as one big head of 768. The toy above has a single head, so what you see is $\text{head}_1$. With 12, "bank" could put most of its attention on "river" in one head, and on "flows" in another.
````

````note learned-weights Where $W^Q$, $W^K$, $W^V$ come from
They're just grids of numbers, called parameters. In BERT each one is 768 × 64, and every head in every layer has its own three, so:

$$
\underbrace{12}_{\text{layers}} \times \underbrace{12}_{\text{heads}} \times \underbrace{3}_{Q,K,V} \times 768 \times 64 \approx 21.2 \text{ million numbers}
$$

Nobody designs them. They come out of training, the same loop as the embeddings:

1. Start random.
2. Run a sentence through, make a guess.
3. Loss: how wrong, $L = -\log p(\text{correct word})$, where $p$ is the probability the model gave the right word (softmax over all 30,522 vocab scores).
4. Gradient: for every single number $w$, $\frac{\partial L}{\partial w}$, which way to nudge it so the loss goes down. Backpropagation gets all of them in one backward pass.
5. Update: $W \leftarrow W - \eta \, \nabla_W L$, a small step downhill.

Repeat over billions of words. The query/key/value "roles" are never programmed in, they show up because they help guess better.

Here $W^Q$ and $W^K$ start random, and we pretend the task needs "bank" to look at "river" (riverbank, not money bank), so the loss is $-\log a_{\text{bank} \to \text{river}}$. Only $W^Q$ and $W^K$ here, because they're the ones that decide *who looks at whom*: the percentages come from $\mathbf q \cdot \mathbf k$ only. $W^V$ decides *what gets handed over* once those percentages are set, so it can't change them, and this toy loss doesn't care about it. In real training, the loss is the guessed word, and that depends on the values too, so $W^V$ gets nudged by the same loop, every step.

```figure train-attention
Each step is the loop above. Watch the matrices change and the loss go down. In real training, nobody sets a goal like "attend to river". The goal is only to guess the hidden word, and patterns like this appear because they help.
```
````

````note gelu ReLU and GELU
A layer without a bend in it is just a matrix multiply, and two matrix multiplies in a row collapse into one: $(\mathbf{x}W_1)W_2 = \mathbf{x}(W_1W_2)$. So 100 such layers would be no smarter than one. The fix is to put a non-linear function between them. That's the FFN (feed-forward network) in every layer:

$$
\text{FFN}(\mathbf{x}) = \text{act}(\mathbf{x} W_1 + \mathbf{b}_1)\, W_2 + \mathbf{b}_2
$$

$\text{act}$ is the activation function, that non-linear bend.

The original transformer used **ReLU**, $\max(0, x)$: negatives become 0. BERT uses **GELU**:

$$
\text{GELU}(x) = x \cdot \Phi(x)
$$

where $\Phi(x)$ is the chance that a normal random number is below $x$, an S-curve from 0 to 1. So instead of a hard yes/no gate like ReLU, it lets through more of $x$ the bigger $x$ is. Negatives get squashed to near 0 (it even dips to about −0.17), and there's no sharp corner.

```figure activations
GELU is a smooth ReLU. BERT's code uses a tanh approximation of Φ.
```

Why bother? ReLU's slope is exactly 0 for all negatives, so a unit stuck there gets no training signal at all ("dead ReLU"). GELU's slope changes smoothly and isn't 0 for small negatives. In practice, it trains a bit smoother. Not a huge deal, but it's what BERT and GPT picked.
````

````note plumbing Residual connections and layer norm
Two small things around attention and the FFN in every layer, "Add & Norm":

**Residual (Add).** The layer doesn't replace a token's vector, it adds its output to it: $\mathbf{x} + \text{Attention}(\mathbf{x})$. So the word keeps what it was and gains context on top, and with 12 layers stacked, nothing important gets lost on the way.

**Layer norm (Norm).** Then rescale the vector so its numbers have mean 0 and spread 1, which keeps training stable:

$$
\text{LayerNorm}(\mathbf{x}) = \gamma \odot \frac{\mathbf{x} - \mu}{\sqrt{\sigma^2 + \epsilon}} + \beta
$$

$\mu$ and $\sigma^2$ are the mean and variance of the vector's own numbers, and $\gamma$, $\beta$ are learned.
````

````note transformer-family Transformer vs BERT vs GPT
The transformer (2017) was built to translate. It has two halves: an **encoder** that reads the input sentence, and a **decoder** that writes the output one word at a time. The decoder's attention is *masked*: a word can only look at the words before it, because it can't peek at words it hasn't written yet. It also has an extra attention that looks at the encoder's output.

BERT kept only the encoder. No decoder, no mask, every token sees every other token, left and right. That's the "B" in BERT: **B**idirectional **E**ncoder **R**epresentations from **T**ransformers. But with no mask, you can't train it by "predict the next word" (the next word is right there to look at), so it's trained by hiding words instead. That's MLM.

GPT kept only the decoder, masked, and is trained to predict the next word, which is why it can write.

| | Transformer (2017) | BERT-base | GPT-2 small |
| --- | --- | --- | --- |
| parts | 6 encoders + 6 decoders | 12 encoders | 12 decoders |
| vector size | 512 | 768 | 768 |
| heads | 8 | 12 | 12 |
| attention | encoder full, decoder masked | full, both directions | masked, left only |
| positions | sine waves | learned, max 512 | learned |
| trained to | translate | fill in [MASK] | predict the next word |

For search, we want BERT: we're not writing text, we want a vector for every token that understands both sides of it.
````

````note mlm-head What's inside the MLM head
For a token $i$ with final vector $\mathbf{h}_i$, the score for vocab token $j$ is:

$$
w_{ij} = \text{transform}(\mathbf{h}_i)^\top E_j + b_j
$$

- $\text{transform}$ is one more small layer (a matrix, a GELU, a layer norm).
- $E_j$ is row $j$ of the **same embedding matrix** from step 2. BERT reuses it at the output.
- $b_j$ is one learned number per vocab token.

So the score is a dot product between the token's final vector and each vocab word's embedding row: "how much does what this token became look like word $j$". The dot product is big when two vectors point the same way, so a word scores high when its embedding points the same way as what this position became after 12 layers, and negative when it points away.

All 30,522 scores come out of one matrix multiply, the polished vector against the whole embedding matrix:

$$
\underbrace{\text{transform}(\mathbf{h}_i)}_{1 \times 768} \; \underbrace{E^\top}_{768 \times 30522} + \mathbf{b} = \underbrace{[\,w_{i1}, \dots, w_{i,30522}\,]}_{1 \times 30522}
$$

These raw scores are the **logits**. For training, a softmax turns them into probabilities, that's the $p(\text{bank})$ in the loss. SPLADE skips the softmax and takes the logits directly: this is exactly the $w_{ij}$ in SPLADE's formula.

One detail on the masking: of the 15% of tokens picked for guessing, BERT replaces 80% with `[MASK]`, 10% with a random token, and leaves 10% unchanged. So the model can't just wait for a `[MASK]`, it has to make good guesses even at positions that look normal, which is lucky for SPLADE, because SPLADE reads the head for every token of a normal, unmasked doc.
````

````note sum-vs-max Sum vs max
The first SPLADE paper (2021) combined the tokens with a sum:

$$
w_j = \sum_{i \in \text{doc}} \log\big(1 + \text{ReLU}(w_{ij})\big)
$$

So a vocab word that many tokens vote for a little can add up to a big weight, and longer docs get bigger weights overall. SPLADE v2 switched to max: a vocab word's weight is its single strongest signal anywhere in the doc. In their experiments, max gave almost 2 points more MRR@10 on MS MARCO, and it's been the default since ("SPLADE-max").

SPLADE v2 also added distillation: a slower, stronger model (a cross-encoder that reads the query and the doc together) scores training pairs, and SPLADE is trained to match its score margins, with harder negatives than BM25's. That's "DistilSPLADE-max" in the table, the 36.8.
````

````note flops The FLOPS regularizer
For a batch of $N$ docs, take the average weight of each vocab token $j$ across them:

$$
\bar{a}_j = \frac{1}{N} \sum_{i=1}^{N} w_j^{(d_i)}
$$

and the penalty is the sum of their squares:

$$
\ell_{\text{FLOPS}} = \sum_{j \in V} \bar{a}_j^{\,2}
$$

Why squared? Without the square (that's plain L1), every unit of weight costs the same, no matter where it is. With the square, a token that's active in *lots* of docs has a big $\bar{a}_j$, and its cost grows much faster. Those are exactly the tokens with long posting lists.

The name: the cost of scoring a query against a doc is roughly the number of tokens both have non-zero, and its average over queries and docs is $\sum_j p_j^{(q)} p_j^{(d)}$, where $p_j$ is how often token $j$ is active. The regularizer is a smooth stand-in (a relaxation) for that, so it aims at search cost, not just "fewer non-zeros". It's a proxy though, not the actual overlap of a real query and doc, and it doesn't set weights to exactly 0 or fix how many survive: it makes weights small and spreads them out, and the ReLU does the zeroing. It comes from an earlier paper by [Paria et al.](https://arxiv.org/abs/2004.05665), SPLADE picked it up.

Also, the paper ramps $\lambda$ up slowly (quadratically) over the first 50k training steps, so the model first learns to rank and only then gets squeezed.
````

````note splade-doc SPLADE-doc
In SPLADE-doc, only the docs go through the model. The query is not expanded and not weighted, it's just its tokens, and the score is the sum of the doc's weights for them:

$$
s(q, d) = \sum_{j \in q} w_j^{(d)}
$$

So all the BERT work happens offline at index time, and search is as cheap as BM25. The doc expansion still does the heavy lifting (a doc about a marathon already has "run" in its vector). It's a bit worse than full SPLADE (32.2 vs 34.0 MRR@10 in the v2 paper), but no model at query time.
````
