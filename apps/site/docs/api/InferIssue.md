---
sidebar_position: 3
sidebar_class_name: "sidebar-code"
---

# `InferIssue`

Utility type for inferring the possible [issue types](/api/issues) from a schema.

## Example

```ts
import { InferIssue, object, string, enumeration } from "@sodd/core";

const userSchema = object({
  name: string(),
  favoriteFood: enumeration(["burger", "hotdog", "sodd"]),
});

type UserIssue = InferIssue<typeof userSchema>;
// => InvalidTypeIssue | InvalidEnumValueIssue<["burger", "hotdog", "sodd"]> | MissingKeyIssue
```
