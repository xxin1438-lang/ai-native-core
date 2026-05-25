# AI Native Core 使用指南

本文档面向团队开发者，说明如何在项目中安装、配置和使用 ai-native-core。

---

## 一、安装

```bash
npm install -g ai-native-core
```

验证：

```bash
ai-native --version
```

---

## 二、初始化新项目

在项目根目录执行：

```bash
cd your-project
ai-native init --stack react-spa
```

`--stack` 选择适配器，monorepo 支持逗号分隔多栈：

```bash
# 单栈
ai-native init --stack react-spa

# 多栈（monorepo 前后端）
ai-native init --stack react-spa,backend-java
```

| 值 | 适用项目 |
|----|---------|
| `react-spa` | React + Vite + TanStack |
| `nextjs` | Next.js 14+ App Router |
| `vue` | Vue 3 + Vite + Pinia |
| `backend-go` | Go 后端 |
| `backend-python` | Python FastAPI |
| `backend-java` | Java Spring Boot 3.x |

### 初始化生成了什么

```
your-project/
├── .ai-native/
│   ├── config.toml              # 项目配置
│   ├── memory/
│   │   ├── MANIFEST.yaml        # 记忆因子定义
│   │   └── (首次 sync 后生成因子文件)
│   ├── acceptance.yaml          # 验收配置
│   └── hooks/
│       ├── studybook-reminder.sh
│       └── paradigm-change-monitor.sh
├── .claude/
│   ├── CLAUDE.md                # AI 入口（自动加载记忆）
│   └── settings.json            # Hooks
├── docs/
│   ├── .ai-native/memory/       # 模板（git 提交）
│   ├── decisions/               # 踩坑记录
│   └── self-update.md           # 变更日志
└── .github/copilot-instructions.md
```

---

## 三、必须编辑的 3 个文件

### 1. `.ai-native/config.toml`

```toml
[project]
name = "your-project"       # 改这里

[stack]
adapter = "react-spa"       # 确认

[paradigm]
watch_paths = [             # 监控哪些路径变更触发 sync
  "docs/architecture/",
  "design/",
]

[ai_tools]
engines = ["claude"]        # 你用的 AI 工具
```

### 2. `.ai-native/memory/MANIFEST.yaml`

调整 `source_globs` 指向实际文档路径：

```yaml
factors:
  - name: design-foundation
    source_globs:
      - "design/**/*.md"         # 你的设计文档路径
```

### 3. `.ai-native/acceptance.yaml`

改成项目的脚本命令：

```yaml
checks:
  - type: exec
    run: "pnpm lint"            # 你的 lint 命令
  - type: exec
    run: "pnpm test"            # 你的测试命令
```

---

## 四、首次蒸馏

```bash
ai-native sync
```

框架会读取项目文档，蒸馏为记忆因子。输出示例：

```
[ai-native] 蒸馏 design-foundation → 14 条
[ai-native] 蒸馏 forbidden-patterns → 18 条
[ai-native] 蒸馏 known-pitfalls → 6 条
[ai-native] 完成。hash: a1b2c3d
```

---

## 五、日常命令速查

| 命令 | 用途 |
|------|------|
| `ai-native sync` | 重新蒸馏所有记忆因子 |
| `ai-native sync --check` | 检查是否需要同步 |
| `ai-native sync --factor <name>` | 仅蒸馏指定因子 |
| `ai-native sync --dry-run` | 预览变更 |
| `ai-native accept` | 运行验收管道 |
| `ai-native hooks install` | 安装 hooks |
| `ai-native hooks status` | 查看 hooks 状态 |

---

## 六、团队工作流

### 新成员加入

```bash
git clone <repo>
cd <repo>
ai-native init                     # 复制模板 → 生成配置
ai-native accept                   # 运行验收
```

### 日常开发

```bash
git pull
ai-native sync --check             # 检查记忆是否过期
# 如果过期 → ai-native sync
# 开始工作 — AI 已加载最新记忆
```

### 修改文档后

```bash
vim docs/architecture/adr.md
git commit -m "docs: new ADR"
# → Hook 自动提醒：追加 self-update + 运行 sync
ai-native sync
git add docs/.ai-native/memory/ docs/self-update.md
git commit -m "ai-native: sync memory"
```

### 踩坑复盘

Hook 在工作结束后自动提醒 → 回复 `y` → AI 生成踩坑记录：

```
docs/decisions/2026-05-25-01-topic.md
```

提交后 Hook 再次提醒 sync → 新踩坑提炼为 known-pitfalls 因子。

---

## 七、验收流程

```bash
ai-native accept
```

执行：

```
Phase 1 — 环境       node / pnpm / git / memory
Phase 2 — 代码质量    lint / typecheck / test
Phase 3 — E2E        轨道1(Playwright) + 轨道2(视觉走查)
Phase 4 — 构建        build
```

CI 环境用 `ai-native accept --ci`，跳过交互和视觉走查。

---

## 八、目录与 .gitignore

```
.ai-native/memory/        # 本机生成，不提交
.ai-native/reports/       # 本机生成，不提交

docs/.ai-native/memory/   # 模板副本，git 提交
docs/decisions/           # 踩坑记录，git 提交
docs/self-update.md       # 变更日志，git 提交
```

```gitignore
.ai-native/memory/
.ai-native/reports/
!.ai-native/config.toml
!.ai-native/acceptance.yaml
!.ai-native/memory/MANIFEST.yaml
```

---

## 九、框架升级

当 ai-native-core 发布新版本时（新增适配器、更新内置规则、修 bug）：

```bash
# 1. 更新全局包
npm update -g ai-native-core

# 2. 在项目目录中重新蒸馏（--force 确保新规则被纳入）
cd your-project
ai-native sync --force

# 3. 检查是否需要更新
ai-native sync --check
```

### 升级影响

| 升级内容 | 对项目的影响 | 需要做什么 |
|---------|------------|-----------|
| 新增适配器（如 backend-java） | 无（新项目初始化时才用） | 无需操作 |
| 适配器内置规则更新 | 下次 sync 自动纳入 | `ai-native sync --force` |
| CLI 新增命令 | 直接可用 | 无需操作 |
| config.toml 新增字段 | 已有项目用默认值 | 按需添加 |

CI 环境建议锁定版本：`npm install -g ai-native-core@0.1.0`

---

## 十、常见问题

**Q: sync 后 AI 还是不知道约束？**

检查 AI 入口文件是否存在：

```bash
grep "@memory/" .claude/CLAUDE.md
```

**Q: Hook 不触发？**

```bash
ai-native hooks status
```

**Q: 记忆文件太长了？**

```bash
ai-native sync --force      # 强制全量重蒸馏
```

**Q: 想关闭某些功能？**

```toml
# .ai-native/config.toml
[hooks]
enabled = false              # 关闭 hooks

[sdd]
enforced = false             # 关闭 SDD 门禁
```
