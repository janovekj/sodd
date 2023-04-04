# `strict`

Creates a clone of the given [`object`](/api/schemas/object) schema with `unknownKeysBehavior` set to `"strict"`. This means that any unknown keys in the input will result in an [`UnknownKeyIssue`](/api/issues/UnknownKeyIssue).

```ts
// `object` has "strip" behavior by default
const userSchema = object({ name: string() });
userSchema.parse({ name: "John", age: 42 }); // ✅

const strictUserSchema = strict(userSchema);
strictUserSchema.parse({ name: "John", age: 42 }); // 💥
```
