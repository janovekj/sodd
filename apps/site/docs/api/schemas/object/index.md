# `object`

Creates a schema that parses objects of the specified shape. Accepts an optional second argument, `unknownKeysBehavior`, which determines whether to keep or discard unknown keys, or whether to add an `UnknownKeyIssue` when unknown keys are encountered. Use `"passthrough"`, `"strip"`, and `"strict"` respectively. If no value is provided, `"strip"` is used.

For an `object` schema with either of the `unknownKeyBehavior`s, the utility functions [`strip`](/api/schemas/object/strip), [`strict`](/api/schemas/object/strict), and [`passthrough`](/api/schemas/object/passthrough) can be used to create a cloned schema with the desired behavior.

## Example

```ts
import { object, string, number } from "@sodd/core";

// `object` has "strip" behavior by default
const userSchema = object({
  name: string(),
  age: number(),
});

const strictUserSchema = object(
  {
    name: string(),
    age: number(),
  },
  "strict"
);

const passthroughUserSchema = object(
  {
    name: string(),
    age: number(),
  },
  "passthrough"
);
```

## Issue types

- [`InvalidTypeIssue`](/api/issues/InvalidTypeIssue)
- [`MissingKeyIssue`](/api/issues/MissingKeyIssue) — unless all keys are optional
- [`UnknownKeyIssue`](/api/issues/UnknownKeyIssue) — if `unknownKeysBehavior` is set to `"strict"`.
- ...and issues from the schemas of the object's values
