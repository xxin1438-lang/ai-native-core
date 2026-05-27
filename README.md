# AI Native Core

**让 AI 自动遵守项目规范。不是模板仓库，是可安装的运行时框架。**

[中文](./README.md) | [English](./README.en.md)

---

## 是什么

配置驱动、适配器模式、跨技术栈的 AI Native 开发框架。

- **资产记忆引擎**：项目文档 → LLM 蒸馏 → 记忆因子 → AI 每次会话自动加载
- **SDD 门禁**：explore → propose → confirm → apply，不可跳步
- **双轨验证**：代码行为 + 视觉渲染
- **自迭代 hooks**：范式变更检测 + 踩坑复盘
- **验收自动化**：YAML 配置 → 一键执行 → 结构化报告
- **多角色**：产品 / 前端 / 后端 / 测试

## 为什么

**AI 不知道你的项目规范，每次都要重复解释。**

| 没有 ai-native | 有 ai-native |
|---------------|-------------|
| AI 把业务逻辑写在 Controller 里 | AI 自动看到"禁止 Controller 直连数据库"，不会那么写 |
| CR 反复指出同样的问题 | forbidden-patterns 一次蒸馏，永久生效 |
| 新人读 20 份文档才敢写代码 | `init && sync`，AI 带着规范写 |
| 规范改了口口相传 | 改文档 → `sync` → 全员 AI 自动更新 |
| 验收手动跑 6 个命令 | `ai-native accept` 一条命令 |

**三个场景**：

| 场景 | 你做什么 | 效果 |
|------|---------|------|
| 日常开发 | 什么都不做 | AI 自动加载记忆因子 |
| 规范变更 | 改架构文档 → `ai-native sync` | AI 下个会话自动遵守 |
| 提交前 | `ai-native accept` | 一键跑完检查 |

## 怎么用

```bash
npm install -g ai-native-core
cd your-project
ai-native                  # 一键启动
ai-native hooks install    # hooks
ai-native accept           # 验收
```

**技术栈**：`react-spa` `nextjs` `vue` `backend-java` `backend-node` `backend-go` `backend-python`

**角色入口**：[各角色手册](./docs/role-quickstart.md)

| 角色 | 第一句话 |
|------|---------|
| PM | `review PRD` |
| 前端 | `/ai-native init` |
| 后端 | `/ai-native init` |
| 测试 | `/ai-native accept` |

**文档**：[快速上手](./docs/quickstart.md) · [角色手册](./docs/role-quickstart.md) · [Git 指南](./docs/git-guide.md) · [架构](./docs/design/architecture.md)


