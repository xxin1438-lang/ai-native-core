# Distiller Engine Implementation Plan

## Design Principles

1. **No extra API key required** — reuse current AI agent session's LLM
2. **Three-phase pipeline**: prepare → AI distill → write factors
3. **Built-in rules + distilled results** merged into final output

## Three-Phase Pipeline

```
Phase 1: ai-native sync (prepare)
  → Read MANIFEST.yaml source_globs
  → Compute hashes, skip unchanged factors
  → Generate .ai-native/_distill/{name}.prompt.md
    Contains: distill_prompt + source file content + built-in rules

Phase 2: AI distills
  AI reads prompt.md → distills per instructions → writes {name}.output.md

Phase 3: ai-native sync --finalize
  → Read output.md + builtin_rules → merge
  → Write frontmatter → .ai-native/memory/
  → Quality validation → show summary
```

## Why sync doesn't call LLM directly

- User is already in Claude Code/Cursor/DeepSeek session — LLM is at hand
- No API key configuration burden
- Distillation is reviewable (prompt.md and output.md are human-readable)
- User can edit output.md before finalize (correct AI mistakes)

## Prompt Template

```markdown
# Distill Task: {factor.name}

## Instructions
{factor.distill_prompt}

## Output Format
- One line per item, "- " prefix, ≤{max_items} items, ≤200 chars/item
- Forbidden: "本文档", "以下", "详见", "参考"

## Built-in Rules (do not remove, only supplement)
{builtin_rules}

## Source Files
{source_files}
```

## User Experience

```bash
$ ai-native sync
[ai-native] 5 distill tasks ready → .ai-native/_distill/
→ Ask AI to distill, then run ai-native sync --finalize

# AI distills automatically...
$ ai-native sync --finalize
✓ design-foundation: 14 items (built-in 5 + distilled 9)
━━━ AI now knows ━━━
✓ forbidden-patterns (22 items)
  • DO NOT access DB directly from Controller
  ...
→ Effective next session
```
