# `lazy`

A function, which, when given a schema, creates a new schema that will be evaluated lazily. This is useful for creating recursive schemas. Recursive stuff isn't TypeScript's favorite thing, so the automatic type inference doesn't work here.

It is also worth noting that [`deepPartial`](/api/schemas/object/deepPartial) does not apply to lazy schemas.

## Example

```ts
import { Schema, lazy, Infer } from "@sodd/core";

type ListItem = {
  value: string;
  items: ListItem[];
};

const listItemSchema: Schema<ListItem, InvalidTypeIssue | MissingKeyIssue> =
  object({
    value: string(),
    items: lazy(() => array(listItemSchema)),
  });

const listSchema = array(listItemSchema);

type List = Infer<typeof listSchema>;
// => ListItem[]
```
