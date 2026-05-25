# Vue 3 适配器

适配目标：Vue 3 + Vite + Pinia + Vue Router + Tailwind CSS

## 与 react-spa 的差异

- 状态管理：Pinia 替代 Zustand + TanStack Query
- 路由：Vue Router 替代 TanStack Router
- 组件：Vue SFC 替代 TSX
- 禁止模式：Vue 特有的反模式（如直接修改 props、在 setup 外使用 composition API）
