# Security policy

Zeuz coordinates agents that may read files, run shell commands, use the network, and write a new project. The repository supplies prompts and workflow source. The workflow host controls the actual permissions.

## Trust boundary

- `workflows/zeuz-pipeline.js` assumes the host provides `phase()`, `agent()`, `log()`, and `args`.
- Agent responses are untrusted model output, including structured responses and test verdicts.
- Build agents are instructed to write under `ZEUZ_PROJECTS`.
- Observe writes local runtime data under `ZEUZ_HOME/runs` and may execute `abtop`, shell utilities, and Python.
- Cast asks the host for web research. The repository does not grant or restrict network access.
- Zeuz does not implement a sandbox, approval UI, credential store, or automatic rollback.

Run the workflow with least-privilege file and network access. Use a dedicated output directory, review generated files, and require human approval before publishing, moving, archiving, deploying, or executing generated code.

Do not place credentials, tokens, private keys, personal data, or confidential source text in a specification. Prompts may pass the specification to several agents and generated artifacts may preserve parts of it.

## Supported versions

Security fixes target the current `main` branch. The project has no tagged stable release line.

## Reporting a vulnerability

Do not publish exploit details in a public issue. If the repository Security tab offers private vulnerability reporting, use it. Otherwise open a minimal issue asking the maintainer for a private contact channel and omit sensitive details until that channel exists.

Include the affected revision, required host capabilities, reproduction steps, impact, and any safe mitigation you tested.
