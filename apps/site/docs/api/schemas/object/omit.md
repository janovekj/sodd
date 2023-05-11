# `omit`

Creates a clone of a given [`object`](/api/schemas/object) schema without the specified properties. Similar to TypeScript's [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys).

## Example

```ts
import { omit, object, string, number } from "@sodd/core";

const userSchema = object({
  name: string(),
  age: number(),
  location: string(),
});

const userWithoutAgeSchema = omit(userSchema, ["age"]);
```
