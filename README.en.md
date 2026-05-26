# AI Native Core

**Give any project AI-native capabilities — not another template repo, a runnable framework.**

[中文](./README.md) | [English](./README.en.md)

---

## What

A config-driven, adapter-pattern, stack-agnostic AI-native development framework.

- **Asset Memory Engine**: project docs → LLM distillation → compact constraint factors → auto-loaded every AI session
- **SDD Gate**: explore → propose → confirm → apply, no skipping
- **Dual-track Verification**: code behavior (Playwright) + visual rendering (chrome MCP)
- **Self-iteration Hooks**: auto-detect paradigm changes, prompt pitfall reviews
- **Acceptance Automation**: YAML config → auto-execute → structured report
- **Multi-role**: PM / Frontend / Backend / QA, each has an entry point

## Quick Start

```bash
npm install -g ai-native-core
cd your-project
ai-native init                  # interactive, or --stack react-spa
ai-native sync && ai-native hooks install && ai-native accept
```

## Supported Stacks

| Type | Adapter |
|------|---------|
| Frontend | `react-spa` `nextjs` `vue` |
| Backend | `backend-java` `backend-go` `backend-python` |
| Multi | comma-separated: `react-spa,backend-java` |

## Team Roles

| Role | Needs | Recommended Skill |
|------|-------|-------------------|
| PM | Write PRD → review wireframe | PRD Review |
| Frontend | init → sync → propose → apply → accept | OpenSpec + chrome-mcp |
| Backend | same as above | OpenSpec + API contract gen |
| QA | accept → E2E dual-track → report | chrome-mcp |

## Docs

| Doc | Description |
|-----|-------------|
| [User Guide](./docs/user-guide.md) | Role-based manual (Chinese) |
| [Architecture](./docs/design/architecture.md) | 5-layer design (Chinese) |
| [Skill Catalog](./docs/design/skills-catalog.md) | Recommended skills by role (Chinese) |
| [Product Collab](./docs/design/product-collaboration.md) | PM collaboration mode (Chinese) |

## Principles

1. **Config > Code**
2. **Adapter Isolation**
3. **Progressive Adoption**
4. **LLM Agnostic**
5. **Auditable by Reading**

## Version

`v0.2.x` — CLI functional (init / sync / accept / hooks).
