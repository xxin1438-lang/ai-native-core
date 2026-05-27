# AI Native Skill Catalog

Skills by role. ✅ Built-in, 🔧 Plugin (recommended), 📋 Planned.

---

## Product Manager (PM)

| Skill | Status | Use |
|-------|--------|-----|
| PRD Review | 📋 | Check PRD completeness: scenarios → edge cases → acceptance → non-functional |
| PRD → Spec | 📋 | Auto-generate OpenSpec proposal from PRD |
| Design Review | 📋 | Review wireframe, flag missing states (empty/loading/error) |
| Figma → Constraints | 📋 | Extract design constraints from Figma |

## Frontend

| Skill | Status | Use |
|-------|--------|-----|
| sync-asset-memory | ✅ | `ai-native sync` |
| studybook-review | ✅ | Pitfall review |
| SDD propose/apply | 🔧 | OpenSpec plugin |
| UI component gen | 🔧 | frontend-design plugin |
| E2E dual-track | 🔧 | chrome-mcp + playwright-mcp |
| CSS Token check | 📋 | Check hardcoded colors, hsl double-wrap |

## Backend

| Skill | Status | Use |
|-------|--------|-----|
| sync-asset-memory | ✅ | Same |
| studybook-review | ✅ | Same |
| SDD propose/apply | 🔧 | OpenSpec |
| API contract gen | 📋 | Auto-generate OpenAPI from Controllers |
| Migration review | 📋 | Check Flyway/Liquibase safety |
| SQL perf analysis | 📋 | N+1, missing indexes, SELECT * |
| Security scan | 📋 | Hardcoded keys, missing auth guards |

## QA / Test

| Skill | Status | Use |
|-------|--------|-----|
| acceptance | ✅ | `ai-native accept` |
| E2E spec gen | 📋 | Generate Playwright spec from PRD |
| Visual regression | 🔧 | chrome-mcp screenshot diff |
| Boundary test gen | 📋 | Generate boundary test cases from API contracts |

## Priority

| Priority | Skill | Role | Why |
|----------|-------|------|-----|
| P0 | OpenSpec (opsx) | All | SDD gate |
| P0 | chrome-mcp | Frontend/QA | Visual verification |
| P1 | frontend-design | Frontend | UI generation |
| P1 | PRD Review | PM | Reduce communication cost |
| P2 | API contract gen | Backend | Documentation automation |
| P2 | E2E spec gen | QA | Reduce test writing cost |
