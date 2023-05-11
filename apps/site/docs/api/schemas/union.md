# `union`

Creates a [union](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) schema of the provided schemas.

## Example

```ts
import { union, string, number, literal } from "@sodd/core";

const stringOrNumberSchema = union([string(), number()]);

stringOrNumberSchema.parse("hello"); // ✅
stringOrNumberSchema.parse(123); // ✅
stringOrNumberSchema.parse(true); // 🚨

const foodSchema = union([
  object({
    type: literal("pizza"),
    toppings: array(string()),
  }),
  object({
    type: literal("burger"),
    withFries: boolean(),
  }),
  object({
    type: literal("sodd"),
  }),
]);

foodSchema.parse({ type: "pizza", toppings: ["cheese", "tomato"] }); // ✅
foodSchema.parse({ type: "burger", withFries: true }); // ✅
foodSchema.parse({ type: "sodd" }); // ✅
foodSchema.parse({ type: "hotdog" }); // 🚨
```

## Issue types

- [`InvalidUnionIssue`](/api/issues/InvalidUnionIssue) — if none of the schemas match the input. This issue contains all the issues from the schemas that were tried.
