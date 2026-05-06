export const authSection = {
  id: "backend-auth",
  parentId: "backend",
  title: "Auth (sessions, JWT, OAuth)",
  icon: "⚷",
  summary: "Login flows, password hashing, sessions vs tokens, and third-party sign-in.",
  blocks: [
    {
      type: "text",
      content:
        "Authentication answers \"who are you?\"; authorization answers \"what may you do?\". Most security bugs live in the seams between these two — be explicit about both and rely on battle-tested libraries instead of rolling crypto.",
    },
    {
      type: "list",
      title: "Passwords — only one algorithm",
      items: [
        "Hash with `argon2id` (preferred) or `bcrypt` — never raw SHA/MD5.",
        "Store the hash; never the password. Throw it away after hashing.",
        "Use a library that handles salt, work factor, and timing-safe comparison.",
        "Length over complexity: a 16+ char passphrase beats `P@ssw0rd!`.",
        "Compare with `crypto.timingSafeEqual` to avoid timing leaks.",
      ],
    },
    {
      type: "code",
      lang: "ts",
      code: `import argon2 from "argon2";

export async function hashPassword(plain: string) {
  return argon2.hash(plain, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, plain: string) {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false; // malformed hash etc.
  }
}`,
    },
    {
      type: "list",
      title: "Sessions vs tokens",
      items: [
        "Server sessions — opaque ID in a cookie; revoke server-side anytime; great default.",
        "JWT — self-contained token; verify with a signing key; cannot revoke until expiry.",
        "Cookies: set `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict` for same-site only).",
        "Refresh tokens go in a separate, longer-lived cookie or storage.",
        "Never put tokens in `localStorage` if the app has XSS surface (it does).",
      ],
    },
    {
      type: "code",
      lang: "ts",
      code: `// Express example: set a session cookie
import session from "express-session";

app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET!,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
  resave: false,
  saveUninitialized: false,
}));`,
    },
    {
      type: "list",
      title: "OAuth 2.0 / OpenID Connect (third-party sign-in)",
      items: [
        "Use Authorization Code flow with PKCE for SPAs and mobile.",
        "Never implement the flow by hand for an app — use Auth0, Clerk, NextAuth, Keycloak.",
        "Verify the `id_token` signature and `aud`/`iss` claims, always.",
        "Map third-party identity to your own user record; don't trust upstream emails blindly.",
      ],
    },
    {
      type: "list",
      title: "Authorization model",
      items: [
        "RBAC — roles map to permissions; simple, fine for most apps.",
        "ABAC — rules over attributes; flexible, harder to audit.",
        "Always check permissions in the backend, even if the UI hides the button.",
        "Centralize: a single `can(user, action, resource)` function used by every endpoint.",
        "Audit log sensitive actions: who did what, when, from where.",
      ],
    },
    {
      type: "text",
      content:
        "Multi-factor auth (TOTP, WebAuthn) is no longer optional for accounts with real value. Lock accounts after repeated failures with exponential backoff. Notify users on new-device logins. The best auth code is the code you didn't write — use a provider when you can.",
    },
  ],
};
