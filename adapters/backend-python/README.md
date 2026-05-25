# Python 后端适配器

适配目标：Python 3.12+ + FastAPI + SQLAlchemy 2.0 + Pydantic v2 + PostgreSQL

## 提供的默认模板

- 无设计因子（后端项目不需要 design-foundation）
- 新增：
  - api-contract.md：FastAPI 路由规范、Pydantic schema 分层、依赖注入规则
  - database-rules.md：SQLAlchemy 2.0 声明式映射、migration (Alembic)、查询性能
  - security-rules.md：OAuth2 + JWT、RBAC、CORS、rate limiting
  - typing-rules.md：Python 类型注解强制规则（mypy strict）
