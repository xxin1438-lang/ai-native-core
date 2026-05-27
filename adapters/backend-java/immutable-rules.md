# Java Backend (Spring Boot) — Architecture Immutability Rules

Built-in adapter rules. Always included in forbidden-patterns during sync.

---

## Layering

- DO NOT access database directly from Controller (must go through Service → Repository)
- DO NOT create circular dependencies between Service classes (use interfaces + events)
- DO NOT skip layers (Controller → Repository bypassing Service)
- DO NOT introduce Web layer dependencies in Entity/Domain objects
- DO NOT put business logic in Mapper/Repository layer

## Transaction Management

- DO NOT use @Transactional on Controller layer
- DO NOT use @Transactional on private methods (AOP won't work)
- DO NOT call @Transactional methods within the same Service class
- DO NOT use default propagation for read-only queries (must set readOnly = true)
- DO NOT omit rollbackFor in @Transactional (must declare rollbackFor = Exception.class)

## Exception Handling

- DO NOT catch exceptions in Service layer without handling or rethrowing
- DO NOT return inconsistent response structures from Controller try-catch (use @ControllerAdvice)
- DO NOT expose database exceptions directly to the frontend

## API Contract

- DO NOT rename or retype published API request/response fields (breaking changes → /api/v2/)
- DO NOT return Entity objects directly in responses (must convert via DTO/VO)
- DO NOT use Map<String, Object> as API response body
- DO NOT use @RequestBody on GET requests

## Security

- DO NOT hardcode keys, tokens, or passwords in code or config files
- DO NOT manually parse JWT in Controller (use Spring Security filter chain)
- DO NOT bypass SecurityContext to get user info
- DO NOT log complete JWT tokens, passwords, or PII

## Database

- DO NOT execute database queries inside loops (N+1 problem)
- DO NOT use FetchType.EAGER on @OneToMany/@ManyToMany JPA entities
- DO NOT concatenate dynamic SQL in MyBatis XML mappers without `<where>` / `<if>`
- DO NOT use ddl-auto: create / create-drop in production
- DO NOT use DROP TABLE / DROP COLUMN in migration scripts without approval
- DO NOT use SELECT *

## Dependency Injection

- DO NOT use `new` to create dependency objects in @Service/@Component classes
- DO NOT use field injection (@Autowired on field), use constructor injection
- DO NOT use @Autowired in non-Spring-managed classes

## Testing

- DO NOT start full Spring context in unit tests (use @WebMvcTest / @DataJpaTest)
- DO NOT share mutable state between tests
