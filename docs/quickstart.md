# 当前使用手册（v0.2.x）

---

## 新项目 3 步

```bash
cd your-project
ai-native                  # 一键启动（检测→确认→init→sync→显示约束）
ai-native hooks install    # 安装自迭代 hooks
ai-native accept           # 验收
```

自动检测不准？手动指定：

```bash
ai-native init --stack backend-java && ai-native sync
```

## 日常

```bash
git pull && ai-native sync --check    # 检查记忆是否过期
ai-native show                        # 查看 AI 知道了什么
ai-native show forbidden-patterns     # 查看具体因子
ai-native accept                      # 提交前验收
```

## 当前 sync 实际做了什么

```
ai-native sync
  → 写入适配器内置规则 → forbidden-patterns.md
  → 写入其他 4 个因子（占位）
  → template copy-back
  → 显示摘要
```

**内置规则已生效**。AI 每次会话自动看到 18-32 条架构约束。

## 在 AI 工具中使用

CLI 命令在终端执行，与 AI 工具无关。sync 自动生成入口文件：

| AI 工具 | 入口文件 | 加载方式 |
|---------|---------|---------|
| **Claude Code** | `.claude/CLAUDE.md` | 自动（`@memory/` 引用） |
| **Cursor** | `.cursor/rules/ai-native.md` | 自动 |
| **Copilot** | `.github/copilot-instructions.md` | 自动 |
| **DeepSeek TUI** | `.deepseek/rules/ai-native.md` | sync 自动生成 |
| **Codex (OpenAI)** | `.codex/rules/ai-native.md` | sync 自动生成 |

### 配置引擎

config.toml 中声明即可：

```toml
[ai_tools]
engines = ["claude", "cursor", "deepseek", "codex"]   # 或 "all"
```

sync 自动为每个引擎生成入口文件。

## 蒸馏引擎就绪后的变化

```bash
ai-native sync              # 准备蒸馏任务
# → AI 自动蒸馏
ai-native sync --finalize   # 合并内置规则 + 蒸馏结果
```
