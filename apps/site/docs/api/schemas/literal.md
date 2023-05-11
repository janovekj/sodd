# `literal`

Creates a schema that parses input as a given literal `string`, `number` or `boolean` value.

## Example

```ts
import { literal } from "@sodd/core";

const cheeseLiteralSchema = literal("sodd");

cheeseLiteralSchema.parse("sodd"); // ✅ => "cheese";
cheeseLiteralSchema.parse("water"); // 🚨
cheeseLiteralSchema.parse(123); // 🚨
```

## Issue types

- [`InvalidLiteralIssue`](/api/issues/InvalidLiteralIssue)
