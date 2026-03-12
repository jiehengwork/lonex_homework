---
name: ts-enforcer
description: Enforces strict TypeScript usage, forbidding the `any` type while allowing dynamic typing via proper type narrowing when necessary.
---

# Instruction

When the user asks you to write, refactor, or explain JavaScript/TypeScript logic, you MUST adhere to the following rules:

1. **Always use TypeScript:** All new code and refactored logic must be written in TypeScript, not plain JavaScript.
2. **Strictly NO `any`:** You are explicitly forbidden from using the `any` type. Do not use it under any circumstances as a fallback or shortcut.
3. **Use Proper Typing:** Define explicit interfaces or types for all variables, function parameters, and return types. Use `unknown` if the type is truly unknown, and handle it safely.
4. **Dynamic Typing via Narrowing:** If you need to handle dynamic types or properties whose types are not known at compile time, use type narrowing (e.g., `typeof`, `instanceof`, `in` operator, custom type guards) or generics to safely interact with the data instead of bypassing the type checker.

Always explain any type narrowing you use to ensure the logic is clear.