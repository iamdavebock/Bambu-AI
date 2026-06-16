# Review

Delegate to the Reviewer agent for code review and QA.

Invoke the Reviewer with:
- What was changed (files, purpose)
- The diff or file contents
- What to focus on (correctness, security, patterns, performance)

The Reviewer checks for:
- Logic errors and edge cases
- Security vulnerabilities (injection, auth bypass, exposure)
- Adherence to project conventions
- Test coverage gaps
- Performance red flags

Report findings to the Director: issues found (critical vs minor), and whether the code is ready to merge.
