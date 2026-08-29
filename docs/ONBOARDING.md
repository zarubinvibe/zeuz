# Onboarding

This walkthrough assumes you have never built a multi-agent system before. Every step says what to do and what you should see afterwards. If a step shows something else, stop there.

The fastest path is the guided one: open the project in Claude Code and run `/zeuz-setup`. Zeus installs himself as a conversation, one question at a time, and installs nothing without your yes. The steps below are the same road on foot.

You need Bash and Node.js. You also need a workflow host: a program that executes a pipeline and gives agents their tools. Zeuz does not ship one, and that is said here rather than discovered later.

1. **Get the project.**

   ```bash
   git clone https://github.com/zarubinvibe/zeuz.git
   cd zeuz
   ```

   You see a `zeuz` folder and your prompt inside it.

2. **Prove the source is intact.**

   ```bash
   bash smoke/smoke.sh
   ```

   You see a passing gate line at the end. It means Node can parse the pipeline and the required markers for observability, the stage graph, gates, schemas, agents and layout are still in place. It does not run any agent.

3. **Understand what you just checked.** The smoke test is static on purpose: it costs nothing, needs no model, and catches the damage that silently breaks a factory. Anything beyond it needs a host.

4. **Point Zeuz at a place for generated work.**

   ```bash
   export ZEUZ_HOME="$PWD"
   export ZEUZ_PROJECTS="$PWD/../zeuz-output"
   ```

   Generated systems land outside the factory, so your diff stays readable and nothing is overwritten by accident.

5. **Register the pipeline with your host.** `workflows/zeuz-pipeline.js` expects four things from it: the input value, a phase marker, a call to an agent, and a log line. Structured agent output must be supported.

6. **Write a real specification.** Goal, input, the completeness invariant that must never be skipped, constraints, and how you will know it is done. A missing or very short specification is refused: without a done-when the tester has nothing to check.

7. **Run the factory and watch the phases.** Observe records what this machine actually has. Cast writes roles. Architect lays out stages and puts gates in front of irreversible steps. Economize assigns model classes. Build writes the files. Test returns a verdict.

   You see a project folder appear under `ZEUZ_PROJECTS`, with agent files, a workflow, a protocol, a router and a plan graph.

8. **Read the verdict, not the summary.** A run reports done only when the tester agrees. Anything else comes back as needs-fix with the issues attached. Treat generated code and claims as untrusted until your own checks pass.

9. **Review before you trust.** Open the generated project separately, read the gates, and run its own tests before letting it publish, archive, move or deploy anything.

## Keeping it current

Later, when a new version is published, do not clone it again: open the project in Claude Code and run `/zeuz-update`. It shows what changed first, pulls only fast-forward changes, leaves your settings and your data alone, and re-checks itself afterwards.

## If this helped

If Zeuz saved you from inventing gates and logging one more time, give it a star: [https://github.com/zarubinvibe/zeuz](https://github.com/zarubinvibe/zeuz). It takes a second and decides whether other people ever find the project.

You have now run it end to end, which makes you the person who can improve it. The path is short: fork the repository, create a branch, commit your change, push the branch, then open a Pull Request. Do not push directly to `main`; the release gate rejects it.

Found a step that lies? Open an issue at [https://github.com/zarubinvibe/zeuz/issues](https://github.com/zarubinvibe/zeuz/issues) and say what you ran and what you saw.
