# Product Collaboration Mode

How product managers (PMs) can participate in the AI-native workflow.

---

## Current Capabilities

### PRD as Distillation Source

PM writes PRD in `docs/prd/`, sync automatically includes it:

```yaml
# MANIFEST.yaml new factor
- name: product-context
  description: Product requirements
  source_globs: ["docs/prd/**/*.md"]
  max_items: 10
  priority: critical
  output_file: "product-context.md"
```

### PRD → OpenSpec Bridge

PM writes PRD → dev says "propose based on PRD" → AI generates spec → PM reviews wireframe → confirm → apply.

## Minimal Workflow

```
PM               Developer           AI
 │                   │                │
 │ Write PRD.md      │                │
 │── docs/prd/ ─────→│                │
 │                   │ ai-native sync │
 │                   │───────────────→│ Distill product constraints
 │                   │ /opsx:propose  │
 │                   │───────────────→│ Generate spec from PRD
 │←─ design.md ─────│←───────────────│
 │ Confirm flow ✓    │                │
 │──────────────────→│ /opsx:apply    │
 │                   │───────────────→│ Implement
```

## PM Roles

```bash
ai-native init --role pm
```

Generates only PM-needed files:

```
.ai-native/
└── pm-config.toml     # prd_path, product-context factor only
```

## Future Extensions

| Capability | Description |
|-----------|-------------|
| PRD Review | Check PRD completeness: scenarios → edge cases → acceptance → non-functional |
| Figma → Constraints | Auto-extract design constraints from Figma |
| Meeting Notes → PRD | Transcribe meeting decisions into PRD |
| Ticket Integration | Linear/Jira → auto-generate spec draft |

## Recommended Skills for PM

| Priority | Skill | Problem Solved |
|----------|-------|----------------|
| P0 | PRD Review | "Is the PRD complete?" |
| P1 | PRD → Spec | "How does PRD become dev tasks?" |
| P1 | Design Review | "Is this flow correct?" (wireframe check) |
| P2 | Figma → Constraints | "Design updated, does dev know?" |
