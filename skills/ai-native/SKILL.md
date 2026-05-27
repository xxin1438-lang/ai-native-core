---
name: ai-native
description: AI Native Core — init/sync/accept/show directly in chat
metadata:
  short-description: AI-native init/sync/accept from chat
---

# AI Native Core

Execute all operations directly in chat.

## /ai-native init

1. Get project root via `git rev-parse --show-toplevel`
2. Scan pom.xml/package.json/go.mod/pyproject.toml for language and version
3. Confirm with user
4. Create directories, generate config.toml, copy templates

## /ai-native sync

For each factor in MANIFEST.yaml:

1. Read its `source_globs` — collect matching files from project
2. Read its `builtin_sources` — load adapter immutable-rules
3. Read its `distill_prompt` — use as instructions
4. **Distill**: analyze source files per `distill_prompt`, extract ≤`max_items` constraint items
5. **Merge**: built-in rules (keep all, highest priority) + distilled constraints (supplement)
6. **Write** to `.ai-native/memory/{output_file}` with YAML frontmatter
7. After all factors done: write `SYNC-STATE.md`, generate AI tool configs, show summary

## /ai-native accept

Env → SDD → code quality → E2E → build → report

## /ai-native show [factor]

List or view memory factors.

## /ai-native hooks install

Generate hooks and update settings.json.
