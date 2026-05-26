# 便捷性改进路线图

降低使用门槛的改进方向，按投入产出比排序。

---

## P0 — 一键启动

**现状**：`init → sync → hooks install → accept`，4 步。

**改进**：`ai-native` 无参数全自动：

```
检测项目 → (已 init? → 直接 sync : 交互确认 → init + sync)
```

对新手只需记住一个命令。

---

## P0 — sync 结果可视化

**现状**：sync 后生成 markdown，用户不知道 AI 学到了什么。

**改进**：

```bash
ai-native sync

✓ forbidden-patterns (18 条)
  1. 禁止 Controller 直连数据库
  2. 禁止跳过 spec 直接写代码
  ...
→ AI 下个会话自动约束
```

新增 `ai-native show <factor>` 随时查看某个因子。

---

## P1 — Chat 式配置

**现状**：单选问答（"后端语言? java/go/python"）。

**改进**：自然语言描述项目：

```bash
ai-native

🤖 请描述你的项目：

> Java 后端，Spring Boot 3，Maven，PostgreSQL

🤖 检测到: Java 17 + Spring Boot 3.2 + Maven → backend-java
   确认? [Y/n]
```

零概念门槛——用户不需要知道"适配器"是什么。

---

## P1 — 零配置检测增强

自动扫描 `pom.xml` / `package.json` / `go.mod` → 给出推荐 → 按回车确认。

---

## P2 — 模板市场

```bash
ai-native template list          # 社区模板
ai-native template install xxx   # 安装
```

降低"框架没内置我公司技术栈"的障碍。

---

## P3 — VS Code 插件

侧边栏面板：记忆因子查看、验收状态、一键 sync。非技术人员可用 GUI。

---

## 优先级总览

| 优先级 | 改进 | 投入 | 收益 |
|--------|------|------|------|
| P0 | 一键启动 | 小 | 极大 |
| P0 | sync 可视化 | 小 | 大 |
| P1 | Chat 配置 | 中 | 大 |
| P1 | 零配置检测 | 中 | 大 |
| P2 | 模板市场 | 大 | 中 |
| P3 | VS Code 插件 | 大 | 中 |

最简实现：P0 两步，不到 50 行代码。
