# 基座完整性保护

本文档定义 ai-native-core 的基座文件和用户空间文件的边界，以及防止基座被意外修改的保护机制。

---

## 一、文件分类

### 框架基座（不可编辑）

这些文件由框架提供，不在项目目录中，随框架版本升级更新。

| 文件 | 位置 | 修改方式 |
|------|------|---------|
| 适配器内置规则 `immutable-rules.md` | npm 全局包 | 框架版本升级 |
| 蒸馏引擎核心 | npm 全局包 CLI | 框架版本升级 |
| Hook 脚本模板 | npm 全局包 | 框架版本升级 |

> `npm install -g ai-native-core` 后，框架文件在全局 npm 目录中，**不在项目目录**。

### 项目配置（可编辑，受 git review 保护）

| 文件 | 谁编辑 | 保护方式 |
|------|--------|---------|
| `.ai-native/config.toml` | 项目 owner | git PR review |
| `.ai-native/acceptance.yaml` | 项目 owner | git PR review |
| `.ai-native/memory/MANIFEST.yaml` | 项目 owner | git PR review |
| `docs/self-update.md` | AI（经授权）| git PR review |
| `docs/decisions/*.md` | AI（经授权）| git PR review |

### 本机生成（gitignored，sync 自动覆盖）

| 文件 | 生成者 | 提交？ |
|------|--------|--------|
| `.ai-native/memory/*.md` | `ai-native sync` | ❌ gitignored |
| `.ai-native/memory/SYNC-STATE.md` | `ai-native sync` | ❌ gitignored |
| `.ai-native/reports/*.md` | `ai-native accept` | ❌ gitignored |
| `.ai-native/hooks/*.sh` | `ai-native hooks install` | ❌ gitignored |

### 模板同步（提交，sync 自动覆盖）

| 文件 | 生成者 | 何时覆盖 |
|------|--------|---------|
| `docs/.ai-native/memory/*.md` | `ai-native sync` copy-back | 每次 sync |
| `.claude/CLAUDE.md` | `ai-native sync` | sync 时检查补全 |
| `.claude/settings.json` | `ai-native hooks install` | hooks 变更时 |

---

## 二、五层保护

### ① 框架文件不在项目目录

```
npm install -g ai-native-core
→ 安装在 /usr/local/lib/node_modules/ai-native-core/
→ 项目目录只有 .ai-native/ 配置文件
→ 团队成员无法触及适配器内置规则
```

### ② 适配器规则从 npm 包加载

蒸馏引擎运行时：
```
1. 读 .ai-native/config.toml → adapter = "react-spa"
2. 从 npm 包加载 adapters/react-spa/immutable-rules.md
3. 从项目加载 source_globs 匹配的文档
4. 合并蒸馏 → 写入记忆因子
```

适配器规则文件不在项目目录，无法通过 git commit 修改。

### ③ 配置文件受 git review 保护

config.toml / acceptance.yaml / MANIFEST.yaml 提交 git。任何修改需 PR review。

### ④ 自动生成文件被 sync 覆盖

手动修改 `.ai-native/memory/` 下的文件：
- 已被 `.gitignore` 排除
- 下次 `ai-native sync` 全量覆盖
- Pre-Write 防膨胀保证不读取旧记忆作为输入

### ⑤ sync 不覆盖项目配置文件

`ai-native sync` 只覆盖：
- `.ai-native/memory/*.md`
- `docs/.ai-native/memory/*.md`
- `.claude/CLAUDE.md`

**绝不覆盖**：config.toml / acceptance.yaml / MANIFEST.yaml / 项目文档。

---

## 三、错误场景

| 场景 | 后果 | 保护 |
|------|------|------|
| 手动修改 `.ai-native/memory/` | 下次 sync 覆盖 → 无影响 | gitignore + sync |
| 修改 config.toml 换适配器 | 基座改变 → 需 review | git PR |
| 修改项目文档 | **期望行为** → sync 重新蒸馏 | Hook 提醒 |
| 修改 immutable-rules.md | **不可能**（不在项目目录） | npm 全局安装 |
| 框架升级 | 适配器规则更新 → 下次 sync 纳入 | 版本管理 |
| 提交了 .ai-native/memory/ | 取决于 .gitignore | 建议配置见下 |

---

## 四、.gitignore

```gitignore
# 本机生成（不提交）
.ai-native/memory/
.ai-native/reports/
.ai-native/hooks/

# 保留配置
!.ai-native/config.toml
!.ai-native/acceptance.yaml
!.ai-native/memory/MANIFEST.yaml
```

---

## 五、结论

**任何人提交代码不会修改 ai-native-core 的基座。** 框架代码在 npm 包中，适配器规则从 npm 加载，项目配置受 git review 保护，自动生成文件被 sync 覆盖且不提交。
