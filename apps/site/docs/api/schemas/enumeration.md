# enumeration

Creates a schema which parses input as one of the given `string` values.

:::note
Ideally, this would have been called `enum`, but that's a reserved keyword in JavaScript.
:::

## Example

```ts
import { enumeration } from "@sodd/core";

const reactionSchema = enumeration(["thumbsUp", "thumbsDown", "heart"]);

reactionSchema.parse("thumbsUp");
// =>
{
  ok: true,
  data: "thumbsUp"
}

reactionSchema.parse("foo");
// =>
{
  ok: false,
  issues: [{
    code: "invalid_enum_value",
    expected: ["thumbsUp", "thumbsDown", "heart"],
    received: "foo",
    path: []
  }]
}
```

## Issue types

- [`InvalidTypeIssue`](/api/issues/InvalidTypeIssue) — if not a `string`
- [`InvalidEnumValueIssue`](/api/issues/InvalidEnumValueIssue)
