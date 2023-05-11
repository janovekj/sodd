# `merge`

Utility function for mergin two [`object`](/api/schemas/object) schemas. If the two schemas have overlapping keys, the second schema will take precedence. If the two schemas have different [`unknownKeysBehavior`](/api/schemas/object#unknownkeysbehavior)s, the second schema's behavior will take precedence.

## Example

```ts
import { merge, object, string, tuple } from "@sodd/core";

const schema1 = object(
  {
    name: string(),
    location: string(), // "City, Country"
  },
  "strict"
);

const schema2 = object({
  name: string(),
  location: tuple([string(), string()]), // ["City", "Country"]
});

const mergedSchema = merge(schema1, schema2);

mergedSchema.parse({
  name: "Test McTestface",
  location: ["Townville", "Countryland"],
  age: 123,
}); // ✅ — `age` is discarded due to `schema2`'s implicit "strip" behavior
```
