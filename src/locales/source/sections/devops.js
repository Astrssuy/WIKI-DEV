export const devopsSection = {
  id: "devops",
  title: "DevOps",
  icon: "⚙",
  summary: "CI/CD pipelines, containers, infrastructure as code, and observability.",
  blocks: [
    {
      type: "text",
      content:
        "DevOps blends software development and operations: automate the path from commit to production so releases are routine, reversible, and observable. The goal is to make doing the right thing the easiest thing.",
    },
    {
      type: "list",
      title: "Minimal useful pipeline",
      items: [
        "Lint + format check — fast, blocks ugly merges.",
        "Tests — unit + a few integration; aim for < 10 min total.",
        "Build — reproducible artifact (Docker image, tarball, native binary).",
        "Scan — vulnerable dependencies, secrets, container CVEs.",
        "Deploy — gated by environment; manual approval for prod is fine.",
      ],
    },
    {
      type: "code",
      lang: "yaml",
      code: `# .github/workflows/ci.yml — minimum viable CI
name: ci
on: { pull_request: {}, push: { branches: [main] } }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        with: { name: coverage, path: coverage/ }`,
    },
    {
      type: "list",
      title: "Containers (Docker basics)",
      items: [
        "`Dockerfile` — declarative recipe: base image, deps, code, command.",
        "Multi-stage builds — small final image; build tools stay in earlier stages.",
        "`.dockerignore` — keep `node_modules`, `.git`, build caches out of the image.",
        "Tag with both a version and `latest` (for non-prod) or commit SHA (for prod).",
        "Run as non-root user when possible (`USER node`).",
      ],
    },
    {
      type: "code",
      lang: "dockerfile",
      code: `# Multi-stage Node.js image
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]`,
    },
    {
      type: "list",
      title: "Infrastructure as Code",
      items: [
        "Terraform — providers for AWS/GCP/Azure; state stored in S3/GCS with locking.",
        "Pulumi — write infra in TypeScript/Python; same providers as Terraform.",
        "Kubernetes manifests — declarative; Helm charts and Kustomize keep them DRY.",
        "Never click in the cloud console for production — drift kills weekends.",
      ],
    },
    {
      type: "list",
      title: "Observability (the three pillars)",
      items: [
        "Logs — structured (JSON), include `trace_id` and `request_id`.",
        "Metrics — counters/gauges/histograms; Prometheus + Grafana is a solid default.",
        "Traces — OpenTelemetry spans across services; sample heavily in prod.",
        "Alerts — page on symptoms (error rate, latency p95), not causes (CPU at 80%).",
      ],
    },
    {
      type: "list",
      title: "Deploy checklist",
      items: [
        "Separate `/health` (process up?) from `/ready` (dependencies ok?).",
        "Migrations run before code; backward-compatible for one release.",
        "Feature flags for risky changes.",
        "One-command rollback (image tag swap or previous release).",
        "Postmortems blameless; fix processes, not people.",
      ],
    },
    {
      type: "text",
      content:
        "Treat your environments like cattle, not pets. If you cannot recreate prod from code in under an hour, your IaC is incomplete or your data backups need exercising.",
    },
  ],
};
