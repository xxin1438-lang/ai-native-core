# 蒸馏引擎实现方案

## 设计原则

1. **不额外要求 API key**——复用当前 AI Agent 会话的 LLM
2. **三阶段管道**：准备材料 → AI 蒸馏 → 写入因子
3. **内置规则 + 蒸馏结果** 合并输出

## 三阶段管道

```
Phase 1: ai-native sync（准备）
  → 读 MANIFEST.yaml source_globs
  → 计算 hash，跳过未变更因子
  → 生成 .ai-native/_distill/{name}.prompt.md
    包含: distill_prompt + 源文件内容 + 内置规则

Phase 2: AI 执行蒸馏
  AI 读 prompt.md → 按指令提炼 → 输出 {name}.output.md

Phase 3: ai-native sync --finalize
  → 读 output.md + builtin_rules → 合并
  → 写入 frontmatter → .ai-native/memory/
  → 质量验证 → 显示摘要
```

## 为什么不在 sync 里调 LLM

- 用户已在 Claude Code/Cursor 会话中，LLM 已在手边
- 不增加 API key 配置负担
- 蒸馏过程可审查（prompt.md 和 output.md 都是人类可读）
- 用户可以在 finalize 前修改 output.md（纠正 AI 蒸馏结果）

## Prompt 模板

```markdown
# 蒸馏任务: {factor.name}

## 指令
{factor.distill_prompt}

## 输出格式
- 每条一行，"- " 开头，≤{max_items}条，≤200字/条
- 禁止: 本文档/以下/详见/参考

## 已有内置规则（不可删除，只能补充）
{builtin_rules}

## 源文件
{source_files}
```

## 增量蒸馏

按因子 hash 判断是否需要重新蒸馏，跳过未变更因子。

## 用户体验

```bash
$ ai-native sync
[ai-native] 5 个蒸馏任务已准备 → .ai-native/_distill/
→ 请 AI 执行蒸馏，完成后运行 ai-native sync --finalize

# AI 自动蒸馏...
$ ai-native sync --finalize
✓ design-foundation: 14 条（内置 5 + 蒸馏 9）
━━━ AI 现在知道这些约束 ━━━
✓ forbidden-patterns (22 条)
  • 禁止 Controller 直连数据库
  ...
→ 下个会话自动生效
```
