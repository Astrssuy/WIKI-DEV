export const gitSection = {
  id: "git",
  title: "Git",
  icon: "⎇",
  summary: "Commands, day-to-day flows, remotes, and undoing changes safely.",
  blocks: [
    {
      type: "text",
      content:
        "Git stores snapshots (commits) and lets you branch, collaborate over remotes, and move through history. Three areas: working tree (files), staging (index), and commits (local repo).",
    },
    {
      type: "list",
      title: "Typical setup (once per machine)",
      items: [
        "`git config --global user.name \"Your Name\"`",
        "`git config --global user.email \"you@email\"`",
        "`git config --global init.defaultBranch main` — default branch for new repos",
        "`git config --global core.editor \"code --wait\"` — VS Code for commit messages",
        "`git config --global alias.st status -sb` — shortcut for `git st`",
      ],
    },
    {
      type: "code",
      lang: "bash",
      code: `# New repo or clone
git init
git clone https://github.com/user/project.git
cd project`,
    },
    {
      type: "list",
      title: "Daily workflow",
      items: [
        "`git status` (`-sb` short) — what changed",
        "`git diff` — unstaged changes; `git diff --staged` — staged changes",
        "`git add file` or `git add -p` — stage interactively (review hunks)",
        "`git commit -m \"message\"` — commit staged changes",
        "`git log --oneline --graph --decorate -20` — compact graph",
      ],
    },
    {
      type: "code",
      lang: "bash",
      code: `# Move/rename and delete (tracked)
git mv old/path.md new/path.md
git rm obsolete-file.txt`,
    },
    {
      type: "list",
      title: "Branches",
      items: [
        "`git branch` — local list; `git branch -a` includes remotes",
        "`git switch branch-name` — switch (modern); older: `git checkout branch-name`",
        "`git switch -c feature/login` — create and enter branch",
        "`git merge other-branch` — integrate (may require conflict resolution)",
        "`git branch -d feature/login` — delete merged local branch",
      ],
    },
    {
      type: "code",
      lang: "bash",
      code: `# Typical feature flow from main
git switch main
git pull origin main
git switch -c feat/my-change
# ... edit, commit ...
git push -u origin feat/my-change`,
    },
    {
      type: "list",
      title: "Remote (origin, push, pull)",
      items: [
        "`git remote -v` — fetch/push URLs",
        "`git fetch origin` — download commits without merging your branch",
        "`git pull` — `fetch` + merge/rebase per config",
        "`git push origin my-branch` — first time: `git push -u origin my-branch`",
        "`git push --delete origin old-branch` — delete remote branch",
      ],
    },
    {
      type: "text",
      content:
        "If `git pull` creates noisy merge commits, teams often prefer `git pull --rebase` to replay your work on top of the remote (linear history). Only if you understand rebase and team rules allow it.",
    },
    {
      type: "list",
      title: "Undo & clean up (stay in control)",
      items: [
        "`git restore file` — discard unstaged local changes to that file",
        "`git restore --staged file` — unstage, keep changes on disk",
        "`git checkout -- file` — legacy restore of working tree (overwrites)",
        "`git reset --soft HEAD~1` — drop last keeping changes staged",
        "`git reset --mixed HEAD~1` (default) — undo commit; changes unstaged",
        "`git reset --hard HEAD~1` — danger: drops commit and working tree changes",
      ],
    },
    {
      type: "text",
      content:
        "`git revert <commit>` adds a new commit that undoes another: safe for published history. `git reset --hard` rewrites local history—avoid on shared branches without agreement.",
    },
    {
      type: "code",
      lang: "bash",
      code: `# Shelve WIP without committing
git stash push -m "wip: login form"
git stash list
git stash pop        # apply and drop latest
git stash apply stash@{0}  # apply without dropping`,
    },
    {
      type: "list",
      title: "History inspection",
      items: [
        "`git show <commit>` — patch and metadata",
        "`git blame file` — who changed each line",
        "`git log -S\"text\"` — commits that added/removed a string",
        "`git bisect start` — binary search for the breaking commit",
      ],
    },
    {
      type: "code",
      lang: "bash",
      code: `# Tags (releases)
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin v1.2.0
git push origin --tags`,
    },
    {
      type: "list",
      title: "Tags, .gitignore, cleanup",
      items: [
        "`.gitignore` — ignore `node_modules/`, `.env`, builds, etc.",
        "`git clean -fd` — delete untracked files (destructive; dry-run with `git clean -nd`)",
        "`git rm -r --cached folder` — stop tracking but keep files on disk",
      ],
    },
    {
      type: "list",
      title: "Merge / rebase conflicts",
      items: [
        "Git inserts `<<<<<<<`, `=======`, `>>>>>>>` — edit manually, remove markers",
        "`git status` lists conflicted paths",
        "After fix: `git add file` then `git merge --continue` or `git rebase --continue`",
        "Abort merge: `git merge --abort`; abort rebase: `git rebase --abort`",
      ],
    },
    {
      type: "code",
      lang: "bash",
      code: `# Bring one commit from another branch
git cherry-pick abc1234

# Rewrite local history (NOT on shared branches without agreement)
git rebase -i HEAD~4`,
    },
    {
      type: "list",
      title: "Commit hygiene",
      items: [
        "Small atomic commits: one logical change each",
        "Imperative messages: `Add login`, `Fix null pointer`",
        "Conventional Commits (`feat:`, `fix:`, `docs:`…) help changelogs",
        "Before push: `git pull --rebase origin main` (or merge) with team changes",
      ],
    },
    {
      type: "text",
      content:
        "Hooks (`.git/hooks` or Husky) run lint/tests before commit/push. Submodules (`git submodule`) and worktrees (`git worktree add`) help with monorepos or parallel branches—reach for them when basics are not enough.",
    },
  ],
};
