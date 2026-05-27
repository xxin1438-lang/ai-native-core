# Node.js Backend (Express/Koa) — Architecture Immutability Rules

Built-in adapter rules. Always included in forbidden-patterns during sync.

---

## Layering

- DO NOT access database directly from route handlers (use Service → Repository)
- DO NOT put business logic in middleware
- DO NOT create circular dependencies between modules
- DO NOT pass Express req/res to business/service layers

## Error Handling

- DO NOT catch errors in route handlers without passing to error middleware (use next(err))
- DO NOT expose stack traces in production
- DO NOT return inconsistent error response structures

## API Contract

- DO NOT rename or remove published API fields (breaking changes → versioned routes)
- DO NOT return DB models directly in responses (use DTO)
- DO NOT use `any` or `{}` as response type in TypeScript APIs

## Security

- DO NOT hardcode secrets, tokens, or passwords in code or config
- DO NOT implement auth in route handlers (use dedicated middleware)
- DO NOT log passwords, tokens, or PII
- DO NOT disable CORS entirely (restrict origins)
- DO NOT use eval() or new Function()

## Database

- DO NOT execute queries inside loops (N+1 problem)
- DO NOT concatenate user input into SQL (use parameterized queries)
- DO NOT use sync({ force: true }) in production
- DO NOT use findAll() without pagination

## Testing

- DO NOT start full Express app in unit tests (test handlers in isolation)
- DO NOT share mutable state between tests
