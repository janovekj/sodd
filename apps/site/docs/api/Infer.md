---
sidebar_position: 1
sidebar_class_name: "sidebar-code"
---

# `Infer`

Utility type for inferring the type of a schema.

## Example

```ts
import { Infer, object, string, number } from "@sodd/core";

const userSchema = object({
  name: string(),
  age: number(),
});

type User = Infer<typeof userSchema>; // => { name: string; age: number; }
```
