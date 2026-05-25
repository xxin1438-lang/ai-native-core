# Go 后端适配器

适配目标：Go 1.22+ + net/http (或 gin/echo/chi) + GORM/sqlx + PostgreSQL

## 提供的默认模板

- 无设计因子（后端项目不需要 design-foundation）
- 新增：
  - api-contract.md：API 契约约束（RESTful 规范、错误码、分页格式）
  - database-rules.md：数据库约束（migration 规则、索引规范、查询性能）
  - security-rules.md：认证（JWT/OAuth2）、授权（RBAC）、输入校验、密钥管理
