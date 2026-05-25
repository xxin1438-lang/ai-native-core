# React SPA 适配器 — 架构不变性规则

以下规则由适配器内置，定义了 React SPA 项目的基础架构边界。
这些规则在蒸馏 forbidden-patterns 时自动纳入，不依赖项目文档。

---

## 状态分层（不可变）

- 禁止服务端数据（列表、详情、分页、缓存）进入 Zustand（必须使用 TanStack Query）
- 禁止表单字段值进入 Zustand（必须使用 TanStack Form）
- 禁止在 TanStack Query 的 queryFn 之外直接 fetch/axios 获取服务端数据
- 禁止在组件内使用 useState 管理跨组件共享的 UI 状态

## 组件边界（不可变）

- 禁止业务逻辑（API 调用、状态管理、路由跳转）写入 components/ui/
- 禁止在 components/ui/ 中的组件引入 features/ 下的任何模块
- 禁止组件层直接调用 toast() 或 Toaster（必须通过 lib/notify.ts 统一封装）
- 禁止在 features/ 之外的模块直接操作 Zustand store（必须通过封装的 hooks）

## 类型安全（不可变）

- 禁止对整个对象做宽泛类型断言（as WholeObject），必须最小化到单字段
- 禁止用数组下标作为列表 key（必须用稳定业务标识符）
- 禁止 API 函数的 nullable 返回值隐式返回 undefined（必须显式 `return result ?? null`）

## CSS / 样式（不可变）

- 禁止硬编码 hex/rgb/hsl 颜色值（只允许 CSS 变量或 Tailwind token）
- 禁止在组件内写媒体查询实现暗色模式（必须使用 .dark 类覆盖）
- 禁止 CSS token 双重包裹（hsl(hsl(...))）

## SDD 流程（不可变）

- 禁止跳过 spec 阶段直接写实现代码
- 禁止 design.md 缺少 ASCII 页面骨架图

## 技术栈一致性（不可变）

- 禁止在已有 shadcn/ui Base UI 的项目中引入 Radix UI 作为替代
- 禁止在 features/ 层直接 import from @base-ui/react/*
- 禁止手动修改自动生成的路由文件

## 文件结构（不可变）

- 禁止在 src/components/ui/ 之外创建 shadcn 风格的组件文件
- 禁止 features/ 模块之间直接 import 对方的内部组件
