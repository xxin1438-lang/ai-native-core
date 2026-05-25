# AI Native Core

**让任何项目拥有 AI Native 开发能力——不是另一个模板仓库，而是一个可安装的运行时框架。**

---

## 这是什么

`ai-native-core` 是一个配置驱动、适配器模式、跨技术栈的 AI Native 开发框架。它把 AI Agent 在项目中高效工作所需的全部能力——资产记忆、SDD 门禁、双轨验证、自迭代 hooks、验收自动化——打包为一个可安装的运行时。

核心理念：**AI Agent 不应该每次都重新阅读几十份项目文档。项目知识应该被蒸馏为紧凑的记忆因子，自动加载到每次会话中。**

核心职责：

- **资产记忆引擎**：从项目文档蒸馏出高信号约束因子，让 AI Agent 每次会话自动加载
- **SDD 门禁系统**：强制 spec-before-code 流程，不可跳步
- **双轨验证管道**：代码行为验证 + 视觉渲染验证，两者不可互替
- **自迭代 hooks**：自动检测范式变更、提醒踩坑复盘、驱动记忆更新
- **验收自动化**：结构化验收配置，AI 按管道执行并输出报告

## 快速开始

```bash
# 安装
npm install -g ai-native-core

# 在目标项目中初始化
cd my-project
ai-native init --stack react-spa    # 选择适配器

# 编辑配置文件
vim .ai-native/config.toml           # 项目元信息
vim .ai-native/memory/MANIFEST.yaml  # 记忆因子定义
vim .ai-native/acceptance.yaml       # 验收管道

# 首次蒸馏资产记忆
ai-native sync

# 运行验收
ai-native accept
```

## 核心能力一览

| 能力 | 实现方式 |
|------|---------|
| 记忆因子 | MANIFEST.yaml 声明式驱动，可增减/自定义 |
| 技术栈 | 适配器模式，支持 React / Vue / Next.js / Go / Python |
| 配置方式 | TOML/YAML 单一配置入口 |
| AI 工具 | 同时生成 Claude / Cursor / Copilot 配置 |
| 蒸馏方式 | 蒸馏引擎自动执行（源文件 → LLM 蒸馏 → 因子文件） |
| 项目类型 | 前端 / 后端 / CLI / 全栈 |
| 安装方式 | npm install -g 可执行 CLI |
| 验收 | YAML 配置 → 自动执行 → 结构化报告 |
| 记忆共享 | 组织 / 项目 / 个人三层记忆模型 |
| 路径约定 | 完全配置驱动，无硬编码 |

## 五层架构

```
┌─────────────────────────────────────────────┐
│ Layer 5  验收层（acceptance.yaml pipeline）   │
│          env → lint → typecheck →            │
│          test → e2e → visual → build         │
├─────────────────────────────────────────────┤
│ Layer 4  自迭代层（hooks engine）             │
│          踩坑复盘 → 范式检测 → 记忆更新       │
├─────────────────────────────────────────────┤
│ Layer 3  SDD 门禁层（propose → confirm →     │
│          apply，不可跳步）                     │
├─────────────────────────────────────────────┤
│ Layer 2  资产记忆层（memory distiller）       │
│          源文件 → LLM 蒸馏 → 因子文件          │
│          └─ .ai-native/memory/               │
├─────────────────────────────────────────────┤
│ Layer 1  配置驱动层（config + adapters）      │
│          .ai-native/config.toml              │
│          adapters/{react,vue,nextjs,...}     │
└─────────────────────────────────────────────┘
```

## 目录结构

```
ai-native-core/
├── README.md
├── docs/
│   └── design/
│       ├── architecture.md              # 完整架构设计
│       ├── design-rationale.md          # 设计理念与问题分析
│       ├── memory-factor-spec.md        # 记忆因子文件格式 + SYNC-STATE 模板
│       ├── sync-engine-spec.md          # 蒸馏引擎行为规范
│       ├── hooks-implementation-spec.md # Hooks 实现合约
│       ├── acceptance-gate-spec.md      # 验收门禁规范
│       └── studybook-format.md          # 踩坑记录格式
├── config/
│   ├── ai-native.config.toml       # 项目级配置示例
│   ├── memory-manifest.yaml        # 记忆因子 schema
│   └── acceptance.yaml             # 验收管道 schema
├── adapters/                        # 多技术栈适配器
│   ├── react-spa/                   # React SPA（TanStack 生态）
│   ├── nextjs/                      # Next.js 全栈
│   ├── vue/                         # Vue 3 + Vite
│   ├── backend-go/                  # Go 后端服务
│   └── backend-python/              # Python FastAPI
├── src/
│   ├── cli/                         # CLI 入口
│   ├── core/                        # 核心引擎
│   │   ├── distiller.ts             # 蒸馏引擎
│   │   ├── hooks.ts                 # Hook 引擎
│   │   └── acceptance.ts            # 验收执行器
│   └── adapters/                    # 适配器实现
└── templates/                       # 记忆因子模板
```

## 设计原则

1. **配置 > 代码**：项目差异通过配置表达，不修改框架源码
2. **适配器隔离**：技术栈差异封装在适配器中，核心引擎与栈无关
3. **渐进式采用**：可以先只用记忆蒸馏，再逐步接入 SDD、双轨验证
4. **LLM 无关**：框架定义管道，不绑定特定 AI 模型或工具
5. **可见即可审计**：所有自动生成的配置、记忆因子都是人类可读的文本文件

## 状态

当前为设计阶段。

- **使用指南** → `docs/user-guide.md`
- **架构设计** → `docs/design/architecture.md`
