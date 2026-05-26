# AI Native Skill 目录

各角色所需 Skill。✅ 框架内置、🔧 推荐安装、📋 计划中。

---

## 产品经理（PM）

| Skill | 状态 | 用途 |
|-------|------|------|
| **PRD Review** | 📋 | 检查 PRD 完整性：用户场景→异常流程→验收标准→非功能需求 |
| **PRD → Spec 桥接** | 📋 | 基于 PRD.md 自动生成 OpenSpec proposal |
| **Design Review** | 📋 | 审查骨架图，标记缺失交互状态（空态/加载/错误） |
| **Figma → 约束提取** | 📋 | 读 Figma 稿，提取设计约束写入记忆因子 |

> PM 最核心：**PRD Review** — 让 AI 检查 PRD 写没写全，减少来回沟通。

---

## 前端开发

| Skill | 状态 | 用途 |
|-------|------|------|
| sync-asset-memory | ✅ | `ai-native sync` 蒸馏记忆因子 |
| studybook-review | ✅ | 踩坑复盘 |
| SDD propose/apply | 🔧 | OpenSpec 插件 |
| UI 组件生成 | 🔧 | frontend-design 插件 |
| E2E 双轨走查 | 🔧 | chrome-mcp + playwright-mcp |
| CSS Token 校验 | 📋 | 检查硬编码颜色、hsl 双重包裹 |

---

## 后端开发

| Skill | 状态 | 用途 |
|-------|------|------|
| sync-asset-memory | ✅ | 同上 |
| studybook-review | ✅ | 同上 |
| SDD propose/apply | 🔧 | 同上 |
| API 契约生成 | 📋 | 基于 Controller 生成 OpenAPI spec |
| Migration 审查 | 📋 | 检查 Flyway/Liquibase 脚本安全性 |
| SQL 性能分析 | 📋 | N+1、索引缺失、SELECT * |
| 安全扫描 | 📋 | 硬编码密钥、缺失认证守卫 |

---

## 测试 / QA

| Skill | 状态 | 用途 |
|-------|------|------|
| acceptance | ✅ | `ai-native accept` 结构化验收报告 |
| E2E Spec 生成 | 📋 | 基于 PRD 自动生成 Playwright spec |
| 视觉回归 | 🔧 | chrome-mcp 截图对比 |
| 边界值测试 | 📋 | 基于 API 契约生成边界测试用例 |

---

## 推荐安装优先级

| 优先级 | Skill | 角色 | 理由 |
|--------|-------|------|------|
| P0 | OpenSpec | 全部 | SDD 门禁基础 |
| P0 | chrome-mcp | 前端/测试 | 视觉验证 |
| P1 | frontend-design | 前端 | UI 生成 |
| P1 | PRD Review | PM | 减少沟通成本 |
| P2 | API 契约生成 | 后端 | 文档自动化 |
| P2 | E2E Spec 生成 | 测试 | 减少编写成本 |
