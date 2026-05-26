# 各角色使用手册

[中文](./role-quickstart.md) | [English](./role-quickstart.en.md)

打开 AI，按角色说第一句话。

---

## 产品经理

**不需要装任何东西。**

| 场景 | 对 AI 说 |
|------|---------|
| 检查 PRD | `review docs/prd/xxx.md，检查完整性和缺失的验收标准` |
| PRD→Spec | `基于 docs/prd/xxx.md 帮我生成 OpenSpec proposal` |
| 看计划 | `读取 openspec/changes/xxx/design.md，只看骨架图` |
| 确认 | `骨架图流程没问题，可以开始` |

---

## 前端开发

**第一句话**：`/ai-native init`（一次性，AI 自动检测 React/Vue/Next.js）

| 场景 | 对 AI 说 |
|------|---------|
| 初始化 | `/ai-native init` |
| 探索需求 | `/opsx:explore` |
| 生成 spec | `/opsx:propose` |
| 实施 | `/opsx:apply` |
| 归档 | `/opsx:archive` |
| 查看约束 | `/ai-native show` |
| 验收 | `/ai-native accept` |

---

## 后端开发

**第一句话**：`/ai-native init`（AI 自动检测 pom.xml→Java / go.mod→Go）

| 场景 | 对 AI 说 |
|------|---------|
| 初始化 | `/ai-native init` |
| 探索需求 | `/opsx:explore` |
| 生成 spec | `/opsx:propose` |
| 实施 | `/opsx:apply` |
| 归档 | `/opsx:archive` |
| 验收 | `/ai-native accept` |
| 审查 migration | `检查这个 Flyway 脚本安全性` |

---

## 测试/QA

**第一句话**：`/ai-native accept`

| 场景 | 对 AI 说 |
|------|---------|
| 验收 | `/ai-native accept` |
| 写 E2E | `基于 design.md 生成 Playwright spec` |
| 视觉走查 | `chrome MCP 打开 localhost:5173 截图` |

---

## 一句话

| 角色 | 第一句话 |
|------|---------|
| PM | `review PRD` |
| 前端 | `/ai-native init` |
| 后端 | `/ai-native init` |
| 测试 | `/ai-native accept` |
