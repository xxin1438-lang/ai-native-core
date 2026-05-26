# AI Native Core Skill

当用户在 AI 工具中调用 `/ai-native <command>` 时，按以下规则执行。

## 命令映射

| 用户输入 | 终端命令 |
|---------|---------|
| `/ai-native init` | `ai-native init` |
| `/ai-native init --stack <name>` | `ai-native init --stack <name>` |
| `/ai-native sync` | `ai-native sync` |
| `/ai-native sync --check` | `ai-native sync --check` |
| `/ai-native sync --force` | `ai-native sync --force` |
| `/ai-native accept` | `ai-native accept` |
| `/ai-native show` | `ai-native show` |
| `/ai-native show <factor>` | `ai-native show <factor>` |
| `/ai-native hooks install` | `ai-native hooks install` |
| `/ai-native hooks status` | `ai-native hooks status` |

## 执行规则

1. 在项目根目录执行（`git rev-parse --show-toplevel`）
2. sync 后读取记忆因子，确认已加载到当前会话
3. accept 后读取验收报告，向用户汇报
4. init 后提示下一步（sync → hooks → accept）
5. 所有命令输出翻译为用户可理解的语言

## 安装

- **Claude Code**: 放入 `.claude/skills/ai-native/SKILL.md`
- **DeepSeek TUI**: 放入 `.deepseek/skills/ai-native/SKILL.md`
- **Cursor**: 放入 `.cursor/rules/` 或 `@ai-native` 激活
- **Codex**: 加入 `.github/copilot-instructions.md`
