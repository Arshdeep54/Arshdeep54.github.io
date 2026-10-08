"""Reproduce a vulnerable grading rule. Requires Python 3.12 and pytest 8.4.2.

This local demonstration is not an isolation service for untrusted code.
"""

import hashlib
import os
from pathlib import Path
import subprocess
import sys
import tempfile


def main():
    import pytest

    print(f"Python {sys.version.split()[0]} · pytest {pytest.__version__}")
    env = os.environ.copy()
    for name in ("PYTEST_ADDOPTS", "PYTEST_PLUGINS", "PYTHONPATH"):
        env.pop(name, None)
    env["PYTEST_DISABLE_PLUGIN_AUTOLOAD"] = "1"

    with tempfile.TemporaryDirectory(prefix="read-only-tests-") as directory:
        workspace = Path(directory)
        tests = workspace / "tests"
        tests.mkdir()
        test_file = tests / "test_checkout.py"
        test_file.write_text(
            "from checkout import total\n\n"
            "def test_small_order():\n"
            "    assert total([5, 7]) == 12\n\n"
            "def test_large_order():\n"
            "    assert total([10, 20]) == 30\n",
            encoding="utf-8",
        )
        test_file.chmod(0o444)
        original_digest = hashlib.sha256(test_file.read_bytes()).hexdigest()
        candidate = workspace / "checkout.py"
        candidate.write_text("def total(prices):\n    return 0\n", encoding="utf-8")

        def check(label, options, expected_exit, expected_summary):
            result = subprocess.run(
                [sys.executable, "-m", "pytest", "-q", "tests/test_checkout.py", *options],
                cwd=workspace, env=env, capture_output=True, text=True, timeout=10,
            )
            assert result.returncode == expected_exit, (label, result.stdout, result.stderr)
            if expected_summary:
                assert expected_summary in result.stdout, (label, result.stdout, result.stderr)
            else:
                assert not result.stdout and not result.stderr, (label, result.stdout, result.stderr)
            assert hashlib.sha256(test_file.read_bytes()).hexdigest() == original_digest
            print(f"{label}: {expected_summary or 'no output'} · exit {result.returncode} · reward {int(result.returncode == 0)}")

        check("broken function", [], 1, "2 failed")
        (workspace / "conftest.py").write_text(
            'import pytest\n\ndef pytest_collection_modifyitems(items):\n'
            '    for item in items:\n'
            '        item.add_marker(pytest.mark.skip(reason="not this run"))\n',
            encoding="utf-8",
        )
        check("broken function + skip hook", [], 0, "2 skipped")
        check("skip hook disabled", ["--noconftest"], 1, "2 failed")
        candidate.write_text("import os\nos._exit(0)\n", encoding="utf-8")
        check("early exit + hook disabled", ["--noconftest"], 0, "")
        print("All four outcomes matched; the protected test bytes stayed unchanged.")


if __name__ == "__main__":
    main()
