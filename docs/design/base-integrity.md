# Base Integrity Protection

File classification and protection mechanisms preventing accidental base modification.

---

## File Classification

### Framework Base (read-only)

Installed via npm, outside project directory.

| File | Location | Updated via |
|------|----------|-------------|
| Adapter immutable-rules | npm global package | Framework version upgrade |
| Distiller engine | npm global package CLI | Framework version upgrade |
| Hook script templates | npm global package | Framework version upgrade |

### Project Config (editable, git-review protected)

| File | Edited by | Protection |
|------|-----------|------------|
| `.ai-native/config.toml` | Project owner | PR review |
| `.ai-native/acceptance.yaml` | Project owner | PR review |
| `.ai-native/memory/MANIFEST.yaml` | Project owner | PR review |
| `docs/decisions/*.md` | AI (authorized) | PR review |

### Local Generated (gitignored, overwritten by sync)

| File | Generator | Git |
|------|-----------|-----|
| `.ai-native/memory/*.md` | `ai-native sync` | ❌ gitignored |
| `.ai-native/reports/*.md` | `ai-native accept` | ❌ gitignored |
| `.ai-native/hooks/*.sh` | `ai-native hooks install` | ❌ gitignored |

### Template Sync (committed, overwritten by sync)

| File | Generator | When overwritten |
|------|-----------|------------------|
| `docs/.ai-native/memory/*.md` | `ai-native sync` copy-back | Each sync |
| `.claude/CLAUDE.md` | `ai-native sync` | Sync check |

## Five-Layer Protection

### ① Framework files not in project directory

```
npm install -g ai-native-core
→ installed in /usr/local/lib/node_modules/ai-native-core/
→ project has only .ai-native/config files
→ team members cannot touch adapter rules
```

### ② Adapter rules loaded from npm package

Distiller at runtime:
```
1. Read .ai-native/config.toml → adapter = "react-spa"
2. Load adapters/react-spa/immutable-rules.md from npm package
3. Load project docs via source_globs
4. Merge → write memory factors
```

### ③ Config files PR-reviewed

config.toml / acceptance.yaml / MANIFEST.yaml committed to git. Changes require PR review.

### ④ Generated files overwritten by sync

Manual edits to `.ai-native/memory/`:
- Already gitignored
- Next `ai-native sync` overwrites fully

### ⑤ Sync never overwrites project config

`ai-native sync` only touches:
- `.ai-native/memory/*.md`
- `docs/.ai-native/memory/*.md`
- `.claude/CLAUDE.md`

**Never overwrites**: config.toml / acceptance.yaml / MANIFEST.yaml / project docs.

## .gitignore

```gitignore
.ai-native/memory/
.ai-native/reports/
.ai-native/hooks/
!.ai-native/config.toml
!.ai-native/acceptance.yaml
!.ai-native/memory/MANIFEST.yaml
```

## Conclusion

**No one can modify ai-native-core's base by committing code.** Framework files are in the npm package, adapter rules loaded from npm, project config PR-protected, generated files gitignored.
