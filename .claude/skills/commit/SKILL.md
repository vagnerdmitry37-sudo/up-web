---
name: commit
description: Commit (and push, when asked) changes in this Next.js app. Checks lint and build, and commits only if everything passes; otherwise stops and reports a checklist table. Pushes to origin only when the user explicitly says "push". Use whenever the user asks to commit or to commit and push, in any wording ("commit", "commit the changes", "commit and push", "push it"), instead of running git commit directly.
---

Run every command from the repo root (the folder that holds `package.json`). Run every step in order. Never skip a check and never use `--no-verify`. Push only when the user's request explicitly says to push (e.g. "commit and push"); otherwise never push.

## 1. Inspect the changes

- Run `git status --short` and `git diff HEAD --stat`. If nothing changed, say so and stop.
- **Scope:** if some files are already staged, commit only those. Otherwise commit all changes.
- **Never stage** `node_modules/`, `.next/`, `out/`, `coverage/`, `.env*`, `*.tsbuildinfo` or other local files. If one shows up, leave it out and mention it in the report.
- If `node_modules` is missing, run `npm ci` first.

## 2. Verify

Run every check, even if an earlier one fails, so the report is complete. This step changes no files.

| #   | Check                                    | Command         |
| --- | ---------------------------------------- | --------------- |
| 1   | Lint (ESLint with `eslint-config-next`)  | `npm run lint`  |
| 2   | Build (production build and TypeScript)  | `npm run build` |

Collect each error as file, line, rule/code and message, with repo-relative paths and duplicates removed.

## 3. If any check failed: stop, do not commit

Leave the working tree as it is. Reply with the report below, with `Commit | ❌ | Not created`, plus a short suggested fix for each error.

## 4. If every check passed: commit

1. Stage the in-scope files **by explicit path** (not `git add -A`). New files that belong in git include `package-lock.json`.
2. Write the message from `git diff --cached`:
   - **Subject: at most 100 characters**, imperative mood, no trailing period, prefix `web:`, e.g. `web: add product list page`.
   - Add a body only if the change needs explaining, wrapped at about 100 characters.
   - End with the attribution trailer required by the session's instructions, if any.
3. Check the subject length with `printf '%s' "<subject>" | wc -m`, and shorten it if it is over 100.
4. Commit using a heredoc, then run `git log -1 --stat` to confirm.

## 5. Push (only if the user explicitly asked to push)

Skip this step unless the request contains an explicit push instruction such as "commit and push". A plain "commit" never pushes.

1. Run `git push origin <current-branch>` (add `-u` if the branch has no upstream yet). Remote `origin` is `git@github.com:vagnerdmitry37-sudo/up-web.git`.
2. Never force-push. If the push is rejected, stop and report the error; do not pull, rebase or retry with `--force`.

## Report

**Checklist**

| Check  | Status       | Details                                      |
| ------ | ------------ | -------------------------------------------- |
| Lint   | ✅ / ❌      | N errors                                     |
| Build  | ✅ / ❌      | N errors                                     |
| Commit | ✅ / ❌      | short hash, or "Not created"                 |
| Push   | ✅ / ❌ / ⏭️ | "origin/<branch>", error, or "not requested" |

If anything failed, add an **Errors** table:

| Type  | Location           | Rule / Code       | Message                           |
| ----- | ------------------ | ----------------- | --------------------------------- |
| Lint  | `app/page.tsx:12`  | react/no-danger   | Dangerous property detected.      |
| Build | `app/layout.tsx:4` | TS2307            | Cannot find module './missing'    |

On success, reply with the Checklist, the commit subject, and any files left out with the reason.
