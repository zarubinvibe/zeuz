export const meta = {
  name: 'zeuz-pipeline',
  description: 'Фабрика Зевс: из спеки (собранной grill-me) рождает агентную workflow-систему класса Фемида/Мнемозина. Цепь мастеров: Марков (кастинг душ) → Шухов (архитектура+ворота) → Котельников (токеносбережение+модели) → Лебедев (пишет файлы) → Зворыкин (испытание). args = спека от grill-me.',
  whenToUse: 'Вызывается Зевсом ПОСЛЕ /grill-me (Стадия 0 собрала спеку). Workflow({ name: "zeuz-pipeline", args: <спека> }).',
  phases: [
    { title: 'Observe', detail: 'abtop runtime snapshot + CTX gate' },
    { title: 'Cast', detail: 'Марков: персоны-учёные по ролям (верификация)' },
    { title: 'Architect', detail: 'Шухов: стадии, рой, ворота полноты' },
    { title: 'Economize', detail: 'Котельников: токеносбережение + модель по функции' },
    { title: 'Build', detail: 'Лебедев: пишет агенты/*.md, workflow.js, Протокол, CLAUDE' },
    { title: 'Test', detail: 'Зворыкин: синтаксис, ворота, души, dry-run, зеркало' },
  ],
}

const A = typeof args === 'string' ? args : (args ? JSON.stringify(args, null, 2) : '')
// ponytail: пути от $HOME, не захардкожены — портативно + без утечки username в публичный репо.
// Переопределяй раскладку через env ZEUZ_HOME / ZEUZ_PROJECTS, иначе дефолт ~/Проекты.
const HOME = (typeof process !== 'undefined' && process.env && process.env.HOME) || '.'
const ZEUZ_HOME = (typeof process !== 'undefined' && process.env && process.env.ZEUZ_HOME) || (HOME + '/Проекты/zeuz')
const PROJECTS = (typeof process !== 'undefined' && process.env && process.env.ZEUZ_PROJECTS) || (HOME + '/Проекты')
const CONST = ZEUZ_HOME + '/rules/best-practices.md'
const SAMPLES = 'Опирайся только на правила и спецификации из текущего репозитория; не предполагай доступ к внешним частным образцам.'
const ABTOP = HOME + '/.cargo/bin/abtop'
// new Date()/Date.now() запрещены в workflow-скриптах (ломают resume). RUN_ID — дет. хэш спеки: уникален per-бренд, стабилен для resume.
const __hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36) }
const RUN_ID = 'zeuz-' + __hash(typeof args === 'string' ? args : JSON.stringify(args || ''))
const OBS_LOG = ZEUZ_HOME + '/runs/_observability.jsonl'

const observeRun = async function (label) {
  return await agent(
    'Run Observatory для Зевса. Выполни bash без TTY, не падай если abtop недоступен:\n' +
    'mkdir -p "' + ZEUZ_HOME + '/runs"; OUT=$([ -x "' + ABTOP + '" ] && "' + ABTOP + '" --once 2>&1 || echo "abtop_unavailable"); ' +
    'CTX=$(printf "%s" "$OUT" | grep -Eo "CTX: *[0-9]+%" | head -1 | grep -Eo "[0-9]+" || true); ' +
    'TOK=$(printf "%s" "$OUT" | grep -Eo "Tok:[^ ]+" | head -1 | cut -d: -f2 || true); ' +
    'printf \'{"ts":"%s","run_id":"' + RUN_ID + '","phase":"' + label + '","ctx_percent":"%s","tokens":"%s","raw":%s}\\n\' "$(date -u +%FT%TZ)" "$CTX" "$TOK" "$(printf "%s" "$OUT" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read()[:4000]))")" >> "' + OBS_LOG + '"; ' +
    'if [ "${CTX:-0}" -ge 90 ]; then echo STOP_CTX_90; elif [ "${CTX:-0}" -ge 80 ]; then echo WARN_CTX_80; else echo OK_CTX; fi',
    { label: 'observe-' + label, phase: 'Observe', model: 'haiku' }
  )
}

if (!A || A.trim().length < 20) {
  return { error: 'no_spec', message: 'Нет спеки. Зевс обязан сперва провести /grill-me (Стадия 0) и передать результат в args.' }
}

