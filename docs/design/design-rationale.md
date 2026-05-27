# Design Rationale

## Core Insight

AI agents need two types of information in a project:

1. **Session info**: current task context (what the user said, which files are open)
2. **Persistent info**: architecture constraints, design rules, forbidden patterns, known pitfalls

Most AI coding tools only address the first type — every new session, the agent knows nothing about the project. Result: repeated doc reading, repeated mistakes, inconsistent style.

`ai-native-core`'s core idea: **transform persistent info from "docs to read" into "constraints auto-loaded into every prompt"**.

## Problem → Solution

### Problem 1: AI starts from zero every session

**Manifestation**: Agent doesn't know which framework, component library, or coding conventions the project uses. Needs to read README, design docs, style guides from scratch.

**Solution**: Asset memory distillation. Key docs are distilled into ≤100-line compact factor files, auto-injected into the agent's system prompt every session via CLAUDE.md.

### Problem 2: Memory factors coupled to specific project

**Manifestation**: Each project needs different factors — frontend needs design constraints, backend needs API contracts, CLI projects need neither.

**Solution**: MANIFEST.yaml declarative definition. Factor types, source paths, distill prompts all configurable. The framework doesn't prescribe "which factors exist".

### Problem 3: Tech stack lock-in

**Manifestation**: Most AI-native solutions (template repos, custom instructions) are framework-specific.

**Solution**: Adapter pattern. `adapters/react-spa/` provides React-specific templates and rules, `adapters/backend-go/` provides Go backend ones. Core engine is stack-agnostic.

### Problem 4: Acceptance relies on reading docs

**Manifestation**: Onboarding acceptance and pre-release checks rely on AI reading markdown checklists — unreliable, inconsistent.

**Solution**: Structured acceptance pipeline. `acceptance.yaml` defines exec/file-exists/visual check types. Framework executes and outputs structured reports.

### Problem 5: Knowledge decay

**Manifestation**: After architecture changes (new state management, new security rules), AI still uses outdated memory factors.

**Solution**: Self-iteration hooks. Commits touching paradigm paths → prompt changelog update + trigger re-distillation.

## Why Five Layers

### Layer 1 (Config): Why first?

Because it's the only variable part. Framework code is constant; project differences are expressed in this layer. A single `config.toml` switches React → Vue → Go with adapter selection.

### Layer 2 (Memory): Why distillation over full-text indexing?

Full-text search (RAG) returns raw chunks — the agent still needs to extract constraints. Distillation does one "constraint extraction" pass. The source says "don't call toast() from components"; the distilled result IS that rule. No source re-reading needed.

### Layer 3 (SDD): Why enforce propose→apply?

Skipping spec and writing code isn't immediately wrong — the agent might write technically correct but architecturally wrong implementations. SDD gate forces a structured design confirmation before implementation.

### Layer 4 (Self-iteration): Why hooks over manual triggers?

Manual dilemma: remember to update → too busy → forget → stale memory → AI makes errors. Hooks make paradigm change detection and pitfall review passive — no one needs to remember.

### Layer 5 (Acceptance): Why structured config over checklist?

Markdown checklist problem: AI needs "understand text → decide what to do → execute". Structured config: AI only needs "parse YAML → execute by type". No semantic parsing middleman. Results machine-parsable and cross-project comparable.

## What We Don't Do

- **CI/CD pipeline**: framework defines acceptance checks, CI platform is project's choice
- **Deployment**: not binding to any deployment target
- **Monitoring**: operational, outside AI workflow
- **UI components**: no component library; adapters declare "which library"
- **Demo pages**: framework provides onboarding structure, not demo content
- **Code generation templates**: framework only distills constraints, doesn't generate business code

## vs RAG / Vector DB

| | RAG | ai-native-core |
|---|-----|---------------|
| Storage | Vector DB (raw chunks) | Markdown files (distilled factors) |
| Knowledge form | Raw snippets | Refined constraints |
| Agent consumption | Retrieve → read original | Already in system prompt |
| Update | Re-index | Re-distill (change-detected) |
| Human-readable | No (vectors) | Yes (Markdown, auditable) |
| Constraint strength | Weak (suggestive) | Strong (system prompt, directly affects behavior) |

Core difference: RAG solves "find relevant docs". ai-native-core solves "no need to search — constraints are already in the prompt".
