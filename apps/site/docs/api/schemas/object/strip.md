# `strip`

Creates a clone of the given [`object`](/api/schemas/object) schema with `unknownKeysBehavior` set to `"strip"`. This means that any unknown keys in the input will be stripped from the output.

## Example

```ts
import { strip, object, string } from "@sodd/core";

const userSchema = object({ name: string() }, "passthrough");
userSchema.parse({ name: "Test McTestface", age: 42 }); // ✅ => { name: "Test McTestface" }

const stripUserSchema = strip(userSchema);
stripUserSchema.parse({ name: "Test McTestface", age: 42 }); // ✅ => { name: "Test McTestface" }
```