phase('Observe')
const observeStart = await observeRun('start')
// CTX-гейт фабрики измеряет ГЛАВНЫЙ чат, но мастера работают в ИЗОЛИРОВАННЫХ субагентах — их контекст свой.
// Высокий CTX главного чата блокирует только финальное чтение результата человеком, не постройку. → WARN, не STOP.
// Жёсткий STOP только при явном CTX_HARD_STOP в спеке.
if (String(observeStart).indexOf('STOP_CTX_90') !== -1 && A.indexOf('CTX_HARD_STOP') !== -1) {
  return { error: 'ctx_too_high', run_id: RUN_ID, message: 'CTX >= 90% + CTX_HARD_STOP. Новый чат/сжатие.', observability_log: OBS_LOG }
}
if (String(observeStart).indexOf('STOP_CTX_90') !== -1) {
  log('WARN: CTX>=90% в главном чате. Мастера изолированы, продолжаю; результат читать в свежем чате если контекст переполнен.')
}

// ---------- 1. Марков — кастинг душ ----------
phase('Cast')
const cast = await agent(
  'Ты — МАРКОВ, Кастинг душ фабрики Зевс. Прочитай конституцию ' + CONST + '.\n\nСПЕКА новой системы:\n' + A + '\n\n' +
  'Определи роли системы (census/триаж/процессор/сверка/архив/надзиратель — или иные под домен) и подбери под КАЖДУЮ реального русского учёного-ИЗОБРЕТАТЕЛЯ (создал новое), чья жизнь-метафора = функция. ВЕРИФИЦИРУЙ годы+вклад по web (Firecrawl→sgai→WebSearch). НЕ повторяй занятых (Фемида-юристы; Мнемозина: Кирилов/Сопиков/Ломоносов/Менделеев/Калачов; Зевс: Лобачевский/Шухов/Котельников/Марков/Лебедев/Зворыкин). Не выдумывай даты.\n' +
  'ИМЕНОВАНИЕ: system_name = дисплей-имя (можно кириллицей, напр. «Аполлон»). system_slug = латинский kebab для папки/файлов проекта (напр. apollon). Правило S→Z применяется ТОЛЬКО к имени системы (Zeus→Zeuz), НЕ к именам агентов. Для КАЖДОЙ роли верни name_slug — латинская фамилия учёного (напр. lebedev, shukhov) для имени файла агента; кириллица допустима только внутри души.\n' +
  'Верни JSON: { "system_name", "system_slug", "roles":[{"role","name","name_slug","dates","invention","metaphor","model"}] }',
  { label: 'cast', phase: 'Cast', agentType: 'general-purpose', model: 'sonnet', schema: {
    type: 'object', required: ['system_name', 'system_slug', 'roles'], properties: {
      system_name: { type: 'string' }, system_slug: { type: 'string' },
      roles: { type: 'array', items: { type: 'object', required: ['role', 'name', 'name_slug', 'dates', 'metaphor'], properties: {
        role: { type: 'string' }, name: { type: 'string' }, name_slug: { type: 'string' }, dates: { type: 'string' },
        invention: { type: 'string' }, metaphor: { type: 'string' }, model: { type: 'string' } } } } } }
})

// ---------- 2. Шухов — архитектура + ворота ----------
phase('Architect')
const arch = await agent(
  'Ты — ШУХОВ, Архитектор фабрики Зевс. Конституция: ' + CONST + '. ' + SAMPLES + '\n\nСПЕКА:\n' + A + '\nРОЛИ:\n' + JSON.stringify(cast.roles) + '\n\n' +
  'Спроектируй скелет системы по ИНВАРИАНТУ из спеки. Стадии; где рой параллельный (независимые юниты), где барьер. ВОРОТА полноты: каждое необратимое действие (архив/публикация/mv) → маркер `## ИМЯ ✓` перед ним, что охраняет, как проверяется КОДОМ. Граф конвейера. Точки рой-масштаба (объём → волнами).\n' +
  'Верни JSON: { "stages":[{"name","agent_role","parallel":bool}], "gates":[{"marker","guards","check"}], "graph", "swarm_note" }',
  { label: 'arch', phase: 'Architect', agentType: 'general-purpose', model: 'opus', schema: {
    type: 'object', required: ['stages', 'gates'], properties: {
      stages: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, agent_role: { type: 'string' }, parallel: { type: 'boolean' } } } },
      gates: { type: 'array', items: { type: 'object', properties: { marker: { type: 'string' }, guards: { type: 'string' }, check: { type: 'string' } } } },
      graph: { type: 'string' }, swarm_note: { type: 'string' } } }
})

