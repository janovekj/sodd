# `array`

Creates a schema which parses arrays of the provided schema type.

Accepts an optional second argument, `cardinality`, which describes whether the array is expected to be non-empty, or whether it can contain any number of items. Use `"non-empty"` or `"many"` respectively. If no value is provided, `"many"` is used.

The [`nonEmpty`](/api/schemas/array/nonEmpty) utility function can be used to create a cloned schema with the `"non-empty"` cardinality.

## Example

```ts
import { array, string } from "@sodd/core";

const schema = array(string());

schema.parse(["burgers", "sodd"]); // ✅
schema.parse([]); // ✅
schema.parse([1, 2, 3]); // 🚨
schema.parse("cheese"); // 🚨

const nonEmptySchema = array(string(), "non-empty");
schema.parse(["burgers", "sodd"]); // ✅
schema.parse([]); // 🚨
```

## Issue types

- [`InvalidTypeIssue`](/api/issues/InvalidTypeIssue)
- [`TooSmallIssue`](/api/issues/TooSmallIssue) — if `"non-empty"` cardinality is used
- ...and any issue types from the passed schema
