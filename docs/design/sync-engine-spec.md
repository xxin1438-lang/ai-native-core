# 蒸馏引擎行为规范

本文档定义 `ai-native sync` 的完整执行流程、错误处理和边界情况。

---

## 一、执行流程

```
ai-native sync [--force] [--dry-run] [--factor <name>]

  0. 获取项目根路径（git rev-parse --show-toplevel）

  1. 确认 .ai-native/memory/ 目录存在（不存在则创建）

  2. 读取 .ai-native/memory/MANIFEST.yaml，获取因子定义

  3. 读取 .ai-native/memory/SYNC-STATE.md（若存在），获取上次 git hash

  4. 获取受监控路径当前最新 commit hash：
     git log -1 --format=%H -- <paths from config.toml paradigm.watch_paths>

  5. [HASH MATCH] hash 相同 && 非 --force：
     → 输出 "资产记忆已是最新（hash: <short-hash>），无需重新蒸馏"
     → 退出（exit 0）

  6. [HASH DIFF || --force]：

     a. 按 MANIFEST.yaml factors[] 遍历因子：
        - 读取 source_globs 匹配的源文件
        - 读取 builtin_sources（适配器内置规则文件，如 immutable-rules.md）
        - 合并源文件 + 内置规则 → 调用 LLM 蒸馏
        - builtin_sources 的内容标记为"最高优先级，必须保留"
        - 写入输出文件（含 frontmatter）
        - 全量覆盖写入（Write），禁止追加模式

     b. Pre-Write 防膨胀：
        禁止将 .ai-native/memory/ 中已有记忆文件作为蒸馏输入
        输入只能是 MANIFEST.yaml 声明的 source_globs 匹配的文件

     c. 写入所有因子文件

     d. 写入 SYNC-STATE.md（新 hash + 时间戳 + 源文件清单 + per-factor hash）

     e. Template 同步（copy-back）：
        记忆文件和 SYNC-STATE.md 同步写入 docs/.ai-native/memory/

     f. AI 工具配置生成：
        仅生成 config.toml ai_tools.engines 中声明的引擎配置

  7. 输出摘要：
     "已更新 X 个记忆文件，同步 template，创建/校验 Y 个 AI 工具配置"
```

---

## 二、错误处理矩阵

| 场景 | 行为 |
|------|------|
| MANIFEST.yaml 不存在 | 报错退出：`MANIFEST.yaml not found. Run ai-native init first.` |
| source_globs 不匹配任何文件 | 警告：`factor <name>: no source files matched`，跳过该因子 |
| LLM 调用失败 | 重试 1 次；再次失败则报错退出，保留上一次的记忆文件不变 |
| 目标目录不可写 | 报错退出 |
| 单个因子蒸馏失败 | 记录错误，继续处理其余因子；最终汇总失败项 |
| --dry-run | 不写任何文件，输出"将要更新 X 个因子"的预览 |
| --factor <name> | 仅蒸馏指定因子，不影响其余记忆文件 |
| --force | 跳过 hash 检查，强制全量重新蒸馏 |

---

## 三、Pre-Write 防膨胀规则（强制执行）

这是防止记忆文件随时间膨胀的关键机制。

### 规则

1. 蒸馏引擎读取源文件时，**禁止**将 `.ai-native/memory/` 目录下已有记忆文件纳入输入
2. 蒸馏输入来源**只能**是 MANIFEST.yaml 各因子的 `source_globs` 匹配的文件
3. 写入时使用**全量覆盖**（Write），禁止追加模式
4. 记忆文件行数超过阈值（默认 50 行）时输出警告

### 自动检测

```bash
for f in .ai-native/memory/*.md; do
  if [ "$(basename "$f")" = "SYNC-STATE.md" ]; then continue; fi
  lines=$(wc -l < "$f" | tr -d ' ')
  if [ "$lines" -gt 50 ]; then
    echo "WARNING: $(basename $f) has $lines lines (>50) — possible bloat"
  fi
done
```

---

## 四、Template 同步（Copy-back）

Template 目录（`docs/.ai-native/memory/`）是 git 分发的模板副本。

### 同步规则

- 每次 `ai-native sync` 后自动 copy 因子文件 + SYNC-STATE.md 到 template 目录
- 全量覆盖（非 merge）
- 目录不存在则自动创建
- 路径可通过 config.toml `distiller.template_dir` 自定义

### 用途

```
新成员 onboarding：
  ai-native init
  → 从 docs/.ai-native/memory/ 复制记忆文件到 .ai-native/memory/

已有成员范式变更后：
  ai-native sync
  → 蒸馏 → 写入 .ai-native/memory/
  → copy-back → 可供 git commit 分发
```

---

## 五、增量蒸馏

按因子粒度做增量，避免无关变更触发全量重蒸馏。

### 逻辑

```
1. 计算每个因子 source_globs 匹配文件的联合 hash
2. 与 SYNC-STATE.md 记录的 per-factor hash 对比
3. 仅 hash 变化的因子执行蒸馏
4. hash 未变的因子保留原文件
```

SYNC-STATE.md 记录格式：
```markdown
## Factor Hashes
- design-foundation: a1b2c3d4
- forbidden-patterns: e5f6g7h8
- known-pitfalls: i9j0k1l2
- available-resources: m2n3o4p5
- architecture-paradigm: q6r7s8t9
```

---

## 六、LLM 蒸馏合约

蒸馏引擎调用 LLM 时的标准 prompt 结构：

```
System: 你是项目知识蒸馏器。按以下规格输出：

{factor.distill_prompt}

输出格式：
- 每条一行，以 "- " 开头
- 不超过 {max_items} 条
- 每条不超过 {max_item_length} 字符
- 禁止出现：{forbidden_in_output}

User: 以下是源文件内容：
{source_files_content}
```

蒸馏引擎需校验 LLM 输出：
- 条目数 ≤ max_items
- 无 forbidden_in_output 模式
- 非空
- 非原文复制（与源文件最长公共子串 < 80 字符/条）
