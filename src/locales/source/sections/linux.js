export const linuxSection = {
  id: "linux",
  title: "Linux & CLI",
  icon: "▤",
  summary: "Shell commands, permissions, processes, and the pipes that connect them.",
  blocks: [
    {
      type: "text",
      content:
        "Most servers and CI runners are Linux. Even on macOS or WSL, the same commands work. The shell is a programming language with files and processes as primitives; you don't need to memorize everything — just learn how to compose small tools.",
    },
    {
      type: "list",
      title: "Filesystem essentials",
      items: [
        "`pwd` — print working directory; `cd path` — change; `cd -` — previous.",
        "`ls -lah` — long, all (hidden), human-readable sizes.",
        "`cp src dst` / `mv src dst` / `rm path` (use `-i` interactive for safety).",
        "`mkdir -p a/b/c` — create nested; `rmdir` for empty dirs only.",
        "`find . -name '*.log' -mtime +7 -delete` — files older than 7 days.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      code: `# View, search, transform text
cat file.txt                    # print whole file
less file.txt                   # paged view, press q to quit
head -n 20 file.txt             # first 20 lines
tail -f /var/log/app.log        # follow new lines as they arrive
grep -RIn "TODO" src/           # search recursively, with line numbers
sed -i 's/foo/bar/g' file.txt   # in-place replace
awk -F, '{ print $1, $3 }' data.csv`,
    },
    {
      type: "list",
      title: "Permissions",
      items: [
        "`ls -l` shows mode: `-rwxr-xr--` = owner / group / others.",
        "`chmod +x script.sh` — make executable; `chmod 644 file` — rw-r--r--.",
        "`chown user:group path` — change ownership (often `sudo`).",
        "`umask 022` — default mask for new files.",
        "Run as your user when possible; reach for `sudo` only when needed.",
      ],
    },
    {
      type: "list",
      title: "Processes & jobs",
      items: [
        "`ps aux | grep node` — list processes matching node.",
        "`top` / `htop` — interactive process viewer.",
        "`kill -9 PID` — force-stop a stuck process (last resort).",
        "`Ctrl+Z` suspends a foreground job; `bg` / `fg` to resume.",
        "`nohup cmd &` — keep running after logout; redirect stdout/stderr.",
      ],
    },
    {
      type: "list",
      title: "Pipes, redirection, exit codes",
      items: [
        "`cmd > file` — write stdout to file (overwrite); `>>` appends.",
        "`cmd 2> err.log` — stderr; `cmd > all.log 2>&1` — both into one.",
        "`a | b` — pipe stdout of `a` into stdin of `b`.",
        "`$?` — last command's exit code (0 = ok, non-zero = error).",
        "`&&` runs next on success; `||` runs next on failure.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      code: `# A real-ish one-liner
curl -fsSL https://api.example.com/users \\
  | jq -r '.data[] | select(.active) | .email' \\
  | sort -u \\
  | tee active-emails.txt \\
  | wc -l`,
    },
    {
      type: "list",
      title: "Networking quick reference",
      items: [
        "`ping host` — ICMP reachability (some hosts block it).",
        "`curl -i URL` — show response headers; `-X POST -d 'body'` for POST.",
        "`ss -tlnp` — listening TCP sockets and PIDs (modern `netstat`).",
        "`dig +short example.com` — DNS lookup.",
        "`traceroute host` (or `mtr host`) — path and per-hop latency.",
      ],
    },
    {
      type: "text",
      content:
        "Write small shell scripts with `set -euo pipefail` at the top to catch errors. For anything beyond ~50 lines, switch to Python or Node — bash quoting will eventually betray you.",
    },
  ],
};
