# Git 提交与审核指南

## 文件分类

| 文件 | 提交 | 审核 | 说明 |
|------|------|------|------|
| `.ai-native/config.toml` | ✅ | **必须** | adapter/engines 变更影响全团队 |
| `.ai-native/acceptance.yaml` | ✅ | **必须** | 验收命令影响 CI |
| `.ai-native/memory/MANIFEST.yaml` | ✅ | **必须** | source_globs 决定蒸馏范围 |
| `docs/.ai-native/memory/*.md` | ✅ | 自动 | sync 自动覆盖，不手动改 |
| `docs/decisions/*.md` | ✅ | 建议 | 踩坑记录，团队知识 |
| `docs/self-update.md` | ✅ | 建议 | 范式变更日志 |
| `.ai-native/custom-rules.md` | ✅ | **必须** | 覆盖框架内置规则 |
| `.ai-native/memory/*.md` | ❌ | — | 本机生成，gitignored |
| `.ai-native/reports/` | ❌ | — | 本机生成 |
| `.ai-native/hooks/` | ❌ | — | 本机生成 |

## .gitignore

```gitignore
.ai-native/memory/
.ai-native/reports/
.ai-native/hooks/
!.ai-native/config.toml
!.ai-native/acceptance.yaml
!.ai-native/memory/MANIFEST.yaml
```

## 必须审核的场景

| 改动 | 影响 | 审核人 |
|------|------|--------|
| 换适配器 | 全团队 AI 约束规则变 | 架构师 |
| 改 engines | AI 工具配置变 | 架构师 |
| 改验收命令 | CI 行为变 | Tech Lead |
| 改 source_globs | 蒸馏范围变 | Tech Lead |
| 新增 custom-rules | 覆盖框架规则 | 架构师 |

## 提交示例

```bash
# ✅ 正确
git add .ai-native/acceptance.yaml
git commit -m "acceptance: use mvn verify"
# → PR → review → merge

# ✅ 正确
ai-native sync
git add docs/.ai-native/memory/
git commit -m "ai-native: sync memory factors"

# ❌ 错误
git add .ai-native/memory/   # 已 gitignored
```
