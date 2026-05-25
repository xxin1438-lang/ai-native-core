# AI Native Core 架构设计

## 一、设计目标

构建一个项目无关的 AI Native 运行时框架。核心挑战：技术栈、设计系统、组件体系、Demo 页面、mock 服务、E2E、禁止模式、文件路径、CI/CD、Hooks 路径、工具链等全部维度需要从框架中解耦。

## 二、五层架构

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  Layer 5  验收层（Structured Acceptance Pipeline）         │
│  ┌─────────────────────────────────────────────────┐     │
│  │ acceptance.yaml → 执行引擎 → 结构化报告           │     │
│  │ env → lint → typecheck → test → e2e → visual     │     │
│  └─────────────────────────────────────────────────┘     │
│                           ↑                               │
│  Layer 4  自迭代层（Self-Iteration Hooks）                │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Stop hook → studybook reminder → skill → commit   │     │
│  │ Commit hook → paradigm detection → self-update    │     │
│  │             → trigger sync                        │     │
│  └─────────────────────────────────────────────────┘     │
│                           ↑                               │
│  Layer 3  SDD 门禁层（Spec-Driven Development Gate）      │
│  ┌─────────────────────────────────────────────────┐     │
│  │ propose → design.md (ASCII wireframe)            │     │
│  │        → human confirm                           │     │
│  │        → apply                                   │     │
│  └─────────────────────────────────────────────────┘     │
│                           ↑                               │
│  Layer 2  资产记忆层（Asset Memory Distiller）            │
│  ┌─────────────────────────────────────────────────┐     │
│  │ MANIFEST.yaml → 读源文件 → LLM 蒸馏 → 记忆文件   │     │
│  │ .ai-native/memory/SYNC-STATE.md                  │     │
│  │ .ai-native/memory/design-foundation.md            │     │
│  │ .ai-native/memory/forbidden-patterns.md           │     │
│  │ .ai-native/memory/known-pitfalls.md                │     │
│  │ .ai-native/memory/available-resources.md          │     │
│  │ .ai-native/memory/architecture-paradigm.md        │     │
│  └─────────────────────────────────────────────────┘     │
│                           ↑                               │
│  Layer 1  配置驱动层（Config + Adapter Layer）            │
│  ┌─────────────────────────────────────────────────┐     │
│  │ .ai-native/config.toml  (项目元信息)             │     │
│  │ adapters/{react-spa,nextjs,vue,...}/             │     │
│  │   ├── template.ts   (记忆因子模板)                │     │
│  │   ├── rules.ts      (禁止模式)                   │     │
│  │   └── stack.yaml    (技术栈声明)                  │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Layer 1 — 配置驱动层

这是整个框架的地基。所有后续层的行为都由这一层的配置和适配器决定。

**ai-native.config.toml** 定义项目元信息：
- 项目名、类型（frontend/backend/fullstack/cli）
- 技术栈声明（框架、CSS 方案、包管理器）
- 源文件路径（哪些目录需要蒸馏）
- 记忆因子定义（哪些因子、优先级）
- E2E 工具选择
- AI 工具链选择（Claude/Cursor/Copilot）

**适配器** 封装技术栈差异：
- 每个适配器提供该栈的默认模板、禁止模式、已知坑
- 适配器之间完全隔离，互不依赖
- 用户可以继承适配器并覆盖部分规则

```
适配器接口（TypeScript）：
interface Adapter {
  id: string;
  displayName: string;
  supportedStack: StackDeclaration;
  memoryTemplates: MemoryFactorTemplate[];
  defaultForbiddenPatterns: Rule[];
  defaultPitfalls: Rule[];
  defaultAcceptancePipeline: AcceptancePhase[];
}
```

### Layer 2 — 资产记忆层

这是整个体系的最核心创新——把项目知识蒸馏为 AI Agent 可直接消费的紧凑约束。

**MANIFEST.yaml** 是记忆因子的声明式配置：
```yaml
factors:
  - name: design-foundation
    description: 设计基座约束
    source_globs: ["design/", "docs/design/"]
    distill_prompt: |
      从源文件中提取设计约束，每条一行。聚焦：用什么、怎么用、禁止什么。
    max_items: 15
    priority: critical

  - name: security-rules
    description: 安全红线
    source_globs: ["docs/security/", ".github/workflows/"]
    distill_prompt: |
      提取安全约束和 CI 门禁规则。
    max_items: 10
    priority: critical
```

**蒸馏引擎**（Distiller）：
1. 读取 MANIFEST.yaml → 获取因子定义
2. 根据 `source_globs` 收集源文件
3. 计算源文件 hash，与 SYNC-STATE.md 对比
4. 有变更的因子 → 调用 LLM（按 `distill_prompt` 蒸馏）
5. 写入记忆文件 + 更新 SYNC-STATE.md

