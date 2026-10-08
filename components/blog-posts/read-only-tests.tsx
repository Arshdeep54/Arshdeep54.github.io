import { Lede, H2, P, Pull, Note, Fig, CodePanel, Table, Closing, Sources } from "@/components/blog-prose"

function Box({ x, y, width, lines, writable = false }: {
  x: number; y: number; width: number; lines: string[]; writable?: boolean
}) {
  return (
    <g className="font-mono" fill="currentColor">
      <rect x={x} y={y} width={width} height={30 + lines.length * 24} rx="4" fill="currentColor" fillOpacity=".025" stroke="currentColor" strokeDasharray={writable ? "5 4" : undefined} />
      {lines.map((line, i) => <text key={line} x={x + 16} y={y + 26 + i * 24} fontSize="12">{line}</text>)}
    </g>
  )
}

function WorkspaceDiagram() {
  return (
    <Fig caption="Figure 1. Read-only tests and writable workspace code enter the same pytest runtime. The controller trusts that process's exit status.">
      <svg viewBox="0 0 660 260" role="img" aria-label="Writable checkout.py and conftest.py feed the same pytest process as a protected test file. A separate controller converts the process exit code to reward." className="w-full h-auto min-w-[660px] text-muted-foreground">
        <defs><marker id="rt-workspace" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" /></marker></defs>
        <text x="16" y="20" fontSize="11" className="font-mono" fill="currentColor">DASHED = AGENT WRITABLE · SOLID = CONTROLLER OWNED</text>
        <Box x={16} y={44} width={222} lines={["/task", "checkout.py", "conftest.py"]} writable />
        <Box x={16} y={174} width={222} lines={["tests/test_checkout.py", "read-only mount"]} />
        <Box x={318} y={107} width={142} lines={["pytest process", "imports both sides"]} />
        <Box x={508} y={107} width={135} lines={["controller", "exit → reward"]} />
        <path d="M238 94 H286 V132 H318 M238 213 H286 V156 H318 M460 144 H508" fill="none" stroke="currentColor" markerEnd="url(#rt-workspace)" />
      </svg>
    </Fig>
  )
}

function CollectionDiagram() {
  return (
    <Fig caption="Figure 2. The test files do not change. The hook marks the collected items skipped, so neither assertion executes.">
      <svg viewBox="0 0 660 270" role="img" aria-label="Two unchanged assertions enter a collection hook. The hook skips both tests. Pytest exits zero, and the naive grading rule awards one despite zero assertions executing." className="w-full h-auto min-w-[660px] text-muted-foreground">
        <defs><marker id="rt-collection" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" /></marker></defs>
        <text x="16" y="20" fontSize="11" className="font-mono" fill="currentColor">FILE CONTENT ≠ EXECUTED CHECKS</text>
        <Box x={16} y={44} width={226} lines={["unchanged assertions", "total([5, 7]) == 12", "total([10, 20]) == 30"]} />
        <Box x={304} y={44} width={340} lines={["agent's collection hook", "small order → skipped", "large order → skipped"]} writable />
        <Box x={304} y={172} width={340} lines={["2 skipped · exit 0 · reward 1", "zero assertions executed"]} />
        <path d="M242 94 H304 M474 146 V172" fill="none" stroke="currentColor" markerEnd="url(#rt-collection)" />
        <text x="16" y="264" fontSize="11" className="font-mono" fill="currentColor">No test edits. No sandbox escape. A grading contract failure.</text>
      </svg>
    </Fig>
  )
}

