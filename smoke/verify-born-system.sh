#!/usr/bin/env bash
# Гейт Зворыкина для РОЖДЁННОЙ системы — детерминированная верификация в ГЛАВНОМ ПОТОКЕ.
# Урок (apollon-v2 2026-06-23): финальный verify в фоновом рое виснет на MCP/транскрипт-операциях
# (180с×6 → workflow failed). Дет-гейт скриптом в главном потоке дешевле и надёжнее перезапуска роя.
# Зевс зовёт ЭТО после возврата pipeline со status=built, НЕ фоновый агент-испытатель.
#
# Usage: smoke/verify-born-system.sh <system_dir>
# Exit 0 = ГОТОВА; exit 1 = ПРАВКИ (с перечнем дыр).
set -uo pipefail

DIR="${1:-}"
if [ -z "$DIR" ] || [ ! -d "$DIR" ]; then
  echo "❌ Нет папки системы. Usage: verify-born-system.sh <system_dir>"; exit 1
fi
DIR="${DIR%/}"
fail=0
note() { printf '%s %s\n' "$1" "$2"; }

# pipeline.js рождённой системы (<slug>-pipeline.js, один на папку)
WF="$(ls "$DIR"/*-pipeline.js 2>/dev/null | head -1)"
if [ -z "$WF" ]; then note "❌" "нет <slug>-pipeline.js в $DIR"; fail=1; fi

# 1. Синтаксис workflow (export→const + обёртка, top-level return легален).
if [ -n "$WF" ]; then
  tmp="$(mktemp /tmp/born-wf.XXXXXX.mjs)"
  { echo 'async function __wf(){'; sed 's/^export const /const /' "$WF"; echo '}'; } > "$tmp"
  if node --check "$tmp" 2>/tmp/born-node.err; then note "✓" "синтаксис pipeline"; else
    note "❌" "синтаксис pipeline:"; cat /tmp/born-node.err; fail=1; fi
  rm -f "$tmp"

  # 2. new Date()/Date.now()/Math.random() — запрещены (ломают resume). Коммент-запрет не считается за вызов.
  if grep -nE '(new[[:space:]]+Date|Date\.now|Math\.random)\(' "$WF" | grep -vE 'ЗАПРЕЩ|запрещ|forbidden|НЕ использов' >/dev/null; then
    note "❌" "вызов new Date/Date.now/random (ломает resume):"; grep -nE '(new[[:space:]]+Date|Date\.now|Math\.random)\(' "$WF" | grep -vE 'ЗАПРЕЩ|запрещ|forbidden|НЕ использов'; fail=1
  else note "✓" "ноль вызовов new Date/Date.now/random"; fi

  # 3. Инварианты-канон в pipeline (наземная правда — grep).
  for c in "_observability:observability-лог" "run_id:run_id/lineage" "STOP_CTX|CTX:CTX-gate" "plan.dag|dag.json:DAG artifact"; do
    pat="${c%%:*}"; desc="${c#*:}"
    if grep -qE "$pat" "$WF"; then note "✓" "$desc"; else note "❌" "нет: $desc"; fail=1; fi
  done

  # 4. Ворота: хотя бы один маркер `## … ✓` ИЛИ дет-сверка перед необратимым.
  if grep -qE '##[^✓]*✓|gate_passed|gate\b' "$WF"; then note "✓" "ворота (маркер/дет-сверка)"; else note "❌" "нет ворот"; fail=1; fi
fi

# 5. Души: agents/*.md существуют, у каждой есть запрет (Не делает / НЕДОСТУПЕН / BLOCK).
souls=0; soulfail=0
if [ -d "$DIR/agents" ]; then
  for s in "$DIR"/agents/*.md; do
    [ -e "$s" ] || continue; souls=$((souls+1))
    grep -qE 'Не делаеш|Не-делаеш|НЕДОСТУПЕН|BLOCK|НЕ строить|STOP' "$s" || { note "⚠" "душа $(basename "$s") без явного запрета"; soulfail=$((soulfail+1)); }
  done
fi
if [ "$souls" -eq 0 ]; then note "❌" "нет душ в agents/"; fail=1; else note "✓" "$souls душ ($soulfail без запрета)"; fi

# 6. Схема: CLAUDE.md + PROTOCOL присутствуют.
[ -f "$DIR/CLAUDE.md" ] && note "✓" "CLAUDE.md" || { note "❌" "нет CLAUDE.md"; fail=1; }
ls "$DIR"/PROTOCOL*.md >/dev/null 2>&1 && note "✓" "PROTOCOL" || note "⚠" "нет PROTOCOL*.md"

if [ "$fail" -eq 0 ]; then echo "ВЕРДИКТ: ГОТОВА ✓"; exit 0; else echo "ВЕРДИКТ: ПРАВКИ ❌ (см. ❌ выше)"; exit 1; fi
