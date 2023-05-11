# `deepPartial`

Utility function to make all properties (and any nested properties!) of a given [`object`](/api/schemas/object) schema optional.

:::caution
`deepPartial` does not work on properties of [`union`](/api/schemas/union), [`lazy`](/api/schemas/lazy), and [`brand`](/api/schemas/brand) schemas.
:::

## Example

```ts
import { deepPartial, object, array, tuple, string, number } from "@sodd/core";

const schema = object({
  name: string(),
  age: number(),
  friends: array(
    tuple([
      object({
        name: string(),
        age: number(),
      }),
      number(),
    ])
  ),
});

const partialSchema = deepPartial(schema);

partialSchema.parse({
  name: "Parse McParseface",
  friends: [
    [{ name: "Test McTestface" }, 1],
    [{ name: "Sodd McSoddface" }, 2],
  ],
}); // ✅

partialSchema.parse({
  friends: [
    [{}, 1],
    [{}, 2],
  ],
}); // ✅

partialSchema.parse({
  name: "Test McTestface",
  friends: [],
}); // 🚨
```
