# StudyBook 格式规范

本文档定义踩坑复盘记录（StudyBook）的文件格式和 sub-agent 工作流。

---

## 一、文件命名

```
docs/decisions/YYYY-MM-DD-NN-topic.md
```

| 部分 | 格式 | 示例 |
|------|------|------|
| YYYY-MM-DD | 日期 | 2026-05-25 |
| NN | 当日序号（01-99） | 01 |
| topic | 短横线连接的主题 | profile-redesign |

示例：`docs/decisions/2026-05-25-01-profile-redesign.md`

---

## 二、文件格式

```markdown
# <标题>

**Date**: YYYY-MM-DD
**Topic**: <主题标签>
**Commit range**: <start-hash>..<end-hash>（可选）

## 背景

<1-2 句说明本次工作的上下文>

## 踩坑记录

### 坑 1：<症状>

- **根因**: <为什么发生>
- **解法**: <怎么解决/怎么避免>
- **影响范围**: <哪些文件/模块受影响>

### 坑 2：...

## 经验提炼

- <可泛化为规则的教训>
- <应该加入 forbidden-patterns 的事项>
- <应该加入 known-pitfalls 的事项>

## 文件变更摘要

- 新增: path/to/file
- 修改: path/to/file
- 删除: path/to/file
```

### 示例

```markdown
# Profile 页面重构踩坑

**Date**: 2026-05-25
**Topic**: profile-redesign
**Commit range**: a1b2c3d..e4f5g6h

## 背景

重构用户 Profile 页面，从单列布局改为双列布局，引入 TanStack Form 替代受控组件。

## 踩坑记录

### 坑 1：TanStack Form defaultValues 类型推导失败

- **根因**: defaultValues 中可选字段未显式标注类型，TS 推导为 `undefined` 而非预期类型
- **解法**: 所有 optional 字段在 defaultValues 中使用 `as` 显式标注
- **影响范围**: src/features/profile/form.tsx

### 坑 2：flex 高度链在嵌套 ScrollArea 中断裂

- **根因**: 中间层 div 缺少 `min-h-0`，导致 `flex-1` 不生效
- **解法**: 每层 flex 容器必须同时有 `flex flex-col` + `min-h-0`
- **影响范围**: src/components/app-shell.tsx

## 经验提炼

- 多层 flex 嵌套的 min-h-0 规则 → forbidden-patterns
- TanStack Form optional 字段类型注解 → known-pitfalls
```

---

## 三、Sub-agent 工作流

复盘由 `studybook-review` skill 执行，流程如下：

```
1. 读取 git diff（当前未提交变更或最近一次 commit）
2. 根据 diff 内容推断主题标签（topic）
3. 从 diff 中提取"踩坑信号"：
   - 回退的代码（反复修改同一区域）
   - 注释中的 TODO/FIXME/HACK
   - 配置修改（bunfig.toml、tsconfig、eslint 等）
   - 新增的 guard 代码（if (!x) return、assert 等）
4. 按格式模板生成 StudyBook 条目
5. 写入 docs/decisions/YYYY-MM-DD-NN-topic.md
6. 完成后提示：可运行 ai-native sync 将踩坑提炼为 known-pitfalls
```

### 踩坑信号检测规则

| diff 特征 | 可能含义 |
|----------|---------|
| 同一行被反复修改（3+ 次 commit） | 方案反复，存在设计坑 |
| 新增 `as` 类型断言 | 类型系统不匹配 |
| 新增 config 文件或配置项 | 工具链/环境坑 |
| 新增 error boundary / try-catch | 运行时异常处理坑 |
| 删除后重新添加的代码 | 方案回退 |

---

## 四、与记忆因子的关联

StudyBook → `ai-native sync` → known-pitfalls.md 的蒸馏规则：

- 从 StudyBook 的"经验提炼"段提取因子
- 格式从叙事转为约束：`"TanStack Form defaultValues 类型标注"` → `"TanStack Form optional 字段在 defaultValues 中必须显式类型标注"`
- 去重：与已有 known-pitfalls.md 对比，不重复
- 一条 StudyBook 经验可能对应 0-N 条 known-pitfalls 因子
