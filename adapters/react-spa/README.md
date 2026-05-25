# React SPA 适配器

适配目标：React 19 + Vite + TanStack Router/Query/Form/Table + Tailwind CSS v4 + shadcn/ui

## 提供的默认模板

- 记忆因子模板（design-foundation / forbidden-patterns / known-pitfalls / available-resources / architecture-paradigm）
- 默认禁止模式（状态分层、组件边界、类型安全）
- 默认验收管道（lint → typecheck → test → e2e → build）

## 提供的默认规则

- TanStack 全家桶的状态分层：Query（服务端数据）→ Zustand（客户端 UI）→ Form（表单）
- shadcn/ui 组件使用规则（Base UI 优先，Radix 仅回退）
- Tailwind v4 CSS token 用法规则
- TypeScript strict 模式约束
