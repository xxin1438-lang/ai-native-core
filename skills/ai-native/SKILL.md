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

1. Read MANIFEST.yaml
2. Load adapter immutable-rules
3. Write memory factors to .ai-native/memory/
4. Generate AI tool configs (.claude/, .cursor/, .deepseek/)

## /ai-native accept

Env → SDD → code quality → E2E → build → report

## /ai-native show [factor]

List or view memory factors.

## /ai-native hooks install

Generate hooks and update settings.json.