function BoundaryDiagram() {
  return (
    <Fig caption="Figure 3. The candidate produces an answer. The separate evaluator owns the expected answer and decides whether to award credit.">
      <svg viewBox="0 0 660 350" role="img" aria-label="The evaluator sends prices five and seven to an isolated candidate. It receives zero, compares with its own expected twelve, and awards zero. Expected answers and reward credentials are outside the candidate sandbox." className="w-full h-auto min-w-[660px] text-muted-foreground">
        <defs><marker id="rt-boundary" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" /></marker></defs>
        <text x="16" y="20" fontSize="11" className="font-mono" fill="currentColor">SOLID = EVALUATOR · DASHED = UNTRUSTED EXECUTION</text>
        <rect x="16" y="44" width="257" height="285" rx="4" fill="currentColor" fillOpacity=".025" stroke="currentColor" />
        <rect x="390" y="44" width="254" height="285" rx="4" fill="none" stroke="currentColor" strokeDasharray="5 4" />
        <g className="font-mono" fontSize="12" fill="currentColor">
          <text x="34" y="74">evaluator</text><text x="34" y="107">input: [5, 7]</text><text x="34" y="132">expected: 12</text>
          <text x="34" y="235">received: 0</text><text x="34" y="260">0 == 12 → false</text><text x="34" y="300">credit: 0</text>
          <text x="408" y="74">candidate sandbox</text><text x="408" y="107">checkout.py</text>
          <text x="408" y="155">total([5, 7])</text><text x="408" y="180">returns 0</text>
          <text x="408" y="260" fontSize="11">no expected answers</text><text x="408" y="282" fontSize="11">no reward credentials</text>
        </g>
        <path d="M273 151 H390 M390 214 H273" fill="none" stroke="currentColor" markerEnd="url(#rt-boundary)" />
        <text x="331" y="140" textAnchor="middle" fontSize="10.5" className="font-mono" fill="currentColor">input only</text>
        <text x="331" y="202" textAnchor="middle" fontSize="10.5" className="font-mono" fill="currentColor">answer only</text>
      </svg>
    </Fig>
  )
}

