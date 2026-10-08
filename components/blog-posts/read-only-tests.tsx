import { Lede, H2, P, Pull, Note, Fig, CodePanel, Table, Closing, Sources } from "@/components/blog-prose"

function Box({ x, y, width, lines, writable = false }: {
  x: number; y: number; width: number; lines: string[]; writable?: boolean
}) {
  return (
    <g className="font-mono" fill="currentColor">
      <rect x={x} y={y} width={width} height={30 + lines.length * 24} rx="4" fill="currentColor" fillOpacity=".025" stroke="currentColor" strokeDasharray={writable ? "5 4" : undefined} />
      {lines.map((line, i) => <text key={line} x={x + 16} y={y + 26 + i * 24} fontSize={i === 0 ? 12 : 11}>{line}</text>)}
    </g>
  )
}

function WorkspaceDiagram() {
  return (
    <Fig caption="Figure 1. Read-only tests and writable workspace code enter the same pytest runtime. The controller trusts that process's exit status.">
      <svg viewBox="0 0 660 260" role="img" aria-label="Writable checkout.py and conftest.py feed the same pytest process as a protected test file. A separate controller converts the process exit code to reward." className="w-full h-auto min-w-[540px] text-muted-foreground">
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
      <svg viewBox="0 0 660 270" role="img" aria-label="Two unchanged assertions enter a collection hook. The hook skips both tests. Pytest exits zero, and the naive grading rule awards one despite zero assertions executing." className="w-full h-auto min-w-[540px] text-muted-foreground">
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
      <svg viewBox="0 0 660 350" role="img" aria-label="The evaluator sends prices five and seven to an isolated candidate. It receives zero, compares with its own expected twelve, and awards zero. Expected answers and reward credentials are outside the candidate sandbox." className="w-full h-auto min-w-[540px] text-muted-foreground">
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

function ReceiptDiagram() {
  return (
    <Fig caption="Figure 4. Bind the grade to the requested submission and attempt. Matching identity does not prove that the evaluator's logic is correct.">
      <svg viewBox="0 0 660 260" role="img" aria-label="The controller expects episode 104 attempt two, submission a71f, and suite b402. A result for old submission 92bd is rejected. A matching result is accepted once, only through the authorized evaluator's channel." className="w-full h-auto min-w-[540px] text-muted-foreground">
        <text x="16" y="20" fontSize="11" className="font-mono" fill="currentColor">THE RESULT MUST DESCRIBE THE REQUESTED RUN</text>
        <Box x={16} y={44} width={628} lines={["controller expects: ep-104 / attempt-2", "submission a71f… · suite b402…"]} />
        <Box x={16} y={145} width={298} lines={["old result: submission 92bd…", "identity mismatch → reject"]} />
        <Box x={346} y={145} width={298} lines={["new result: submission a71f…", "matching run → accept once"]} />
        <text x="16" y="251" fontSize="11" className="font-mono" fill="currentColor">Both records must also come from the authorized evaluator.</text>
      </svg>
    </Fig>
  )
}

export default function ReadOnlyTests() {
  return (
    <>
      <Lede>
        Give a coding agent a repository, a terminal, and a reward whenever the tests pass.
        Then mount the tests read-only so it cannot rewrite the answer key. That sounds like a
        sensible boundary. There is one problem: the agent does not need to change a test file
        to change what happens when the test runner starts.
      </Lede>

      <H2>The score is part of the training system</H2>
      <P>
        In reinforcement learning, the agent tries a sequence of actions and receives a numerical
        reward. The training algorithm uses that feedback to update the policy, the model that
        chooses its next actions. A coding task might award one point when a proposed fix passes
        its checks, and zero otherwise. We will use that deliberately simple rule here.
      </P>
      <P>
        A grader is the program that turns the submission into that score. Its job sounds small:
        run the tests, read the outcome, return a number. But the model is being optimized against
        whatever this program actually measures. If the score can increase without the code getting
        better, the feedback has stopped representing the task.
      </P>
      <P>
        Researchers call changing the mechanism that produces reward <strong className="text-foreground">reward
        tampering</strong>. Anthropic has studied it in controlled language-model experiments; that
        does not establish how often a particular production agent would attempt it. We do not
        need to make that claim to examine a vulnerable grader. Its security should not depend on
        the current model declining to use the permissions it has.{" "}
        <a href="https://www.anthropic.com/research/reward-tampering" className="underline underline-offset-4">The original research</a>
        {" "}is useful context; the small example below is a separate demonstration.
      </P>

      <H2>The files are protected. The execution is not.</H2>
      <P>
        Suppose the task is to implement <code>total(prices)</code>. The agent can edit{" "}
        <code>checkout.py</code> and create other files in <code>/task</code>. The controller mounts
        its own tests at <code>/task/tests</code> read-only, then runs pytest from <code>/task</code>.
        The agent cannot alter that mount or the controller&apos;s code. It can execute arbitrary
        Python in its workspace. Those permissions are the threat model, the capabilities we are
        assuming when we ask what can go wrong.
      </P>
      <CodePanel title="the deliberately small workspace">
{`task/
├── checkout.py             # agent can edit
├── conftest.py             # agent can create
└── tests/                  # read-only test mount
    └── test_checkout.py`}
      </CodePanel>
      <P>
        The tests are straightforward. Two different orders need two different totals. An
        implementation that always returns zero fails both.
      </P>
      <CodePanel title="tests/test_checkout.py · controller-owned">
{`from checkout import total

def test_small_order():
    assert total([5, 7]) == 12

def test_large_order():
    assert total([10, 20]) == 30`}
      </CodePanel>
      <P>
        Our controller launches pytest in a child process and turns a successful process exit into
        reward. <code>returncode</code> is the operating system&apos;s exit status for that process.
        The code below assumes that zero means the required checks actually passed.
      </P>
      <CodePanel title="the vulnerable grading rule">
{`result = subprocess.run(
    [sys.executable, "-m", "pytest", "-q", "tests/test_checkout.py"],
    cwd="/task", capture_output=True, text=True, timeout=10,
)
reward = int(result.returncode == 0)`}
      </CodePanel>
      <P>
        There are now two inputs to the same Python process: protected tests and agent-controlled
        code. pytest also supports local configuration and hooks, functions it calls at particular
        stages of a run. A <code>conftest.py</code> in a parent directory can supply those hooks to
        tests underneath it. In this layout, the writable workspace is that parent directory.{" "}
        <a href="https://docs.pytest.org/en/stable/how-to/writing_plugins.html" className="underline underline-offset-4">pytest documents that discovery behavior.</a>
      </P>
      <WorkspaceDiagram />

      <H2>Two skipped tests, one successful process</H2>
      <P>
        Keep <code>checkout.py</code> broken: <code>total</code> still returns zero. Now add this
        workspace hook. It runs after pytest has collected the test items and adds a skip marker
        to every item. Collection means finding the checks to run; a skip means a check exists
        but its test body will not execute. These are ordinary{" "}
        <a href="https://docs.pytest.org/en/stable/how-to/writing_hook_functions.html" className="underline underline-offset-4">pytest hook mechanics</a>,
        {" "}used in the wrong trust relationship.
      </P>
      <CodePanel title="conftest.py · agent-controlled">
{`import pytest

def pytest_collection_modifyitems(items):
    for item in items:
        item.add_marker(pytest.mark.skip(reason="not this run"))`}
      </CodePanel>
      <P>
        pytest reports two skipped tests and exits zero. The grader awards one point. The
        implementation is still wrong, and neither assertion ran. The protected files did their
        job: their contents are unchanged. They were never the thing this hook needed to change.
      </P>
      <CollectionDiagram />
      <Note label="verified example">
        These outcomes were reproduced with Python 3.12 and pytest 8.4.2. The test file&apos;s bytes
        were checked before and after. The local demonstration used file permissions, not an OS
        read-only mount; no step attempted to write the tests. A real read-only mount blocks edits
        but does not, by itself, stop loading a hook from the writable parent directory.
      </Note>
      <CodePanel title="observed outcomes · durations omitted">
{`submission                         pytest result     exit    reward
----------------------------------------------------------------
return 0                           2 failed          1       0
return 0 + skip hook               2 skipped         0       1
return 0 + skip hook + --noconftest  2 failed          1       0`}
      </CodePanel>
      <P>
        No tests collected is a different case: pytest normally returns exit code five. The hook
        above does not remove the tests. It leaves both items present and marks them skipped.
        Conflating &ldquo;the command succeeded&rdquo; with &ldquo;the required assertions passed&rdquo;
        is the bug in our grading contract.{" "}
        <a href="https://docs.pytest.org/en/stable/reference/exit-codes.html" className="underline underline-offset-4">pytest&apos;s exit-code reference</a>
        {" "}describes the process outcomes, not your task&apos;s acceptance policy.
      </P>
      <Pull>Read-only protects the answer key. It does not establish who controls the exam.</Pull>

      <H2>Remove the hook. Then look one layer deeper.</H2>
      <P>
        One fix is immediate: disable workspace <code>conftest.py</code> discovery for this grading
        run. Also choose a controller-owned configuration file and prevent automatic loading of
        installed third-party plugins. The controller must supply the environment and arguments;
        accepting an agent-provided command would move the same problem somewhere else.
      </P>
      <CodePanel title="one layer of hardening · not a complete sandbox">
{`PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /opt/venv/bin/python -m pytest \\
    --noconftest -c /grader/pytest.ini /task/tests/test_checkout.py`}
      </CodePanel>
      <P>
        <code>--noconftest</code> blocks our collection hook. <code>-c</code> selects the intended
        configuration. <code>PYTEST_DISABLE_PLUGIN_AUTOLOAD=1</code> disables discovery of installed
        plugin entry points, not every possible way to load Python code. Plugins explicitly
        requested through arguments or environment still need a policy. These controls are
        documented in{" "}
        <a href="https://docs.pytest.org/en/stable/how-to/plugins.html" className="underline underline-offset-4">pytest&apos;s plugin guide</a>.
        {" "}They reduce one attack surface; they do not make the candidate implementation trusted.
      </P>
      <P>
        The tests still import <code>checkout.py</code>. Importing a Python module executes its
        top-level statements inside the importing process. Change that module to the following,
        keep <code>--noconftest</code>, and our naive reward rule is broken again.
      </P>
      <CodePanel title="a second failure · candidate code exits the runner">
{`# Executed inside the runner when the tests import checkout.
import os
os._exit(0)`}
      </CodePanel>
      <P>
        In the reproduced run, that process exited zero with no output. The grader again awarded
        one. Python&apos;s <code>os._exit</code> terminates the process directly; it does not prove
        that pytest reached the end of its checks.{" "}
        <a href="https://docs.python.org/3/library/os.html#os._exit" className="underline underline-offset-4">The Python API documents this behavior.</a>
      </P>
      <P>
        Requiring a complete report and the expected number of executed tests would reject this
        particular empty result. But a report produced in a runtime that imports adversarial code
        is still a claim from that runtime. Checking its shape is useful. Treating its shape as
        proof that the checks executed is a stronger conclusion than it supports.
      </P>

      <H2>Move the comparison outside the candidate runtime</H2>
      <P>
        For this small function task, we can draw a clearer boundary. A separate evaluator owns
        the inputs, expected answers, and scoring rule. It sends one input to an isolated candidate
        worker, receives an answer, validates its format, and compares it with the expected value.
        It never imports the candidate code into its own Python interpreter.
      </P>
      <P>
        For <code>[5, 7]</code>, the expected total is twelve. The broken candidate answers zero,
        so the evaluator awards no credit. If the candidate exits early, there is no completed
        answer to compare. Neither a successful exit nor a line saying &ldquo;tests passed&rdquo;
        replaces the answer the evaluator requested. Expected answers and credentials for submitting
        rewards stay outside the candidate sandbox.
      </P>
      <BoundaryDiagram />
      <CodePanel title="the scoring rule belongs to the evaluator">
{`# Architecture sketch. run_candidate is an OS-isolated worker,
# not a plain subprocess with the grader's credentials.
cases = [([5, 7], 12), ([10, 20], 30)]
passed = 0

for prices, expected in cases:
    reply = run_candidate(snapshot, {"prices": prices})
    if not reply.completed or not valid_total(reply.output):
        continue
    passed += int(reply.output["total"] == expected)

reward = passed / len(cases)`}
      </CodePanel>
      <P>
        Here <code>valid_total</code> checks a bounded JSON response with an integer{" "}
        <code>total</code>, and <code>completed</code> means that response arrived before the
        deadline under the expected request protocol. Both are evaluated outside the candidate.
        <code>run_candidate</code> stands for an OS-isolated execution service, not a magic Python
        helper. A plain subprocess running as the same user can share filesystem access and other
        privileges with its parent. Moving code into another PID is not the security argument.
      </P>
      <P>
        The worker needs an enforced boundary: no host workspace mounts, no evaluator credentials,
        no access to the evaluator&apos;s processes, restricted network access, and CPU, memory,
        output, and time budgets. Containers, stronger application sandboxes, or microVMs offer
        different costs and guarantees. The design needs to state which guarantees it actually
        relies on. Giving the worker access to the host&apos;s Docker daemon would hand back control
        of the execution infrastructure.{" "}
        <a href="https://docs.docker.com/engine/security/" className="underline underline-offset-4">Docker documents that daemon boundary.</a>
      </P>
      <Note label="the important limit" tone="chart-3">
        This black-box split fits a function with a simple input/output contract. Testing a web
        server, an entire codebase, or a compiler can require richer interactions and fixtures.
        Running the whole pytest suite in another container contains execution; it does not
        automatically prevent candidate code inside that container from misleading its runner.
        Define the observable behavior the outside evaluator can check, and state what remains trusted.
      </Note>

      <H2>Freeze the submission you are about to grade</H2>
      <P>
        There is a separate race even with a well-isolated evaluator. The agent finishes a patch,
        the controller starts grading, and a background process keeps changing the working tree.
        If the controller hashes the directory now and reads its files later, the hash and execution
        may describe different submissions. This is a time-of-check/time-of-use problem: the thing
        you checked changed before you used it.
      </P>
      <P>
        Stop writes or take an atomic snapshot first. Materialize the permitted submission files
        into immutable storage, compute their digest there, and make the evaluator execute that
        exact stored snapshot. A digest is a fingerprint of bytes; hashing a live mutable directory
        is not a snapshot. When extracting an archive, reject escaping paths and disallowed symlinks
        before it reaches the execution worker.
      </P>
      <P>
        The result should carry the episode and attempt identifiers, submission digest, grading
        image digest, test-suite digest, and case counts. The controller checks these against the
        grading job it created. It accepts the result through a channel only the evaluator can
        write to, and accepts a given attempt at most once. An authenticated channel or a signature
        whose key lives outside the worker can establish the sender. A hash alone cannot.
      </P>
      <CodePanel title="an illustrative evaluation receipt · shortened digests">
{`{
  "episode_id": "ep-104",
  "attempt_id": "attempt-2",
  "submission_sha256": "a71f…",
  "grader_image_digest": "sha256:8c20…",
  "suite_digest": "b402…",
  "expected_cases": 2,
  "completed_cases": 2,
  "passed_cases": 0,
  "status": "complete"
}`}
      </CodePanel>
      <P>
        Suppose <code>ep-104 / attempt-2</code> is supposed to grade submission <code>a71f…</code>
        with suite <code>b402…</code>. A passing result for the older submission <code>92bd…</code>
        is irrelevant, even if it genuinely came from the evaluator. Matching these identifiers
        ties the result to the work requested; it does not establish that the suite covers every
        behavior we care about.
      </P>
      <ReceiptDiagram />

      <H2>Three failures, three different defenses</H2>
      <P>
        The phrase &ldquo;reward hacking&rdquo; can hide distinctions that matter when choosing
        a defense. A narrow test suite, a writable runner hook, and a forged result are different
        failures. Fixing one does not imply the other two have been fixed.
      </P>
      <Table head={["Failure", "What changed", "What addresses it"]} rows={[
        ["Weak specification", "A hardcoded answer satisfies the few cases, but not the actual task.", "Broader and held-out cases, property checks, and a better task definition."],
        ["Evaluator tampering", "A hook or imported candidate code changes what the runner executes.", "Controlled runner inputs and comparison outside the candidate runtime where the task permits it."],
        ["Result substitution", "A result from another submission or attempt is accepted as this run.", "Immutable snapshot identity, an evaluator-only result channel, and accept-once checks."],
      ]} />
      <P>
        Hidden cases can reduce hardcoding, but hiding a test file on disk does not hide its contents
        from arbitrary code executing in the same process as the test. Strong isolation protects
        the grader&apos;s authority; strong task coverage protects the meaning of the grade. We
        need both.
      </P>

      <H2>Invalid evaluations are not solved tasks</H2>
      <P>
        The scoring protocol also needs explicit failure states. A wrong answer is a valid
        evaluation with no credit. A timeout, missing response, crashed evaluator, or mismatched
        submission is not a passing task. Record these separately instead of turning an absent
        result into success or blindly retrying until one attempt happens to pass.
      </P>
      <P>
        Resource limits and retry rules belong in that contract. You might count a candidate
        timeout as a failure under a fixed budget, while retrying a verified infrastructure fault
        under the same submission and a new attempt ID. Whichever policy you choose, use bounded
        retries and keep the outcomes visible. Quietly excluding slow or invalid runs can change
        which trajectories the training algorithm sees.
      </P>
      <P>
        There are costs here: snapshot storage, extra execution services, slower startup, stricter
        dependency control, and less freedom to reuse a repository&apos;s normal test setup.
        Those costs buy a more precise answer to a question the training loop already depends on:
        what exactly happened, to which submission, under whose authority?
      </P>
      <Closing>
        Protect the test files, but keep going. Control what the runner loads, isolate candidate
        execution from the scoring authority, evaluate an immutable submission, and accept only
        the evaluator&apos;s result for that exact attempt. Then separately ask whether passing
        those checks actually means the task was solved. Read-only tests handle one of these
        requirements. They cannot stand in for the rest.
      </Closing>
      <Sources heading="Sources and implementation details" items={[
        { label: "Anthropic: Sycophancy to subterfuge, a controlled study of reward tampering", href: "https://www.anthropic.com/research/reward-tampering" },
        { label: "pytest: plugin and conftest discovery", href: "https://docs.pytest.org/en/stable/how-to/writing_plugins.html" },
        { label: "pytest: collection hooks", href: "https://docs.pytest.org/en/stable/how-to/writing_hook_functions.html" },
        { label: "pytest: skipping and expected failures", href: "https://docs.pytest.org/en/stable/how-to/skipping.html" },
        { label: "pytest: exit codes", href: "https://docs.pytest.org/en/stable/reference/exit-codes.html" },
        { label: "pytest: controlling plugin loading", href: "https://docs.pytest.org/en/stable/how-to/plugins.html" },
        { label: "Python: os._exit", href: "https://docs.python.org/3/library/os.html#os._exit" },
        { label: "Docker: daemon access and the host security boundary", href: "https://docs.docker.com/engine/security/" },
        { label: "gVisor: what an application sandbox isolates, and what it does not", href: "https://gvisor.dev/docs/architecture_guide/intro/" },
      ]} />
    </>
  )
}
