# AI Native Core

**AI auto-complies with your project rules. A runnable framework, not a template repo.**

[中文](./README.md) | [English](./README.en.md)

---

## What

Config-driven, adapter-pattern, stack-agnostic AI-native framework.

- **Asset Memory**: docs → distillation → memory factors → auto-loaded every session
- **SDD Gate**: explore → propose → confirm → apply
- **Dual-track Verify**: code + visual
- **Self-iteration**: paradigm detection + pitfall reviews
- **Acceptance**: YAML → one command → report
- **Multi-role**: PM / Frontend / Backend / QA

## Why

**AI doesn't know your rules. You repeat yourself every session.**

| Without | With ai-native |
|---------|---------------|
| AI puts logic in Controller | AI sees "No direct DB from Controller", won't do it |
| Same CR issues every time | forbidden-patterns distilled once, enforced forever |
| New hires read 20 docs | `init && sync`, AI guides with rules |
| Rule changes by word of mouth | Edit docs → `sync` → all agents update |
| 6 commands for acceptance | `ai-native accept` — one command |

**Three scenarios**:

| Scenario | You | Effect |
|----------|-----|--------|
| Daily dev | Nothing | AI auto-loads memory factors |
| Rule change | Edit docs → `ai-native sync` | AI complies next session |
| Pre-commit | `ai-native accept` | One-command check |

## How

```bash
npm install -g ai-native-core
cd your-project
ai-native                  # one-shot
ai-native hooks install    # hooks
ai-native accept           # acceptance
```

**Stacks**: `react-spa` `nextjs` `vue` `backend-java` `backend-go` `backend-python`

**By role**: [Role Quickstart](./docs/role-quickstart.md)

| Role | First words |
|------|------------|
| PM | `review PRD` |
| Frontend | `/ai-native init` |
| Backend | `/ai-native init` |
| QA | `/ai-native accept` |

**Docs**: [Guide](./docs/user-guide.md) · [Arch](./docs/design/architecture.md) · [Skills](./docs/design/skills-catalog.md)


