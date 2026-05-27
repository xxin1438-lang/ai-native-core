# Optimization Roadmap

✅ done, ⚠️ partial, ❌ missing.

---

## P0 — Tests

❌ Zero tests. Core modules need coverage: config parsing, project detection, adapter loading.

## P0 — Real Distillation in CLI

⚠️ Skill describes it, CLI doesn't do it yet. Implement sync --prepare + --finalize.

## P1 — Post-sync Quality Feedback

❌ sync shows counts but doesn't flag issues. Check: empty factors, duplicate items, too-generic constraints.

## P1 — Empty Docs Warning

❌ sync runs even if source_globs match nothing. Warn user: "No source files found for forbidden-patterns. Create project docs first."

## P2 — CI/CD

❌ Manual publish only. Add GitHub Actions: test on push, publish on tag.

## P2 — Adapter Detection Enhancement

⚠️ Missing: Gradle (build.gradle.kts), NestJS, FastAPI auto-detect.

## P3 — Template Marketplace

Community adapter sharing.

---

**Right now**: `/ai-native sync` in chat — AI distills using updated skill, no code changes needed.
