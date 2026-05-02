export const databasesSection = {
  id: "backend-databases",
  parentId: "backend",
  title: "Databases",
  icon: "▦",
  summary: "Relational vs document stores, indexes, transactions, and the N+1 trap.",
  blocks: [
    {
      type: "text",
      content:
        "Most apps survive on a single relational database (PostgreSQL, MySQL, SQLite). Reach for document stores or key-value when the data shape genuinely demands it, not because it sounds modern. The boring choice scales further than people expect.",
    },
    {
      type: "list",
      title: "Relational basics",
      items: [
        "Tables, rows, columns; primary keys identify rows uniquely.",
        "Foreign keys keep references valid; cascade deletes carefully.",
        "Joins combine tables; the planner picks the algorithm (nested loop, hash, merge).",
        "Transactions group writes; ACID = Atomic, Consistent, Isolated, Durable.",
        "Migrations evolve schema in version control (Flyway, Prisma, Alembic, Knex).",
      ],
    },
    {
      type: "code",
      lang: "sql",
      code: `-- Order matters: filter early, then sort/limit
SELECT u.id, u.email, COUNT(p.id) AS posts
FROM users u
LEFT JOIN posts p ON p.author_id = u.id
WHERE u.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id
ORDER BY posts DESC
LIMIT 20;`,
    },
    {
      type: "list",
      title: "Indexes — the make-or-break detail",
      items: [
        "B-tree (default) — equality and range queries on a column.",
        "Composite indexes — left-to-right column order matters for matching.",
        "Partial indexes — `WHERE deleted_at IS NULL` keeps the index small.",
        "Each index speeds reads but slows writes; measure before adding.",
        "Use `EXPLAIN ANALYZE` to confirm the planner uses your index.",
      ],
    },
    {
      type: "text",
      content:
        "The N+1 problem: one query to load a list, then one per item to load related data. Fix with joins, `IN (...)` batching, or your ORM's `select_related` / `with` / `include` helpers. Watch query counts in dev with a logger.",
    },
    {
      type: "list",
      title: "Document & key-value stores",
      items: [
        "MongoDB — flexible JSON-ish documents; indexes work similarly to SQL.",
        "Redis — in-memory; perfect for caches, rate limits, queues, leaderboards.",
        "DynamoDB / Cosmos DB — managed key-value; design access patterns first.",
        "Schemaless ≠ no schema; you still have one, it just lives in the app code.",
      ],
    },
    {
      type: "list",
      title: "Hygiene & survival",
      items: [
        "Backups + restore drills (a backup you never restored is a hope, not a backup).",
        "Connection pools — finite resource; size carefully under load.",
        "Avoid SELECT *; ship only the columns you actually use.",
        "Never store passwords in plain text; never expose internal IDs as URLs blindly.",
      ],
    },
  ],
};
