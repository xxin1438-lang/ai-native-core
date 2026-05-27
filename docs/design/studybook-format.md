# StudyBook Format

Pitfall review record format and sub-agent workflow.

---

## File Naming

```
docs/decisions/YYYY-MM-DD-NN-topic.md
```

| Part | Format | Example |
|------|--------|---------|
| YYYY-MM-DD | Date | 2026-05-25 |
| NN | Daily sequence (01-99) | 01 |
| topic | Hyphenated topic | profile-redesign |

Example: `docs/decisions/2026-05-25-01-profile-redesign.md`

## Content Format

```markdown
# Title

**Date**: YYYY-MM-DD
**Topic**: <topic tag>
**Commit range**: <start>..<end> (optional)

## Context

<1-2 sentence work description>

## Pitfalls

### Pitfall 1: <symptom>

- **Root cause**: <why it happened>
- **Fix**: <how to solve/avoid>
- **Affected**: <files/modules>

### Pitfall 2: ...

## Takeaways

- <generalizable lesson>
- <should add to forbidden-patterns>
- <should add to known-pitfalls>

## File Changes

- Added: path
- Modified: path
```

## Sub-agent Workflow

```
1. Read git diff (uncommitted or latest commit)
2. Infer topic from diff content
3. Extract "pitfall signals":
   - Reverted code (same area modified 3+ times)
   - Comments: TODO/FIXME/HACK
   - Config changes (build files, ESLint, TS config)
   - New guard code (if (!x) return, assert)
4. Generate StudyBook entry from template
5. Write to docs/decisions/YYYY-MM-DD-NN-topic.md
6. Prompt: "Run ai-native sync to distill into known-pitfalls"
```

### Pitfall Signal Detection

| Diff signal | Possible meaning |
|-------------|------------------|
| Same line modified 3+ commits | Design churn, underlying pitfall |
| New `as` type assertion | Type system mismatch |
| New config file | Toolchain/environment pitfall |
| New error boundary / try-catch | Runtime exception handling |
| Reverted code (add→delete→add) | Solution backtrack |

## Relation to Memory Factors

StudyBook → `ai-native sync` → known-pitfalls.md distillation rules:

- Extract from StudyBook "Takeaways" section
- Transform narrative to constraint format
- Deduplicate against existing known-pitfalls.md
- One StudyBook item → 0-N known-pitfalls entries
