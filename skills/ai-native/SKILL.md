---
name: ai-native
description: AI Native Core 全流程——直接在对话中初始化/蒸馏/验收。用户说 /ai-native init/sync/accept/show 时自动执行。
metadata:
  short-description: AI-native init/sync/accept from chat
---

# AI Native Core

在对话中直接完成，**不切终端**。

## /ai-native init

1. `git rev-parse --show-toplevel` 获取项目根
2. 扫描 `pom.xml`/`package.json`/`go.mod`/`pyproject.toml` 检测语言和版本
3. 向用户确认检测结果（或让用户选择）
4. 创建 `.ai-native/memory/`、`.ai-native/hooks/`、`docs/decisions/` 等目录
5. 生成 `.ai-native/config.toml`（adapter/type/pm/test 按检测结果填写）
6. 复制 `acceptance.yaml`、`MANIFEST.yaml` 模板
7. 创建 `docs/self-update.md`

适配器映射：pom.xml→backend-java(maven)、package.json+react→react-spa、go.mod→backend-go

## /ai-native sync

1. 读 `.ai-native/memory/MANIFEST.yaml`
2. 加载 `adapters/{stack}/immutable-rules.md` 内置规则
3. 为每个因子写入内容到 `.ai-native/memory/*.md`（含 YAML frontmatter：name/description/metadata）
4. 写入 `SYNC-STATE.md`
5. 同步 `docs/.ai-native/memory/`
6. 生成 `.claude/CLAUDE.md`、`.cursor/rules/ai-native.md`、`.deepseek/rules/ai-native.md`
7. 展示摘要（每个因子的条数和前 3 条）

## /ai-native accept

1. 环境检查：node/git/.ai-native/memory/SYNC-STATE.md
2. SDD 检查：openspec/changes/ 目录
3. 代码质量：lint/typecheck/test
4. E2E：e2e + 视觉走查
5. 构建：build
6. 输出报告到 `.ai-native/reports/`

## /ai-native show [factor]

列记忆因子或显示具体因子内容。

## /ai-native hooks install

生成 studybook-reminder.sh + paradigm-change-monitor.sh 到 `.ai-native/hooks/`，更新 `.claude/settings.json`。
