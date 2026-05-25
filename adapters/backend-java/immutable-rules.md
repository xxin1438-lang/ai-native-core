# Java 后端（Spring Boot）— 架构不变性规则

以下规则由适配器内置，定义了 Spring Boot 项目的基础架构边界。

---

## 分层架构

- 禁止 Controller 层直接操作数据库（必须通过 Service → Repository）
- 禁止 Service 层之间循环依赖（必须通过接口 + 事件解耦）
- 禁止跨层调用（Controller → Repository 跳过 Service）
- 禁止在 Entity/Domain 对象中引入 Web 层依赖
- 禁止在 Mapper/Repository 层编写业务逻辑

## 事务管理

- 禁止在 Controller 层使用 @Transactional
- 禁止在 private 方法上使用 @Transactional（AOP 不生效）
- 禁止在同一个 Service 类中自调用 @Transactional 方法
- 禁止在只读查询中使用默认事务传播级别（必须 readOnly = true）
- 禁止忽略 @Transactional 的 rollbackFor（必须显式声明 rollbackFor = Exception.class）

## 异常处理

- 禁止在 Service 层 catch 异常后不处理也不重新抛出
- 禁止在 Controller 层使用 try-catch 返回不同结构响应体（必须用 @ControllerAdvice）
- 禁止将数据库异常直接暴露给前端

## API 契约

- 禁止修改已发布 API 的请求/响应字段名或类型（breaking change 必须走 /api/v2/）
- 禁止在响应体中直接返回 Entity 对象（必须通过 DTO/VO 转换）
- 禁止使用 Map<String, Object> 作为 API 响应体
- 禁止在 GET 请求中使用 @RequestBody

## 安全

- 禁止在代码或配置文件中硬编码密钥、token、密码
- 禁止在 Controller 中手动解析 JWT（必须使用 Spring Security filter chain）
- 禁止绕过 SecurityContext 直接获取用户信息
- 禁止在日志中输出完整 JWT token、密码或身份证号

## 数据库操作

- 禁止在循环中执行数据库查询（N+1 问题）
- 禁止在 JPA Entity 中使用 FetchType.EAGER（@OneToMany/@ManyToMany）
- 禁止在 MyBatis XML mapper 中拼接动态 SQL 而不使用 `<where>` / `<if>` 防注入
- 禁止生产环境使用 ddl-auto: create / create-drop
- 禁止 migration 脚本中使用 DROP TABLE / DROP COLUMN 不经审批
- 禁止使用 SELECT *

## 依赖注入

- 禁止在 @Service/@Component 类中使用 new 创建依赖对象
- 禁止使用字段注入（@Autowired on field），必须使用构造器注入
- 禁止在非 Spring 管理的类中使用 @Autowired

## 测试

- 禁止单元测试启动完整 Spring 上下文（必须用 @WebMvcTest / @DataJpaTest）
- 禁止测试之间共享可变状态
