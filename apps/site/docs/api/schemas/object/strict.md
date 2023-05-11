# `strict`

Creates a clone of the given [`object`](/api/schemas/object) schema with `unknownKeysBehavior` set to `"strict"`. This means that any unknown keys in the input will result in an [`UnknownKeyIssue`](/api/issues/UnknownKeyIssue).

## Example

```ts
import { strict, object, string } from "@sodd/core";

// `object` has "strip" behavior by default
const userSchema = object({ name: string() });
userSchema.parse({ name: "Test McTestface", age: 42 }); // ✅

const strictUserSchema = strict(userSchema);
strictUserSchema.parse({ name: "Test McTestface", age: 42 }); // 🚨
```
