# `partial`

Creates a clone if the given [`object`](/api/schemas/object) schema with all properties set to optional. Note that this operation is performed shallowly. If you also want nested properties to be optional, you need to use [`deepPartial`](/api/schemas/object/deepPartial).

## Example

```ts
import { partial, object, string } from "@sodd/core";

const userSchema = object({
  name: string(),
  location: string(),
});

const partialUserSchema = partial(userSchema);

partialUserSchema.parse({}); // ✅
```
