> Long-form reference kept from the previous README. The short beginner page lives in [README.md](../README.md).

# Zeuz

Zeuz - фабрика агентных workflow для совместимого host. Она принимает полную спецификацию, затем специалисты проектируют, записывают и проверяют новую многоагентную систему.

[Быстрый старт](#быстрый-старт) · [Пример](#пример-запуска) · [Безопасность](#безопасность-и-приватность) · [Участие](../CONTRIBUTING.md) · [English](../README.md)

<p align="center">
  <img src="../docs/assets/pantheon/emblem.png" alt="Эмблема Zeuz: Зевс, золотая молния, граф с воротами и мраморная колонна" width="144">
</p>

![Светлый Pantheon hero Zeuz: Зевс рядом с управляемым графом workflow и классической колонной](../docs/assets/pantheon/hero.png)

> Статус: reference implementation. В репозитории лежат исходник workflow, prompts агентов, правила проектирования и статический smoke-тест. Отдельного runner и полного end-to-end fixture пока нет.

## Быстрый старт

Нужны Bash и Node.js.

```bash
git clone https://github.com/zarubinvibe/zeuz.git
cd zeuz
bash smoke/smoke.sh
```

Последняя строка успешной проверки:

```text
ГЕЙТ ПРОЙДЕН ✓
```

Этот результат подтверждает две вещи. Node разбирает workflow внутри async-обёртки, а в исходнике остались обязательные маркеры observability, DAG, CTX-gate, schema, агентов и раскладки репозитория. Самих агентов smoke не запускает.

## Запуск в host

`workflows/zeuz-pipeline.js` рассчитан на workflow host, где доступны `args`, `phase()`, `agent()` и `log()`. Host должен уметь передавать агенту JSON Schema через опцию `schema`.

Укажи checkout Zeuz и родительский каталог для создаваемых проектов:

```bash
export ZEUZ_HOME="$PWD"
export ZEUZ_PROJECTS="$PWD/../zeuz-output"
```

Зарегистрируй `workflows/zeuz-pipeline.js` в host и передай полную спецификацию:

```js
Workflow({
  name: 'zeuz-pipeline',
  args: `
Цель: собрать workflow для проверки release notes перед публикацией.
Вход: Markdown-файлы, до 50 за один прогон.
Инвариант полноты: у каждого входного файла записан вердикт.
Ограничения: публикация только после approval; нужен audit trail.
Готово: ledger содержит один вердикт на каждый входной файл.
  `.trim(),
})
```

Pipeline отклоняет пустую или слишком короткую спецификацию. Интерактивный шаг `/grill-me`, указанный в prompts агентов, относится к настройке host и в этот репозиторий не входит.

## Пример запуска

Фазы workflow:

| Фаза | Что требует исходник от агента |
|---|---|
| Observe | Локальный runtime snapshot в `runs/_observability.jsonl`; `abtop` опционален |
| Cast | Роли и проверенные биографии учёных для персон агентов |
| Architect | Стадии, границы параллельной работы, требования к воротам и граф |
| Economize | Карта моделей и способы экономить контекст на каждой стадии |
| Build | Файлы агентов, workflow, протокол, `CLAUDE.md` и plan DAG |
| Test | Проверки синтаксиса, ворот, observability, lineage, персон и dry-run, затем вердикт |

Новая система записывается в `ZEUZ_PROJECTS/<system-slug>/`. Build prompt запрашивает такой комплект:

```text
agents/<scientist-slug>.md
<system-slug>-pipeline.js
PROTOCOL-<system-slug>.md
CLAUDE.md
runs/<run-id>-plan.dag.json
```

Финальный ответ получает `status: "done"`, только если испытатель вернул `ГОТОВА`. При другом вердикте pipeline отдаёт `status: "needs_fix"` и список найденных проблем.

## Ворота и доказательства

Prompts архитектора и строителя требуют закрывать необратимые действия детерминированными проверками. Prompt испытателя ищет эти проверки перед вердиктом. Smoke самой фабрики проверяет меньше: `node --check`, наличие файлов и обязательные fixed-string маркеры.

Храни создаваемый проект в отдельном каталоге. Перед публикацией, архивом, переносом или деплоем проверь файлы и запусти его собственные тесты.

## Безопасность и приватность

- Файлы: build-агенты получают команду писать в `ZEUZ_PROJECTS`, observability пишет в `ZEUZ_HOME/runs`.
- Shell: prompts Observe и Test запускают локальные команды. Sandbox и approvals настраивает host.
- Сеть: Cast просит host проверить биографические факты через веб. Zeuz не задаёт сетевую политику.
- Секреты: репозиторию не нужны credentials. Не клади секреты в спецификацию и создаваемые артефакты.
- Телеметрия: удалённого telemetry client нет. Runtime snapshots остаются в локальном JSONL.
- Подтверждения: репозиторий описывает ворота, но сам не управляет правами host.
- Откат: автоматического undo нет. Используй изолированный output-каталог и проверяй diff.

Граница доверия и порядок сообщения об уязвимостях описаны в [SECURITY.md](../SECURITY.md).

## Карта проекта

| Путь | Назначение |
|---|---|
| `workflows/zeuz-pipeline.js` | Workflow для совместимого host |
| `agents/` | Prompts контролёра и шести специалистов |
| `rules/best-practices.md` | Локальные правила сборки, которые получают агенты |
| `specs/00-roadmap.md` | Фазы и владельцы ролей |
| `docs/decisions/` | Архитектурные решения |
| `smoke/smoke.sh` | Статическая проверка синтаксиса и маркеров |
| `CLAUDE.md` | Роутер проекта для совместимых coding-agent sessions |

## Статус и ограничения

Zeuz пока reference implementation, а не готовый CLI или SDK. Публичного плана релизов в репозитории нет.

- Адаптера для workflow host в репозитории нет.
- Smoke не исполняет полную созданную систему.
- Метки моделей `haiku`, `sonnet` и `opus` должен понимать или преобразовывать host.
- Вердикты агентов остаются model output. Созданный код и факты требуют независимой проверки.
- `abtop` опционален. Если binary недоступен, Observe записывает `abtop_unavailable`.



## Как помочь проекту

Прочитай [CONTRIBUTING.md](../CONTRIBUTING.md), не раздувай scope и запусти:

```bash
bash smoke/smoke.sh
git diff --check
```

## Авторство и лицензия

Zeuz создал Philipp Zarubin. Исходная структура workflow, персоны агентов и ранние иллюстрации остаются в истории Git и каталоге `docs/assets/`.

Код распространяется по [MIT License](../LICENSE). Copyright (c) 2026 Philipp Zarubin.
