# 项目自检测规范

本文档定义 `ai-native init` 和 `ai-native sync` 时的项目自动检测机制。

---

## 一、检测时机

| 时机 | 触发 | 用途 |
|------|------|------|
| `ai-native init`（无 `--stack`） | 自动 | 推断适配器类型 |
| `ai-native init --stack` | 跳过 | 使用指定适配器 |
| `ai-native sync` | 自动 | 生成版本特定规则 |

---

## 二、检测维度

### 语言检测

| 文件 | 语言 |
|------|------|
| `pom.xml` | Java (Maven) |
| `build.gradle(.kts)` | Java/Kotlin (Gradle) |
| `package.json` | Node.js |
| `go.mod` | Go |
| `pyproject.toml` | Python |

### 版本检测

| 语言 | 检测方式 | 示例 |
|------|---------|------|
| Java | `pom.xml`: `<java.version>` | `11`, `17`, `21` |
| Node.js | `package.json`: `engines.node` | `>=18` |
| Go | `go.mod`: `go 1.xx` | `1.22` |
| Spring Boot | `pom.xml`: parent 版本 | `3.2.0` |

---

## 三、检测结果 → 版本特定规则

**示例：检测到 Java 11 + Spring Boot 2.7**，自动生成：

```markdown
## 版本特定规则（自动检测）
- Java 11：禁止使用 record、sealed class、pattern matching
- Java 11：禁止 Lambda 参数中使用 var
- Spring Boot 2.7：禁止使用 jakarta.* 命名空间
```

**示例：检测到 Java 21 + Spring Boot 3.2**：

```markdown
## 版本特定规则（自动检测）
- Java 21：推荐 record 替代 @Data
- Spring Boot 3.2：必须使用 jakarta.* 命名空间
- Spring Boot 3.2：推荐 RestClient 替代 RestTemplate
```

---

## 四、生成流程

```
ai-native sync:
  1. 加载 immutable-rules.md（通用）
  2. 扫描 pom.xml → java.version = 11, spring-boot = 2.7
  3. 匹配 version-rules/java-11-spring-2.x.md
  4. 合并 → forbidden-patterns.md
```

---

## 五、init 自动检测

```bash
ai-native init  # 无 --stack

📋 检测到:
   语言: Java 17 (Maven)
   框架: Spring Boot 3.2.1
   包管理: Maven
   建议适配器: backend-java
确认? (yes/no) [yes]:
```

---

## 六、版本规则模板目录

```
adapters/backend-java/
├── immutable-rules.md        # 通用（所有版本）
├── version-rules/
│   ├── java-11-spring-2.x.md
│   ├── java-17-spring-3.x.md
│   └── java-21-spring-3.x.md
└── README.md
```

无精确匹配时 → 通用规则 + AI 自推断。
