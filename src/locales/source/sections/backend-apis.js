export const apisSection = {
  id: "backend-apis",
  parentId: "backend",
  title: "APIs (REST & GraphQL)",
  icon: "⇄",
  summary: "Designing endpoints, picking REST vs GraphQL, and not breaking clients.",
  blocks: [
    {
      type: "text",
      content:
        "An API is a contract between systems. The hardest part is not implementing it; it is keeping it stable while the underlying code evolves. Pick a style that fits the client needs and document it where humans actually read.",
    },
    {
      type: "list",
      title: "REST in practice",
      items: [
        "Resources as nouns: `/posts/123`, not `/getPost?id=123`.",
        "HTTP verbs carry intent: GET (read), POST (create), PUT/PATCH (update), DELETE.",
        "Status codes do half the documentation; use them honestly.",
        "Cursor pagination scales better than `?page=N` for large lists.",
        "Version in the path (`/v1/...`) or via a header — pick one and stick to it.",
      ],
    },
    {
      type: "code",
      lang: "http",
      code: `GET /v1/posts?limit=20&cursor=eyJpZCI6MTIzfQ HTTP/1.1
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json
Link: </v1/posts?limit=20&cursor=eyJpZCI6MTQzfQ>; rel="next"

{ "data": [ /* posts */ ], "nextCursor": "eyJpZCI6MTQzfQ" }`,
    },
    {
      type: "list",
      title: "GraphQL — when it shines",
      items: [
        "Clients pick exactly the fields they need; great for mobile and aggregation.",
        "One endpoint (`/graphql`); the schema is the contract.",
        "Avoid the N+1 trap with DataLoader (batching + per-request cache).",
        "Persisted queries protect production; banned arbitrary queries.",
        "Don't expose your DB as a schema — design intentional types.",
      ],
    },
    {
      type: "code",
      lang: "graphql",
      code: `# Schema-first
type Post {
  id: ID!
  title: String!
  author: User!
  createdAt: DateTime!
}

type Query {
  post(id: ID!): Post
  posts(limit: Int = 20, cursor: String): PostConnection!
}`,
    },
    {
      type: "list",
      title: "Idempotency & retries",
      items: [
        "GET, PUT, DELETE are idempotent by spec; POST usually is not.",
        "For POSTs that matter (payments, orders): require an `Idempotency-Key` header.",
        "On the server, store the result of the first response keyed by that header.",
        "Clients should retry on `5xx` and `429` with exponential backoff + jitter.",
      ],
    },
    {
      type: "list",
      title: "Versioning without tears",
      items: [
        "Add, don't change: new optional fields are safe; removing is breaking.",
        "Deprecate first (`Deprecation` header / GraphQL `@deprecated`), remove later.",
        "Document migration paths; give clients at least one release to adapt.",
        "Spec-first: OpenAPI/GraphQL SDL drives codegen for clients and tests.",
      ],
    },
    {
      type: "text",
      content:
        "Authentication usually goes in `Authorization: Bearer <token>`. CORS only matters for browsers — server-to-server traffic ignores it. Rate limits live at the gateway; document them so clients can build sane retry logic.",
    },
  ],
};
