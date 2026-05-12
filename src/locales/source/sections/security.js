export const securitySection = {
  id: "security",
  title: "Security",
  icon: "⛨",
  summary: "OWASP top 10 distilled, CORS/CSP, secret hygiene, and the principle of least surprise.",
  blocks: [
    {
      type: "text",
      content:
        "Security is not a feature; it is a property of every feature. Assume your code will leak, your dependencies will be compromised, and your users will pick \"123456\" as their password. Defense in depth means doing the boring things consistently.",
    },
    {
      type: "list",
      title: "OWASP Top 10 — the short version",
      items: [
        "Broken access control — check permissions on every endpoint, server-side.",
        "Cryptographic failures — never roll your own; use TLS everywhere, hash with argon2/bcrypt.",
        "Injection — parameterized queries; never `\"SELECT ... \" + userInput`.",
        "Insecure design — threat-model new features before coding.",
        "Security misconfiguration — disable debug routes in prod; restrict CORS.",
        "Vulnerable components — `npm audit`, Dependabot/Snyk, update regularly.",
        "Auth failures — see the Auth section; rate limit logins; lock after N attempts.",
        "Data integrity failures — verify uploads, signed cookies, package signatures.",
        "Logging failures — log auth events; never log secrets, tokens or full PII.",
        "Server-side request forgery (SSRF) — never let users tell the server what URL to fetch without an allow-list.",
      ],
    },
    {
      type: "code",
      lang: "ts",
      code: `// Parameterized query — safe
const user = await db.query(
  "SELECT id, email FROM users WHERE email = $1",
  [email],
);

// NEVER do this (string interpolation = SQL injection):
// db.query("SELECT * FROM users WHERE email = '" + email + "'");`,
    },
    {
      type: "list",
      title: "Browser headers that pay rent",
      items: [
        "`Content-Security-Policy` — whitelist scripts/styles; blocks most XSS.",
        "`Strict-Transport-Security` — force HTTPS on the domain for months.",
        "`X-Content-Type-Options: nosniff` — stop MIME sniffing tricks.",
        "`Referrer-Policy: strict-origin-when-cross-origin` — leak less in `Referer`.",
        "`Permissions-Policy` — disable camera/mic/etc. when unused.",
      ],
    },
    {
      type: "list",
      title: "CORS — what it really means",
      items: [
        "CORS protects the *browser*, not your server.",
        "Server-to-server calls ignore CORS entirely.",
        "Reflecting `Origin` blindly defeats the point; allow-list explicit origins.",
        "Preflight (`OPTIONS`) is the browser asking permission before non-simple requests.",
        "Credentials (`cookies`) require `Access-Control-Allow-Credentials: true` AND a specific origin (not `*`).",
      ],
    },
    {
      type: "list",
      title: "Secrets management",
      items: [
        "Never commit secrets — `.env` in `.gitignore`, use a vault in prod.",
        "Rotate keys quarterly; rotate immediately after employee departures.",
        "Scope keys: a key that reads cannot write; a key for service A cannot reach B.",
        "Use `git-secrets` or `gitleaks` to scan before pushing.",
        "If a secret leaks, assume it is compromised and rotate — `git rm` is not enough.",
      ],
    },
    {
      type: "text",
      content:
        "Threat model with three questions: what are we protecting, from whom, and how would they get it? Write it down. Update it when the architecture changes. Half the security bugs in the wild died in someone's threat model years before they shipped.",
    },
  ],
};
