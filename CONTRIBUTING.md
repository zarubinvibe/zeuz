# Contributing to Zeuz

Zeuz is a small, host-dependent reference implementation. Keep pull requests focused and make the host contract explicit when behavior changes.

## Setup

You need Git, Bash, and Node.js.

```bash
git clone https://github.com/zarubinvibe/zeuz.git
cd zeuz
bash smoke/smoke.sh
```

No dependency installation is required for the checked-in smoke test.

## Before a pull request

- Read `CLAUDE.md`, `rules/best-practices.md`, and `specs/00-roadmap.md`.
- Keep runtime files, credentials, local paths, and generated project output out of Git.
- Update both READMEs when a user-facing command, prerequisite, output path, or limitation changes.
- Update the roadmap and construction policy together when the workflow changes.
- Add the smallest deterministic check that catches new behavior.

Run:

```bash
bash smoke/smoke.sh
git diff --check
```

In the pull request, state what changed, which host assumptions changed, and what the smoke test does and does not cover.

Security reports do not belong in public issues. Follow [SECURITY.md](SECURITY.md).
