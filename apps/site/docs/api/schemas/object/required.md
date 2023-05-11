# `required`

Creates a clone if the given [`object`](/api/schemas/object) schema with all properties set to required. Note that this operation is performed shallowly. While there exists both a [`partial`](/api/schemas/object/partial) and a [`deepPartial`](/api/schemas/object/deepPartial) utility, `required` does not (yet?) have a `deepRequired` equivalent.

## Example

```ts
import { required, object, string, number } from "@sodd/core";

const userSchema = object({
  name: optional(string()),
  age: optional(number()),
});

const requiredUserSchema = required(userSchema);

requiredUserSchema.parse({}); // 🚨
requiredUserSchema.parse({ name: "Test McTestface", age: 100 }); // ✅
```
