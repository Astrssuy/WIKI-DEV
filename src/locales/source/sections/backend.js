export const backendSection = {
  id: "backend",
  title: "Backend",
  icon: "⌘",
  summary: "APIs, data, contracts, and reliability of server-side systems.",
  blocks: [
    {
      type: "text",
      content:
        "A backend exposes operations as HTTP endpoints (or RPC, queues, etc.) and protects state behind well-defined contracts. Good backends are predictable: versioned, idempotent for critical calls, observable in production, and recoverable when things break.",
    },
    {
      type: "list",
      title: "Pillars to keep in mind",
      items: [
        "Contract first — describe inputs, outputs, error shapes; ideally with OpenAPI/GraphQL schema.",
        "Stateless processes — keep request handling free of in-memory state; persist what matters.",
        "Idempotency — POST may retry; design with idempotency keys for payments and similar.",
        "Backpressure — protect downstream systems with timeouts, circuit breakers, and rate limits.",
        "Observability — logs (structured), metrics (counters/gauges/histograms), traces (OpenTelemetry).",
      ],
    },
    {
      type: "code",
      lang: "http",
      code: `HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{
  "type": "https://errors.example.com/slug-taken",
  "title": "Slug already taken",
  "status": 409,
  "detail": "Try another slug or rename the existing resource.",
  "instance": "/v1/posts/2026-05-19/intro"
}`,
    },
    {
      type: "list",
      title: "Common runtimes & frameworks",
      items: [
        "Node.js — Express/Fastify/NestJS. Non-blocking I/O; great for IO-heavy services.",
        "Python — FastAPI (async, types) or Django (batteries included).",
        "Go — net/http + chi/gin; fast cold starts, tiny binaries, easy concurrency.",
        "Java/Kotlin — Spring Boot; mature ecosystem for enterprise workloads.",
        "Rust — Axum/Actix when latency and memory matter.",
      ],
    },
    {
      type: "text",
      content:
        "Pick the runtime your team can operate, not the trendiest one. A boring stack with good monitoring beats a clever stack nobody can debug at 3 AM.",
    },
    {
      type: "list",
      title: "Error model — speak HTTP",
      items: [
        "`200/201` — success (use 201 for resource creation).",
        "`204` — success with no body (DELETE, idempotent updates).",
        "`400` — the client sent invalid data.",
        "`401` / `403` — not authenticated / not allowed.",
        "`404` — the resource does not exist.",
        "`409` — conflict (duplicate, version mismatch).",
        "`422` — semantic validation failed.",
        "`429` — rate limited; return `Retry-After`.",
        "`5xx` — your fault: 500 generic, 502 upstream broken, 503 maintenance/overload.",
      ],
    },
    {
      type: "code",
      lang: "ts",
      code: `// Validate at the edge (Zod) and return a stable error shape
import { z } from "zod";
const Create = z.object({
  email: z.string().email(),
  password: z.string().min(12),
});

export async function createUser(req, res) {
  const parsed = Create.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      type: "/errors/validation",
      title: "Invalid payload",
      issues: parsed.error.issues,
    });
  }
  // ... insert into DB, handle conflicts ...
}`,
    },
    {
      type: "text",
      content:
        "When integrating with third parties, treat their failures as expected: retries with exponential backoff and jitter, dead-letter queues for poison messages, and feature flags so you can disable a flaky integration without redeploying.",
    },
  ],
};
