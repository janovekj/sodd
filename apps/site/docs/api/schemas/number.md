# `number`

Creates a schema which parses `number` values.

## Example

```ts
import { number } from "@sodd/core";

const schema = number();

schema.parse(123); // ✅
schema.parse(-1000); // ✅
schema.parse(3.14); // ✅
schema.parse("sodd"); // 🚨
```

## Issue types

- [`InvalidTypeIssue`](/api/issues/InvalidTypeIssue)
