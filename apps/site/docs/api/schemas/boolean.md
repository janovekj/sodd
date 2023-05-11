# `boolean`

Creates a schema which parses `boolean` values.

## Example

```ts
import { boolean } from "@sodd/core";

const schema = boolean();

schema.parse(true); // ✅
schema.parse(false); // ✅
schema.parse("sodd"); // 🚨
```

## Issue types

- [`InvalidTypeIssue`](/api/issues/InvalidTypeIssue)
