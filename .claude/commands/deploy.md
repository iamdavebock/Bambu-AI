# Deploy

Delegate to the DevOps agent for deployment.

Invoke DevOps with:
- What's being deployed (service, version, environment)
- Current deployment method (Docker, systemd, CI/CD, etc.)
- Target environment (dev, staging, production)
- Any special steps or dependencies

The DevOps agent handles:
- Build and packaging
- Service restarts and health checks
- Rollback plan if deployment fails

**Production deployments require Director confirmation before proceeding.**

Report: deployment status, service health, any errors.
