# Git Commit & Review Guide

[中文](./git-guide.md) | [English](./git-guide.en.md)

## Files

| File | Commit | Review |
|------|--------|--------|
| `.ai-native/config.toml` | ✅ | **Required** |
| `.ai-native/acceptance.yaml` | ✅ | **Required** |
| `.ai-native/memory/MANIFEST.yaml` | ✅ | **Required** |
| `docs/.ai-native/memory/*.md` | ✅ | Auto |
| `docs/decisions/*.md` | ✅ | Suggested |
| `.ai-native/custom-rules.md` | ✅ | **Required** |
| `.ai-native/memory/*.md` | ❌ | — |
| `.ai-native/reports/` | ❌ | — |

## .gitignore

```gitignore
.ai-native/memory/
.ai-native/reports/
.ai-native/hooks/
!.ai-native/config.toml
!.ai-native/acceptance.yaml
!.ai-native/memory/MANIFEST.yaml
```

## Review Required

| Change | Reviewer |
|--------|----------|
| Switch adapter | Architect |
| Change engines | Architect |
| Change acceptance | Tech Lead |
| Change source_globs | Tech Lead |
| Add custom-rules | Architect |
