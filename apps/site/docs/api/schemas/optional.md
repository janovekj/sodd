# `optional`

Creates a schema that parses input as a given schema or `undefined`.

## Example

```ts
import { optional, object, string } from "@sodd/core";

const userSchema = object({
  name: string(),
  location: optional(string()),
});

userSchema.parse({ name: "Test McTestface" }); // ✅
userSchema.parse({ name: "Test McTestface", location: "Testville" }); // ✅
```
