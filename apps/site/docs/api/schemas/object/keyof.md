# `keyof`

Creates an [`enumeration`](/api/schemas/enumeration) schema that parses input as a key of the given [`object`](/api/schemas/object) schema.

## Example

```ts
const reactionsSchema = object({
  thumbsUp: number(),
  thumbsDown: number(),
  heart: number(),
});

const reactionSchema = keyof(reactionsSchema);

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
