# Quick Start

[中文](./quickstart.md) | [English](./quickstart.en.md)

---

## New Project

```bash
cd your-project
ai-native                  # one-shot: detect → confirm → init → sync
ai-native hooks install
ai-native accept
```

Manual: `ai-native init --stack backend-java && ai-native sync`

## Daily

```bash
git pull && ai-native sync --check
ai-native show
ai-native accept
```

## Sync

```
→ writes adapter rules → memory factors
→ template copy-back → AI config generation
→ summary display
```

Built-in rules active immediately (18-32 constraints).

## AI Tools

| Tool | File |
|------|------|
| Claude Code | `.claude/CLAUDE.md` |
| Cursor | `.cursor/rules/ai-native.md` |
| DeepSeek TUI | `.deepseek/rules/ai-native.md` |
| Codex | `.codex/rules/ai-native.md` |

```toml
engines = ["all"]   # generate all at once
```
