# Security Audit

Delegate to the Security agent for a security review.

Invoke Security with:
- Scope (specific files, a feature, or the full codebase)
- Context (what's new, what's changed, what's exposed)
- Environment (public-facing? handles PII? auth involved?)

The Security agent checks for:
- OWASP Top 10 vulnerabilities
- Authentication and authorisation flaws
- Credential and secret exposure
- Input validation and injection risks
- Dependency vulnerabilities

Report: findings by severity (critical / high / medium / low), recommended fixes, and overall posture.
