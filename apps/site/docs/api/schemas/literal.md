# `literal`

Creates a schema that parses input as a given literal `string`, `number` or `boolean` value.

## Example

```ts
import { literal } from "@sodd/core";

const pizzaLiteralSchema = literal("pizza");

pizzaLiteralSchema.parse("pizza");
// =>
{
  ok: true,
  data: "pizza"
}

pizzaLiteralSchema.parse(123);
// =>
{
  ok: false,
  issues: [{
    code: "invalid_literal",
    expected: "pizza",
    received: 123,
    path: []
  }]
}
```

## Issue types

- [`InvalidLiteralIssue`](/api/issues/InvalidLiteralIssue)