// ---------- 3. Котельников — токеносбережение + модели ----------
phase('Economize')
const econ = await agent(
  'Ты — КОТЕЛЬНИКОВ, Эконом токенов фабрики Зевс. Конституция (§5,§8): ' + CONST + '\n\nАРХИТЕКТУРА:\n' + JSON.stringify(arch.stages) + '\n\n' +
  'К каждой стадии приложи токеносбережение (hash-cache · markitdown · локальный OCR/embed · тяжёлое-чтение→субагент · разведка→полный · max_tool_output_chars · compressToolResults) где применимо. Назначь модель по функции: механика→Haiku, синтез/ворота→Sonnet, product-critical/необратимое/спорное→Opus. Добавь budget caps и CTX-gates для больших стадий.\n' +
  'Верни JSON: { "savers":[{"stage","mechanisms"}], "model_map":[{"stage","model","why"}] }',
  { label: 'econ', phase: 'Economize', agentType: 'general-purpose', model: 'sonnet', schema: {
    type: 'object', required: ['model_map'], properties: {
      savers: { type: 'array', items: { type: 'object', properties: { stage: { type: 'string' }, mechanisms: { type: 'string' } } } },
      model_map: { type: 'array', items: { type: 'object', properties: { stage: { type: 'string' }, model: { type: 'string' }, why: { type: 'string' } } } } } }
})

// ---------- 4. Лебедев — постройка файлов ----------
phase('Build')
const sysName = cast.system_name || 'НоваяСистема'
// system_slug — латиница kebab; S→Z применяется ТОЛЬКО к имени системы (Zeus→Zeuz). Папка проекта в ~/Проекты/, не на Desktop.
const sysSlug = (cast.system_slug || 'new-system').toLowerCase().replace(/s/g, 'z').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
const targetDir = PROJECTS + '/' + sysSlug
const planDag = {
  run_id: RUN_ID,
  kind: 'zeuz-factory',
  system_name: sysName,
  created_at: RUN_ID, // дет.: реальная метка времени штампится bash (date -u) при записи артефактов
  stages: arch.stages || [],
  gates: arch.gates || [],
  model_map: econ.model_map || [],
  savers: econ.savers || [],
  patterns: ['abtop-run-observatory', 'graphify-final-if-knowledge', 'plan-dag-artifact', 'artifact-lineage', 'bernstein-profile-for-high-stakes']
}
await agent(
  'Запиши DAG artifact Зевса через Write. Путь: ' + targetDir + '/runs/' + RUN_ID + '-plan.dag.json\nJSON:\n' + JSON.stringify(planDag, null, 2),
  { label: 'write-plan-dag', phase: 'Build', model: 'haiku' }
)
const build = await agent(
  'Ты — ЛЕБЕДЕВ, Строитель фабрики Зевс. Конституция (СОБЛЮДАЙ строго): ' + CONST + '. ' + SAMPLES + '\n\n' +
  'СПЕКА:\n' + A + '\nРОЛИ:\n' + JSON.stringify(cast.roles) + '\nАРХИТЕКТУРА:\n' + JSON.stringify(arch) + '\nТОКЕНЫ+МОДЕЛИ:\n' + JSON.stringify(econ) + '\n\n' +
  'ИМЕНОВАНИЕ ФАЙЛОВ: проект латиницей. Папка агентов agents/ (латиница). Имя файла агента = его name_slug латиницей (напр. agents/lebedev.md, agents/shukhov.md) — БЕЗ замены S→Z. Дисплей-имя системы для текста внутри: "' + sysName + '" (можно кириллицей); slug проекта: ' + sysSlug + '.\n' +
  'Создай систему "' + sysName + '" в папке ' + targetDir + '/ (mkdir -p ' + targetDir + '/agents). Напиши РАБОЧИЕ файлы:\n' +
  '1. agents/<name_slug>.md — души по формату (личность+метафора+Делает/Не-делает/Характер+правила+модель/скиллы/MCP), персоны из РОЛЕЙ. ОРКЕСТРАТОР системы = Артемий Лебедев (основатель Студии Артемия Лебедева, дизайнер) — его душа пишется ПОД ДИЗАЙН-ОРКЕСТРАЦИЮ (бескомпромиссный вкус, ководство, «дизайнер должен», прямота), файл agents/lebedev.md. НЕ путать с Сергеем Лебедевым (ЭВМ) из фабрики Зевс.\n' +
  '2. ' + sysSlug + '-pipeline.js — workflow с ДЕТЕРМИНИРОВАННЫМИ воротами (args парсить typeof-string; ворота = JS-сверка списков не суждение; форс пропущенных; gated-необратимое; леджер; graphify-финал если рождает знание; Run Observatory через abtop --once start/end; CTX>=90 STOP; DAG artifact; artifact lineage). НЕ использовать new Date()/Date.now() — runtime запрещает; RUN_ID = дет.хэш args, метки времени через bash date -u. НЕ ссылаться на `meta` в теле (meta — только экспорт-литерал, в рантайме undefined); список фаз/стадий инлайнить массивом-литералом, не meta.phases.map.\n' +
  '3. PROTOCOL-' + sysSlug + '.md — SSOT (таблица агентов+модели, ворота, граф, скилл/MCP/модель, observability, DAG/replay, lineage, Bernstein-profile если high-stakes).\n' +
  '4. CLAUDE.md (в папке системы) — автозапуск + конституция + правило abtop/Graphify: abtop runtime, Graphify durable memory.\n' +
  '5. runs/' + RUN_ID + '-plan.dag.json уже создан; добавь ссылку на него в протокол. Для файлов новой системы добавляй metadata/ledger: generated_by, run_id, prompt_sha/inputs, phase, model.\n' +
  'Используй Write/Bash. Верни JSON: { "system_dir", "files_written":[пути] }',
  { label: 'build', phase: 'Build', agentType: 'general-purpose', model: 'opus', schema: {
    type: 'object', required: ['system_dir', 'files_written'], properties: {
      system_dir: { type: 'string' }, files_written: { type: 'array', items: { type: 'string' } } } }
})

