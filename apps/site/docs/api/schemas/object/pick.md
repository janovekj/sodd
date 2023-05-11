# `pick`

Creates a clone of a given [`object`](/api/schemas/object) schema with only the specified properties. Similar to TypeScript's [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys).

## Example

```ts
import { pick, object, string, number } from "@sodd/core";

const userSchema = object({
  name: string(),
  age: number(),
  location: string(),
});

const userWithOnlyName = pick(userSchema, ["name"]);
```
