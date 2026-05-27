# AI Native Core Architecture

## Design Goal

Build a stack-agnostic AI-native runtime framework. Decouple tech stack, design system, component library, E2E, forbidden patterns, CI/CD from the framework.

## Five-Layer Architecture

```
Layer 5  Acceptance (Structured Pipeline)
         acceptance.yaml → executor → report
         env → lint → typecheck → test → e2e → visual

Layer 4  Self-Iteration (Hooks Engine)
         Stop hook → studybook reminder → skill → commit
         Commit hook → paradigm detection → self-update → sync

Layer 3  SDD Gate (Spec-Driven Development)
         explore → propose → design.md → confirm → apply

Layer 2  Asset Memory (Distiller)
         MANIFEST.yaml → read sources → LLM distill → memory files

Layer 1  Config Layer
         config.toml + adapters/{stack}/
```

### Layer 1 — Config Layer

Foundation. All upper layers determined by config + adapters.

**config.toml** defines: project type, tech stack, source paths, AI tools, hooks, SDD.

**Adapters** encapsulate stack differences: immutable-rules.md (built-in forbidden patterns), manifest-overrides.yaml (source_globs), acceptance-overrides.yaml (commands).

### Layer 2 — Asset Memory

Core innovation: distill project knowledge into compact AI-consumable factors.

**Distiller** pipeline:
1. Read MANIFEST.yaml → get factor definitions
2. Collect source files via source_globs
3. Compare hash with SYNC-STATE.md
4. Changed factors → call LLM → write memory files

**Three-level memory**: org (git-distributed) → project (.ai-native/memory/) → personal (~/.ai-native/)

### Layer 3 — SDD Gate

explore (optional) → propose → design.md (ASCII wireframe) → confirm → apply

Tool-agnostic: works with OpenSpec, Linear, or custom SDD tools.

### Layer 4 — Self-Iteration

**Hook A**: Studybook reminder (Stop event) — git dirty + cooldown → "y/n?"
**Hook B**: Paradigm detection (Commit event) — detect paradigm paths → suggest sync

### Layer 5 — Acceptance

Environment → code quality → E2E (dual-track) → build → structured report.

## Decoupling

| Dimension | Method |
|-----------|--------|
| Tech stack | Adapter pattern |
| Design system | Project's own design/ directory |
| Forbidden patterns | Adapter built-in + project custom |
| CI/CD | Custom acceptance.yaml commands |
| Hook paths | config.toml paradigm.watch_paths |

## Progressive Adoption

Phase 1: `init → sync` (asset memory only)
Phase 2: `acceptance.yaml → accept` (quality gate)
Phase 3: `hooks install` (self-iteration)
Phase 4: `propose → apply` (full SDD)
