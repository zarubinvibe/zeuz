# Zeuz

Zeuz builds a multi-agent system from your specification: roles, stages, gates, and a tester who tells the truth.

[Русский](README.ru.md) · [中文](README.zh.md)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Stars](https://img.shields.io/github/stars/zarubinvibe/zeuz?style=flat&color=C9A87A)](https://github.com/zarubinvibe/zeuz/stargazers) [![Status](https://img.shields.io/badge/status-reference-brightgreen.svg)](https://github.com/zarubinvibe/zeuz) [![Olympuz](https://img.shields.io/badge/olympuz-family-B8D6EA.svg)](https://github.com/zarubinvibe/athena#olympuz-family)

<p align="center"><img src="docs/assets/pantheon/hero.png" alt="Zeus in white marble with a golden lightning bolt beside the classical column, a governed workflow graph unfolding in daylight" width="100%"></p>

<!-- owner-welcome:start -->

> Hello. Every time I needed a new system out of agents, I invented the same things again: roles, stages, gates, logging. Something was always forgotten, usually the gates.
>
> Zeuz keeps that structure so I stop rebuilding it. It is a factory, not a service: you give it a specification, it hands you a project folder and a tester's honest verdict.
>
> — Filipp Zarubin

<!-- owner-welcome:end -->

## Contents

- [What This Is](#what-this-is)
- [Why It Helps](#why-it-helps)
- [The Main Advantage](#the-main-advantage)
- [How It Works](#how-it-works)
- [Quickstart](#quickstart)
- [Simple Comparison](#simple-comparison)
- [Simple Words](#simple-words)
- [Safety And Privacy](#safety-and-privacy)
- [Limits](#limits)
- [Star And Contribute](#star-and-contribute)

<!-- beginner-readme:start -->

## What This Is

Zeuz is a factory. You bring a complete specification, it builds the agent system from it: roles are cast, stages laid out, gates put in front of anything irreversible, and at the end a tester looks at the result. What you get is a project folder. Not a service, not a run button, a folder you can read.

## Why It Helps

Every new agent system gets invented from scratch. Roles, stages, logging, gates. Gates are forgotten first, because they are the part that gets in the way. Zeuz holds that structure for you and will not let the inconvenient half be dropped.

## The Main Advantage

**Main advantage:** an irreversible step has to sit behind a check you can see.

**Why this is better:** The architect and builder prompts demand it, and before giving a verdict the tester goes and looks at whether those gates are actually there. A run reports done only after it agrees.

## How It Works

The pipeline moves in phases inside your host. Every phase has its role, its input, and an artifact you can open and read.

<!-- workflow-diagram:start -->

```text
  ┌───────────┐   ┌───────────┐   ┌───────────┐
  │ Specify   │ ▶ │ Observe   │ ▶ │ Cast      │
  └───────────┘   └───────────┘   └───────────┘
        ▼
  ┌───────────┐   ┌───────────┐   ┌───────────┐
  │ Architect │ ▶ │ Economize │ ▶ │ Build     │
  └───────────┘   └───────────┘   └───────────┘
        ▼
  ┌───────────┐
  │ Test      │
  └───────────┘
```

<!-- workflow-diagram:end -->

| Stage | What happens |
|---|---|
| 1. Specify | Goal, input, completeness invariant, constraints, done-when |
| 2. Observe | What is actually available on this machine, written to a log |
| 3. Cast | Role definitions and verified personas |
| 4. Architect | Parallel boundaries and deterministic gate requirements |
| 5. Economize | A model map and context-saving measures per stage |
| 6. Build | Agent files, a workflow, a protocol, a router, a plan graph |
| 7. Test | Syntax, gates, observability, lineage, personas, dry run |

### Step 1: Write the specification

You state the goal, the input, what must never be skipped, the constraints, and how you will know it is done. A missing or very short specification is rejected.

**You get:** a specification the factory can build against instead of guessing.

### Step 2: Snapshot the local runtime

The first phase records a runtime snapshot in a local JSONL file. When an optional tool is missing, the run records that fact instead of pretending.

**You get:** a written starting point you can look at afterwards.

### Step 3: Roles get their people

The cast phase writes role definitions for the future system and the personas behind them. Biographical facts are meant to be checked, not invented.

**You get:** a named team instead of one anonymous prompt.

### Step 4: Stages, gates, and a graph

The architect lays out the stages, marks what can run in parallel, and states which gates must be deterministic. The result is a graph, not prose.

**You get:** a plan where irreversible steps are fenced before any code exists.

### Step 5: Choose models and cut context

Each stage gets a model class and measures that keep context small. Cheap mechanical work does not get an expensive model by default.

**You get:** a system that is affordable to run more than once.

### Step 6: Files are written out

The builder writes the generated project into your output directory: agent files, the workflow source, a protocol, a project router, and a plan graph.

**You get:** a project folder you can read, diff, and run separately.

### Step 7: A tester returns a verdict

The tester inspects the generated system across those dimensions and reports findings. Anything other than a passing verdict returns `needs_fix` with the issues attached.

**You get:** an honest status instead of a confident-sounding summary.

## Quickstart

You need Bash and Node.js. The check calls no model at all: it looks at whether the factory source is intact.

```bash
git clone https://github.com/zarubinvibe/zeuz.git
cd zeuz
bash smoke/smoke.sh
```

No Git? Download [the ZIP](https://github.com/zarubinvibe/zeuz/archive/refs/heads/main.zip) or [the tarball](https://github.com/zarubinvibe/zeuz/archive/refs/heads/main.tar.gz) and run the same check inside. To build something real, register `workflows/zeuz-pipeline.js` with a workflow host that provides `args`, `phase()`, `agent()`, and `log()`, then set `ZEUZ_HOME` and `ZEUZ_PROJECTS`. First time here? Open the project in Claude Code and run `/zeuz-setup`: the install goes as a conversation, one question at a time, and nothing happens without your yes.

Never done this before? [The onboarding](docs/ONBOARDING.md) walks the whole first run step by step and says what you see after every command.

**You get:** the check ends on a passing gate line: Node parses the pipeline and the required markers are still there.

## Simple Comparison

| Choice | Best when | What you get | Trade-off |
|---|---|---|---|
| **Zeuz** | You build multi-agent systems more than once | Roles, gates, observability, and a tester verdict by default | Needs a workflow host; no bundled runner |
| Writing the workflow by hand | One small system | Exactly what you intended | Gates and logging get invented again every time |
| An agent framework | You want libraries and a community | Batteries, docs, integrations | You still design the roles, gates, and evidence yourself |
| One long agent prompt | A quick experiment | Nothing to set up | No stages, no gates, and no way to see what happened |

## Simple Words

| Word | Simple meaning |
|---|---|
| Repository | The project folder that Git stores and versions |
| Terminal | The window where you type commands |
| Command | One instruction you give the computer |
| Branch | A separate line of changes that does not touch `main` |
| Pull Request | A request to review your change and accept it |
| Workflow host | The program that runs the pipeline and gives agents their tools |
| Gate | A check that must pass before an irreversible step is allowed |

## Safety And Privacy

- File access: build agents are instructed to write under your output directory; snapshots go under the project folder.
- Shell access: the observe and test phases run local commands, and your host decides sandboxing and approvals.
- Network access: the cast phase asks the host to verify facts online; Zeuz sets no network policy of its own.
- Secrets: the repository needs no credentials, and none belong in a specification or a generated artifact.
- Telemetry: there is no remote telemetry client; snapshots are local files.
- Rollback: Zeuz does not undo generated writes, so use a separate output directory and review the diff.

The trust boundary and how to report a problem are in [SECURITY.md](SECURITY.md).

## Limits

Status: reference implementation. Source, prompts, rules, and a static check. No runner.

- There is no bundled workflow host adapter and no packaged CLI.
- The smoke check inspects source and markers; it does not execute a complete generated system.
- Model labels such as haiku, sonnet, and opus must be mapped by your host.
- Agent verdicts are model output: treat generated code and claims as untrusted until your own checks pass.
- The optional observability binary may be missing, and the run records that instead of failing quietly.

Deeper: [the full reference](docs/DETAILS.md), [the roadmap](specs/00-roadmap.md), [construction rules](rules/best-practices.md), [decision records](docs/decisions/).

## Star And Contribute

Useful? Give Zeuz a star: [https://github.com/zarubinvibe/zeuz](https://github.com/zarubinvibe/zeuz). It takes a second and it decides whether other people ever find the project.

Want to change something? The path is short: fork the repository, create a branch, commit your change, push the branch, then open a Pull Request. Do not push directly to `main`; the release gate rejects it.

Found a problem instead? Open an issue at [https://github.com/zarubinvibe/zeuz/issues](https://github.com/zarubinvibe/zeuz/issues) and say what you ran and what happened.

<!-- beginner-readme:end -->

<!-- pantheon-family:start -->
## Olympuz family

This is one of the public [Olympuz projects](https://github.com/zarubinvibe/athena#olympuz-family). Each row opens the repository or downloads its source as a ZIP.

| Type | Name | What it does | Source |
|---|---|---|---|
| project | Athena | Portable agent OS that restores a complete Claude and Codex setup on a new Mac. | [Repository](https://github.com/zarubinvibe/athena) · [ZIP](https://github.com/zarubinvibe/athena/archive/refs/heads/main.zip) |
| project | Helioz | 24/7 agent work conveyor with verified completion markers and goal-based overnight decisions. | [Repository](https://github.com/zarubinvibe/helioz) · [ZIP](https://github.com/zarubinvibe/helioz/archive/refs/heads/main.zip) |
| project | Mnemazine | Local-first memory system that turns raw inputs into verified reusable knowledge. | [Repository](https://github.com/zarubinvibe/mnemazine) · [ZIP](https://github.com/zarubinvibe/mnemazine/archive/refs/heads/main.zip) |
| project | Themis | Multi-agent assistant for Russian litigation with local OCR and review by a five-jurist council. | [Repository](https://github.com/zarubinvibe/themis) · [ZIP](https://github.com/zarubinvibe/themis/archive/refs/heads/main.zip) |
| project | Zeuz | Factory that turns an idea into a governed multi-agent workflow with gates, observability, and replay. | [Repository](https://github.com/zarubinvibe/zeuz) · [ZIP](https://github.com/zarubinvibe/zeuz/archive/refs/heads/main.zip) |
<!-- pantheon-family:end -->

## License

MIT. See [LICENSE](LICENSE). Zeuz was created by Filipp Zarubin.