关键设计决策：
- 蒸馏是一次性批量操作，不是实时监听
- 蒸馏结果是人类可读的 markdown，不是向量数据库
- 蒸馏质量由 `max_items` 和 `distill_prompt` 保证，不是事后校验

**三层记忆模型**：

```
.ai-native/
├── org/              # 层级 1：组织级（git 仓库分发）
│   └── memory/
│       ├── org-coding-standards.md
│       └── org-security-rules.md
├── memory/           # 层级 2：项目级
│   ├── MANIFEST.yaml
│   └── design-foundation.md
└── (合并加载，项目覆盖组织)

~/.ai-native/memory/  # 层级 3：个人级（本机）
└── personal-preferences.md
```

### Layer 3 — SDD 门禁层

不可跳步的 spec-before-code 管道：

```
propose → design.md (含 ASCII wireframe) → 人工确认 → apply
```

这一层与具体 SDD 工具解耦。框架预留接口：
- `sdDClient.propose(context)` → 生成 proposal/design/tasks
- `sdDClient.apply(change)` → 执行实现
- `sdDClient.validate(design)` → 校验 wireframe 存在

### Layer 4 — 自迭代层

两个核心 Hook + 一个触发动作：

**Hook A：复盘提醒（Stop 事件）**
- 条件：git dirty + 冷却期（默认 20min）
- 输出：`"本次话题需要复盘。y/n？"`
- 用户 y → AI 调用 studybook-review skill → sub-agent 读 diff + 写踩坑记录
- 用户 n → pending 入队

**Hook B：范式变更检测（Commit 事件）**
- 检测 commit 是否涉及范式路径
- 范式路径（可配置）→ 提示追加变更日志 + 触发 sync
- 踩坑记录路径 → 仅提示 sync

**触发动作：sync**
- 范式变更后，重新蒸馏记忆因子
- 通过 `ai-native sync` 执行

关键设计：
- Hook 监控路径从配置读取，不硬编码
- 支持同时生成 Claude/Cursor/Copilot 三种 AI 工具的 hook 配置
- 冷却时间、提示文案均可配置

### Layer 5 — 验收层

结构化验收管道，替代 markdown checklist：

```yaml
# .ai-native/acceptance.yaml
version: 1
phases:
  - name: environment
    checks:
      - type: exec
        run: "node --version"
        expect: { pattern: "v(1[89]|2[0-9])" }

      - type: file-exists
        paths:
          - ".ai-native/config.toml"
          - ".ai-native/memory/SYNC-STATE.md"

  - name: code-quality
    checks:
      - type: exec
        run: "pnpm lint"

      - type: exec
        run: "pnpm typecheck"

      - type: exec
        run: "pnpm test"

  - name: e2e
    checks:
      - type: exec
        run: "pnpm e2e"
      - type: visual
        tool: "chrome-mcp"

  - name: build
    checks:
      - type: exec
        run: "pnpm build"

report:
  format: markdown
  output: ".ai-native/reports/acceptance-{date}.md"
```

验收执行器：
1. 按 phases 顺序执行 checks
2. 每个 check 返回 pass/fail + 证据（stdout、截图、文件存在性）
3. 汇总为结构化报告

## 三、解耦设计

框架核心引擎对以下维度保持零耦合，全部通过配置或适配器注入：

| 维度 | 解耦方式 |
|------|---------|
| 技术栈 | 适配器模式，config 中声明 `stack = "react-spa"` |
| 设计系统 | 蒸馏引擎从项目自己的 design/ 目录提取 |
| 组件体系 | 适配器提供通用规则，项目在 MANIFEST 中自定义 |
| Demo/示例页面 | 可选 Phase，通过 `onboarding.demo_enabled = false` 关闭 |
| Mock 服务 | 验收配置中自定义 exec 命令 |
| E2E 规格 | 验收配置中自定义，框架不内置 |
| 禁止模式 | 适配器提供通用规则 + 项目在因子文件中自定义 |
| 目录结构 | 所有路径从 config.toml 读取 |
| CI/CD | 验收配置中自定义，框架不内置 CI |
| Hooks 监控路径 | `paradigm.watch_paths` 在 config.toml 中配置 |
| 自定义工具 | 项目 skill/plugin 独立管理，框架提供通用 sync/accept |

## 四、渐进式采用路径

框架设计为可选模块，项目可以逐步接入：

```
Phase 1：只用资产记忆
  ai-native init → 配置 MANIFEST.yaml → ai-native sync
  → AI Agent 开始加载记忆因子

Phase 2：加入验收管道
  配置 acceptance.yaml → ai-native accept
  → 结构化质量门禁

Phase 3：启用 hooks 自迭代
  配置 hooks → ai-native hooks install
  → 自动复盘 + 范式检测

Phase 4：接入 SDD 门禁
  配置 sdd tool → ai-native propose / apply
  → 完整 SDD 工作流
```
