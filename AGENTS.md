# Agent guide

## Read first

1. `CLAUDE.md`
2. `rules/best-practices.md`
3. `specs/00-roadmap.md`
4. Relevant files under `agents/` and `docs/decisions/`

## Scope

- Keep changes inside this repository.
- Treat `workflows/zeuz-pipeline.js` as host-executed source, not a standalone Node program.
- Preserve the six checked-in specialist roles unless a task explicitly changes the factory design.
- Keep runtime output under `runs/`; never track it.
- Do not add secrets, credentials, machine-specific absolute paths, sessions, caches, or private runtime state.

## Change rules

- When pipeline phases or required outputs change, update `specs/00-roadmap.md` and `rules/best-practices.md` in the same patch.
- Keep `CLAUDE.md` as a short router. Put detail in `rules/`, `specs/`, or `docs/`.
- Describe host requirements and limitations directly. Do not claim a full end-to-end run from the static smoke test.
- Put irreversible file, archive, publish, move, and deployment actions behind explicit host approval.
- Preserve English `README.md`, Russian `README.ru.md`, attribution, and MIT licensing.

## Checks

```bash
bash smoke/smoke.sh
git diff --check
```

The smoke test must end with `ГЕЙТ ПРОЙДЕН ✓`. Review the diff before handoff.

## Public packaging

- `README.md` and `README.ru.md` follow the shared family anatomy: promise, badges, wide hero, table of
  contents, and the ten beginner headings with the ASCII workflow diagram inside `How It Works`.
- Workflow stages live in `.github/pantheon.json`. Change the stages there first, then the two READMEs.
- `AGENTS.md` holds the rules; `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, and
  `.cursor/rules/*.mdc` only point here.
- Run `public-repo-gate check --repo . --release-intent public` before any push, and fix every blocker.
- Agent work here is tracked by Entire, and its checkpoints go to the separate private repository
  `zarubinvibe/zeuz-checkpoints`. Session capture stays on: a public repository never stores its own
  checkpoints, and the release gate blocks a push when tracking is disabled or the checkpoint repository is public.