// ---------- 5. Зворыкин — испытание ----------
phase('Test')
const test = await agent(
  'Ты — ЗВОРЫКИН, Испытатель фабрики Зевс. Проверь рождённую систему в ' + (build.system_dir || targetDir) + ' ДО сдачи. Наземная правда — выхлоп/диск, не сводка.\n' +
  '1. Синтаксис workflow: node --check с обёрткой `async function __wf(){…}` (sed export→const, top-level return легален).\n' +
  '2. Ворота: grep маркеров `## … ✓` + детерминированной сверки в коде.\n' +
  '3. Observability: grep `abtop --once`, `CTX`, `_observability.jsonl`, `run_id`.\n' +
  '4. DAG/lineage: grep `plan.dag.json`, `generated_by`/`run_id` или ledger metadata.\n' +
  '5. Души: grep персон в каждом агенте; запреты (Не делаешь) на месте.\n' +
  '6. Dry-run логики ворот на мок-данных (node --input-type=module): пропущенный→форс? непокрытое НЕ архивится? леджер sum==census?\n' +
  '7. Вердикт.\n' +
  'Верни JSON: { "verdict":"ГОТОВА|ПРАВКИ|СТОП", "checks":[{"name","ok":bool,"note"}], "issues":[строки] }',
  { label: 'test', phase: 'Test', agentType: 'general-purpose', model: 'sonnet', schema: {
    type: 'object', required: ['verdict'], properties: {
      verdict: { type: 'string' },
      checks: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, ok: { type: 'boolean' }, note: { type: 'string' } } } },
      issues: { type: 'array', items: { type: 'string' } } } }
})
await observeRun('end')

return {
  status: test.verdict === 'ГОТОВА' ? 'done' : 'needs_fix',
  run_id: RUN_ID,
  system_name: sysName,
  system_dir: build.system_dir || targetDir,
  roles: cast.roles,
  gates: arch.gates,
  files: build.files_written,
  verdict: test.verdict,
  observability_log: OBS_LOG,
  plan_dag: targetDir + '/runs/' + RUN_ID + '-plan.dag.json',
  issues: test.issues || [],
  next: test.verdict === 'ГОТОВА'
    ? 'Зевс: Graphify (если рождает знание) + зеркало Codex+VPS + сдача пользователю.'
    : 'Вернуть Лебедеву с issues, перестроить, пере-испытать.'
}
