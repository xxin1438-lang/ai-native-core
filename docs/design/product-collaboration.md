# 产品协作模式

当前 ai-native-core 面向开发者，本文档说明产品经理（PM）如何参与，以及将来如何让工具更简单更高效。

---

## 一、现在就能做的

### PRD 成为蒸馏源

产品把 PRD 放在 `docs/prd/`，sync 自动纳入：

```yaml
# MANIFEST.yaml 新增因子
- name: product-context
  description: 产品需求约束
  source_globs: ["docs/prd/**/*.md"]
  distill_prompt: |
    提取产品需求和用户场景。聚焦"用户要什么"和"不能做什么"。
  max_items: 10
  priority: critical
  output_file: "product-context.md"
```

### PRD → OpenSpec 桥接

PM 写 PRD → 开发者 "基于 PRD 帮我 propose" → AI 生成 spec → PM 看骨架图确认 → apply。

---

## 二、最小协作流

```
PM                   Developer              AI
 │                       │                    │
 │ 写 PRD.md             │                    │
 │─── docs/prd/ ────────→│                    │
 │                       │ ai-native sync     │
 │                       │───────────────────→│ 蒸馏产品约束
 │                       │ /opsx:propose      │
 │                       │───────────────────→│ 基于 PRD 生成 spec
 │←─ design.md 骨架图 ──│←───────────────────│
 │ 确认流程 ✓             │                    │
 │──────────────────────→│ /opsx:apply        │
 │                       │───────────────────→│ 实施
```

---

## 三、将来可扩展（让团队更高效）

### PM 角色模式（v0.3）

```bash
ai-native init --role pm
```

只生成 PM 需要的文件，零技术门槛：

```
.ai-native/
└── pm-config.toml     # 只有 prd_path、product-context 因子
```

### PRD Review Skill（P1 优先级）

PM 最需要的 Skill。AI 检查 PRD 是否完整：

```
PM: "review docs/prd/payment-flow.md"

AI:
  ✓ 用户场景：2 个（注册支付、退款）
  ✗ 异常流程：缺少"支付超时"场景
  ✗ 验收标准：缺少"金额小数点精度"说明
  ✗ 非功能需求：未提及并发量
  ⚠ 边界条件：未定义最小/最大金额

建议补充：异常流程 2 个，验收标准 3 条，非功能需求 1 条。
```

### Figma → Design Foundation（v0.3）

```
设计师更新 Figma → Hook 检测变更
                → AI 读 Figma → 提取设计约束 → 写入 design-foundation.md
                → 开发者 sync → 自动纳入
```

### PRD 版本追踪

```
docs/prd/payment-flow-v1.md  → sync v1
docs/prd/payment-flow-v2.md  → sync v2，AI 自动 diff 两版差异
```

### 协作看板联动

```
Linear/Jira ticket → AI 读 ticket → 生成 spec 草稿
                  → PM 确认 → 开发实施
```

### 需求评审会议纪要

```
会议录音 → AI 转录 → 提取决策点 → 追加到 PRD
```

---

## 四、产品经理推荐 Skill（优先级排序）

| 优先级 | Skill | 解决的问题 |
|--------|-------|-----------|
| **P0** | PRD Review | "PRD 写全了吗？" — 自动检查完整性 |
| **P1** | PRD → Spec 桥接 | "PRD 怎么变成开发任务？" — 自动生成 spec |
| **P1** | Design Review | "这个交互流程对不对？" — 只看骨架图确认 |
| **P2** | Figma → 约束 | "设计稿更新了，开发知道吗？" — 自动同步 |
| **P2** | 会议纪要 → PRD | "会上说的怎么落到 PRD？" — 自动提取决策 |

详见 `docs/design/skills-catalog.md`。
