# `tuple`

Creates a schema that validates a tuple of values. An optional `rest` schema can be passed to validate the rest of the values.

## Example

```ts
import { tuple, number, object, string, boolean } from "@sodd/core";

const coordinatesSchema = tuple([number(), number()]);
coordinatesSchema.parse([1, 2]);
// ✅ => [1, 2];

// examples are hard
const weirdSchema = tuple([boolean(), object({ name: string() })], number());
weirdSchema.parse([true, { name: "Test McTestface" }, 1, 2, 3, 4]);
// ✅ => [true, { name: "Test McTestface" }, 1, 2, 3, 4];
```

## Issue types

- [`InvalidTypeIssue`](/api/issues/InvalidTypeIssue)
- [`TooBigIssue`](/api/issues/TooBigIssue) — Can only occur when a `rest` schema is not passed
- [`TooSmallIssue`](/api/issues/TooSmallIssue)
- ...and any issue types from the passed schemas
