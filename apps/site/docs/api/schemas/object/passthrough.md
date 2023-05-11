# `passthrough`

Creates a clone of the given [`object`](/api/schemas/object) schema with `unknownKeysBehavior` set to `"passthrough"`. This means that any unknown keys in the input will also be passed through to the output.

## Example

```ts
import { passthrough, object, string } from "@sodd/core";

// `object` has "strip" behavior by default
const userSchema = object({ name: string() });
userSchema.parse({ name: "Test McTestface", age: 42 }); // ✅ => { name: "Test McTestface" }

const passthroughUserSchema = passthrough(userSchema);
passthroughUserSchema.parse({ name: "Test McTestface", age: 42 }); // ✅ => { name: "Test McTestface", age: 42 }
```
