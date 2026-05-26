# AI Native Core

**让任何项目拥有 AI Native 开发能力——不是另一个模板仓库，而是一个可安装的运行时框架。**

[中文](./README.md) | [English](./README.en.md)

---

## 这是什么

配置驱动、适配器模式、跨技术栈的 AI Native 开发框架。核心能力：

- **资产记忆引擎**：项目文档 → LLM 蒸馏 → 紧凑约束因子 → AI 每次会话自动加载
- **SDD 门禁**：explore → propose → confirm → apply，不可跳步
- **双轨验证**：代码行为（Playwright）+ 视觉渲染（chrome MCP）
- **自迭代 hooks**：自动检测范式变更、提醒踩坑复盘、驱动记忆更新
- **验收自动化**：YAML 配置 → 自动执行 → 结构化报告
- **多角色支持**：产品 / 前端 / 后端 / 测试，各有入口

## 快速开始

```bash
npm install -g ai-native-core
cd your-project
ai-native init                  # 交互式问答，或 --stack react-spa
ai-native sync && ai-native hooks install && ai-native accept
```

## 支持的技术栈

| 类型 | 适配器 |
|------|--------|
| 前端 | `react-spa` `nextjs` `vue` |
| 后端 | `backend-java` `backend-go` `backend-python` |
| 多栈 | 逗号分隔：`react-spa,backend-java` |

## 团队角色

| 角色 | 需要做什么 | 推荐 Skill |
|------|-----------|-----------|
| 产品经理 | 写 PRD → review 骨架图 | PRD Review |
| 前端开发 | init → sync → propose → apply → accept | OpenSpec + chrome-mcp |
| 后端开发 | 同上 | OpenSpec + API 契约生成 |
| 测试/QA | accept → E2E 双轨 → 报告 | chrome-mcp |

## 文档

| 文档 | 说明 |
|------|------|
| [使用指南](./docs/user-guide.md) | 按角色组织的完整使用手册 |
| [架构设计](./docs/design/architecture.md) | 五层架构详解 |
| [Skill 目录](./docs/design/skills-catalog.md) | 各角色推荐 Skill |
| [产品协作](./docs/design/product-collaboration.md) | PM 如何参与 |
| [基座保护](./docs/design/base-integrity.md) | 框架完整性保障 |
| [项目自检测](./docs/design/project-detection.md) | 自动检测语言版本 |

## 设计原则

1. **配置 > 代码** — 项目差异通过配置表达
2. **适配器隔离** — 技术栈差异封装在适配器中
3. **渐进式采用** — 可只用记忆蒸馏，再逐步接入 SDD
4. **LLM 无关** — 不绑定特定 AI 模型
5. **可见即可审计** — 所有生成物是人类可读文本

## 版本

`v0.2.x` — CLI 可用（init / sync / accept / hooks），蒸馏引擎为骨架实现。