export default function ReadOnlyTests() {
  return (
    <>
      <Lede>
        Give a coding agent a repository, a terminal, and a reward whenever the tests pass.
        Then mount the tests read-only so it cannot rewrite the answer key. That sounds sensible.
        But broken code can still earn the reward without changing a single test. The gap is
        between protecting the test files and controlling what happens when they run.
      </Lede>
      <P>
        We will reproduce that gap with a tiny checkout function, try the obvious fix, and see
        why the evaluator needs a stronger boundary. Basic Python and the idea of an RL reward
        are enough to follow the examples. The production details come after the demonstration.
      </P>
      <nav aria-label="In this article" className="my-8 border-y border-border py-4 text-sm">
        <p className="mb-3 text-foreground font-medium">In this article</p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li><a href="#score" className="underline underline-offset-4">What the score actually measures</a></li>
          <li><a href="#workspace" className="underline underline-offset-4">The protected tests and writable workspace</a></li>
          <li><a href="#skip" className="underline underline-offset-4">Two skipped tests, one reward</a></li>
          <li><a href="#import" className="underline underline-offset-4">Why disabling the hook is not enough</a></li>
          <li><a href="#boundary" className="underline underline-offset-4">Let the candidate answer; let the evaluator judge</a></li>
          <li><a href="#production" className="underline underline-offset-4">Keep the grade attached to the right run</a></li>
          <li><a href="#reproduce" className="underline underline-offset-4">Run the demonstration yourself</a></li>
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">Wide code blocks and figures scroll horizontally on small screens.</p>
      </nav>

      <H2 id="score">What the score actually measures</H2>
      <P>
        In reinforcement learning, the agent takes actions and receives a numerical reward.
        The training algorithm uses that feedback to update its policy, the model that chooses
        actions. Here, the rule is simple: one point for a passing submission, zero otherwise.
      </P>
      <P>
        A grader turns a submission into that number. If it awards a point when the code is still
        wrong, the training system receives a positive signal for the wrong outcome. It measures
        whatever the grader accepts, even when that differs from solving the task.
      </P>
      <P>
        Changing the mechanism that produces reward is called <strong className="text-foreground">reward
        tampering</strong>. Anthropic studied it in controlled language-model experiments, with
        important limits on what those experiments say about production agents.{" "}
        <a href="https://www.anthropic.com/research/reward-tampering" className="underline underline-offset-4">The original research</a>
        {" "}provides context. Our example demonstrates an available exploit path; it does not
        show an agent independently discovering it or measure how often agents would use it.
      </P>

      <H2 id="workspace">The files are protected. The execution is not.</H2>
      <P>
        The task is to implement <code>total(prices)</code>. The agent can edit files in{" "}
        <code>/task</code>, except the tests, which are mounted read-only. It can run arbitrary
        Python there. The controller, the program managing the grading job, owns the tests and
        launches pytest. The agent cannot change the controller or the mount. These permissions
        are our threat model: what the agent is allowed to control.
      </P>
      <CodePanel title="the workspace">
{`task/
├── checkout.py             # agent can edit
├── conftest.py             # agent can create
└── tests/                  # read-only test mount
    └── test_checkout.py`}
      </CodePanel>
      <P>The candidate is the submitted implementation. Start with a broken one:</P>
      <CodePanel title="checkout.py · agent-controlled">
{`def total(prices):
    return 0`}
      </CodePanel>
      <P>The controller&apos;s two tests require different totals. Returning zero fails both.</P>
      <CodePanel title="tests/test_checkout.py · controller-owned">
{`from checkout import total

def test_small_order():
    assert total([5, 7]) == 12

def test_large_order():
    assert total([10, 20]) == 30`}
      </CodePanel>
      <P>
        The controller starts a child process and reads its exit status. Zero conventionally means
        the command succeeded. Our vulnerable grader assumes that means the required assertions passed.
      </P>
      <CodePanel title="the vulnerable grading rule · /task is the example workspace">
{`import subprocess
import sys

result = subprocess.run(
    [sys.executable, "-m", "pytest", "-q", "tests/test_checkout.py"],
    cwd="/task", capture_output=True, text=True, timeout=10,
)
reward = int(result.returncode == 0)`}
      </CodePanel>
      <P>
        pytest loads the protected tests and the candidate into the same Python process. It also
        loads local hooks: functions called at particular stages of a test run. A parent directory&apos;s{" "}
        <code>conftest.py</code> can supply hooks for the tests below it. Here, that parent directory
        is writable by the agent.{" "}
        <a href="https://docs.pytest.org/en/stable/how-to/writing_plugins.html" className="underline underline-offset-4">pytest documents this discovery behavior.</a>
      </P>
      <WorkspaceDiagram />

      <H2 id="skip">Two skipped tests, one successful process</H2>
      <P>
        Keep the broken function. Add the hook below to <code>conftest.py</code>. It runs after
        collection, when pytest has found the tests to run. Each item represents one test. The
        hook marks both skipped, so neither test body executes.
      </P>
      <CodePanel title="conftest.py · agent-controlled">
{`import pytest

def pytest_collection_modifyitems(items):
    for item in items:
        item.add_marker(pytest.mark.skip(reason="not this run"))`}
      </CodePanel>
      <P>
        pytest reports two skipped tests and exits zero. The grader awards one point. The function
        still returns zero, and neither assertion ran. No protected file needed to change.
      </P>
      <CollectionDiagram />
      <CodePanel title="demonstration outcomes · timings omitted">
{`submission                         pytest result     exit    reward
----------------------------------------------------------------
return 0                           2 failed          1       0
return 0 + skip hook               2 skipped         0       1
return 0 + skip hook + --noconftest  2 failed          1       0`}
      </CodePanel>
      <P>
        This is normal pytest behavior, not a bug in pytest. Skipping can be useful in an ordinary
        test suite. The bug is our controller treating a run with no failures as proof that the
        required assertions passed. Removing all collected tests would be different: pytest normally
        exits five when it finds no tests.{" "}
        <a href="https://docs.pytest.org/en/stable/reference/exit-codes.html" className="underline underline-offset-4">Its exit codes</a>
        {" "}describe process outcomes; our task still needs its own acceptance rule.
      </P>
      <P>
        For RL, that distinction matters immediately: this submission receives the same positive
        score as a correct implementation. The feedback no longer distinguishes solving the task
        from bypassing its checks. This demonstration establishes the faulty signal, not what a
        particular training run will learn from it.
      </P>
      <Pull>Read-only protects the answer key. It does not establish who controls the exam.</Pull>

      <H2 id="import">Remove the hook. Then look one layer deeper.</H2>
      <P>
        Add <code>--noconftest</code> to the controller&apos;s pytest command. It blocks this hook,
        and the broken function fails again. In a controlled grading environment, also select a
        controller-owned configuration and disable automatic loading of installed plugins.
      </P>
      <CodePanel title="deployment sketch · paths supplied by the controller">
{`PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /opt/venv/bin/python -m pytest \\
    --noconftest -c /grader/pytest.ini /task/tests/test_checkout.py`}
      </CodePanel>
      <P>
        These flags close specific routes. They do not make the submitted code trusted. The
        controller must also control arguments and environment variables, including explicit
        plugin requests; disabling autoload does not disable every plugin-loading mechanism.{" "}
        <a href="https://docs.pytest.org/en/stable/how-to/plugins.html" className="underline underline-offset-4">The plugin guide explains the distinction.</a>
      </P>
      <P>
        More fundamentally, the tests still import <code>checkout.py</code>. Python executes a
        module&apos;s top-level statements during import. Replace the function with this:
      </P>
      <CodePanel title="checkout.py · exits before the assertions run">
{`import os
os._exit(0)`}
      </CodePanel>
      <P>
        Even with <code>--noconftest</code>, the process exits zero before running the assertions,
        and our grader awards one. <code>os._exit</code> terminates the process directly, without
        normal cleanup or flushing buffered output.{" "}
        <a href="https://docs.python.org/3/library/os.html#os._exit" className="underline underline-offset-4">Python documents that behavior.</a>
      </P>
      <P>
        Requiring a complete report and the expected test count would reject this empty result.
        But if candidate code runs inside the process producing the report, that report alone
        cannot prove the checks ran. Disabling the hook fixed one entry point. It did not separate
        the candidate from the machinery judging it.
      </P>

      <H2 id="boundary">Let the candidate answer. Let the evaluator judge.</H2>
      <P>
        Before choosing a defense, separate three problems that are often grouped together as
        reward hacking. A hardcoded answer, a skipped assertion, and an old result need different fixes.
      </P>
      <Table head={["Failure", "Example", "Defense"]} rows={[
        ["Weak specification", "Code recognizes our two example orders but cannot total other orders.", "Broader and held-out cases, property checks, and a better task definition."],
        ["Evaluator tampering", "Candidate code skips the checks or terminates the runner.", "Control runner inputs and check answers outside candidate execution where the task permits it."],
        ["Result substitution", "Yesterday’s passing result is accepted for today’s patch.", "Freeze the submission and accept only the evaluator’s result for the requested attempt."],
      ]} />
      <P>
        For our function task, an evaluator can own the inputs, expected answers, and scoring rule.
        The controller asks it to grade a frozen copy of the submission, called a snapshot. A
        candidate worker runs that code in isolation and returns an answer. The evaluator checks
        the answer without importing candidate code into its own interpreter.
      </P>
      <P>
        For <code>[5, 7]</code>, the evaluator expects twelve. A reply of zero earns no credit.
        An early exit supplies no answer to compare. A successful exit or a line saying
        &ldquo;tests passed&rdquo; cannot replace the requested result.
      </P>
      <BoundaryDiagram />
      <CodePanel title="architecture sketch · the same all-or-nothing reward">
{`cases = [([5, 7], 12), ([10, 20], 30)]
passed = 0

for prices, expected in cases:
    reply = run_candidate(snapshot, {"prices": prices})
    if not reply.completed or not valid_total(reply.output):
        continue
    passed += int(reply.output["total"] == expected)

reward = int(passed == len(cases))`}
      </CodePanel>
      <P>
        The evaluator checks that the reply arrived before the deadline and contains a bounded
        JSON response with an integer <code>total</code>. It records missing or invalid replies
        separately; neither earns credit. <code>run_candidate</code> represents an execution service
        with an enforced isolation boundary. This is a design sketch, not a runnable secure evaluator.
      </P>
      <P>
        Another process ID is not enough. A child running as the same user can share filesystem
        access and other privileges with its parent. The worker needs no access to evaluator
        credentials, host workspace files, or evaluator processes; it also needs restricted network
        access and limits on CPU, memory, output, and time. Containers, application sandboxes, and
        microVMs offer different costs and guarantees. Access to the host&apos;s Docker daemon can
        hand control of that infrastructure back to the worker.{" "}
        <a href="https://docs.docker.com/engine/security/" className="underline underline-offset-4">Docker explains this boundary.</a>
      </P>
      <Note label="where this works">
        A function with a simple input/output contract is easy to check from outside. A web server,
        compiler, or whole repository may need richer interactions and fixtures. Putting pytest
        in another container can contain execution while leaving candidate code able to interfere
        with its runner inside that container. State what the outside evaluator can observe and
        what it still trusts.
      </Note>
      <P>
        This separation protects who decides the grade. It does not make two test cases a complete
        specification. Hidden and varied cases help with hardcoding, but a test in the same process
        as arbitrary candidate code is not secret just because its file is hidden.
      </P>

      <H2 id="production">Keep the grade attached to the right run</H2>
      <P>
        We have separated the answer from the judgment. Production grading needs three more
        bookkeeping rules so that judgment describes the code we actually submitted.
      </P>
      <h3 className="mt-8 mb-3 text-lg font-medium">Freeze the files before grading</h3>
      <P>
        Suppose a background process replaces <code>checkout.py</code> after the controller hashes
        it but before the worker reads it. The hash describes one version; the grade describes
        another. This is a time-of-check/time-of-use race: something changed between checking and using it.
      </P>
      <P>
        Stop writes or take an atomic snapshot first. Store the frozen submission, compute its
        digest, and grade that exact stored copy. A digest is a fingerprint of bytes; hashing a
        changing directory does not freeze it. If submissions arrive as archives, reject paths
        that escape the destination and disallowed symlinks before sending files to the worker.
      </P>
      <h3 className="mt-8 mb-3 text-lg font-medium">Accept the evaluator&apos;s result for this attempt</h3>
      <P>
        Yesterday&apos;s passing result says nothing about today&apos;s patch. Each result should
        identify the task episode, grading attempt, submission digest, grading image, test suite,
        and case counts. The controller matches those fields to its job and accepts each attempt
        at most once. This prevents an old or duplicate result from standing in for the requested run.
      </P>
      <P>
        Identity fields alone are not proof of who sent them. Accept results through a channel
        only the evaluator can write to, or verify a signature whose key stays outside the worker.
        A hash identifies content; it does not authenticate the sender. Matching identity also
        cannot prove that the evaluator&apos;s checks cover the whole task.
      </P>
      <h3 className="mt-8 mb-3 text-lg font-medium">Record failures without retrying until success</h3>
      <P>
        A wrong answer, candidate timeout, crashed evaluator, and mismatched submission are different
        outcomes. None is a passing task. You might count a candidate timeout as failure under a
        fixed budget, but retry a verified infrastructure fault with the same frozen submission
        and a new attempt ID. Set bounded retries and keep those outcomes visible.
      </P>
      <P>
        If you discard every timeout, the training data no longer represents every attempted
        submission. Failure handling changes which attempts contribute feedback. It is part of
        the learning setup, not just operational housekeeping.
      </P>
      <P>
        These rules cost storage, execution services, startup time, and freedom to reuse a
        repository&apos;s normal test setup. For a production training loop, that cost buys a
        clearer answer to what ran, which submission it used, and who decided the reward.
      </P>

      <H2 id="reproduce">Run the demonstration yourself</H2>
      <P>
        <a href="/examples/read-only-tests.py" download className="underline underline-offset-4">Download the self-checking demonstration</a>
        {" "}and run it in a fresh virtual environment. It creates a temporary workspace, reproduces
        all four outcomes, checks that the test bytes stayed unchanged, and removes the workspace
        afterward. It uses Python 3.12 and the pinned pytest version below.
      </P>
      <CodePanel title="local reproduction · run beside the downloaded file">
{`python3.12 -m venv .venv
.venv/bin/python -m pip install pytest==8.4.2
.venv/bin/python read-only-tests.py`}
      </CodePanel>
      <Note label="demonstration limits">
        This is a local reproduction, not a sandbox for untrusted submissions. It protects the test
        file with permissions rather than an OS read-only mount; no example attempts a test-file
        write. A real read-only mount blocks edits but does not by itself stop parent-directory
        hooks or candidate code executing during import. No RL model is trained by this script.
      </Note>
      <Closing>
        An unchanged test file does not prove that its assertions ran. For this function task,
        let candidate code produce an answer and let an isolated evaluator check it. Bind that
        evaluation to the frozen submission and the requested attempt. Then ask whether the checks
        capture the task: even a trustworthy grade can measure the wrong thing. The training loop
        needs both a trustworthy evaluator and a reward that means the task was solved.
      </Closing>
      <Sources heading="Sources and implementation details" items={[
        { label: "Anthropic: a controlled study of reward tampering", href: "https://www.anthropic.com/research/reward-tampering" },
        { label: "pytest: plugin and conftest discovery", href: "https://docs.pytest.org/en/stable/how-to/writing_plugins.html" },
        { label: "pytest: collection hooks", href: "https://docs.pytest.org/en/stable/how-to/writing_hook_functions.html" },
        { label: "pytest: skipping and expected failures", href: "https://docs.pytest.org/en/stable/how-to/skipping.html" },
        { label: "pytest: exit codes", href: "https://docs.pytest.org/en/stable/reference/exit-codes.html" },
        { label: "pytest: controlling plugin loading", href: "https://docs.pytest.org/en/stable/how-to/plugins.html" },
        { label: "Python: os._exit", href: "https://docs.python.org/3/library/os.html#os._exit" },
        { label: "Docker: daemon access and the host security boundary", href: "https://docs.docker.com/engine/security/" },
      ]} />
    </>
  )
}
