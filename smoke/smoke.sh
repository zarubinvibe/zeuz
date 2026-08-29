#!/usr/bin/env bash
# Гейт zeuz: синтаксис workflow + наличие инвариантов конституции в pipeline.
# 0 ошибок = можно сдавать. По мотивам smoke-гейта athena-os.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WF="$ROOT/workflows/zeuz-pipeline.js"
fail=0

note() { printf '%s %s\n' "$1" "$2"; }

# 1. Синтаксис workflow (export→const + обёртка, top-level return легален).
tmp="$(mktemp /tmp/zeuz-wf.XXXXXX.mjs)"
{ echo 'async function __wf(){'; sed 's/^export const /const /' "$WF"; echo '}'; } > "$tmp"
if node --check "$tmp" 2>/tmp/zeuz-node.err; then
  note "✓" "node --check pipeline"
else
  note "❌" "синтаксис pipeline:"; cat /tmp/zeuz-node.err; fail=1
fi
rm -f "$tmp"

# 2. Инварианты конституции присутствуют в pipeline (grep, наземная правда).
declare -a checks=(
  "abtop --once:Run Observatory"
  "_observability.jsonl:observability-лог"
  "plan.dag.json:DAG artifact"
  "STOP_CTX_90:CTX-gate"
  "best-practices.md:путь конституции"
  "schema:структурированный вывод душ"
)
for c in "${checks[@]}"; do
  pat="${c%%:*}"; desc="${c#*:}"
  if grep -qF "$pat" "$WF"; then note "✓" "$desc"; else note "❌" "нет: $desc ($pat)"; fail=1; fi
done

# 3. Души на месте (6 мастеров + надзиратель).
for soul in zeuz spec-lobachevsky cast-markov arch-shukhov econ-kotelnikov build-lebedev test-zvorykin; do
  if [ -f "$ROOT/agents/$soul.md" ]; then note "✓" "душа $soul"; else note "❌" "нет души $soul"; fail=1; fi
done

# 4. Схема Афины на месте.
for f in CLAUDE.md rules/best-practices.md specs/00-roadmap.md docs/decisions; do
  if [ -e "$ROOT/$f" ]; then note "✓" "схема: $f"; else note "❌" "нет: $f"; fail=1; fi
done

if [ "$fail" -eq 0 ]; then echo "ГЕЙТ ПРОЙДЕН ✓"; exit 0; else echo "ГЕЙТ ПРОВАЛЕН ❌"; exit 1; fi
