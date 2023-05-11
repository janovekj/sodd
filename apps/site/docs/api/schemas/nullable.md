# `nullable`

Creates a schema which accepts `null` values in addition to the passed schema.

:::info
While Sodd's schemas try to mimic the behavor their Zod counterparts, there are some differences. Where Zod has a dedicated `null` schema for values that can only be `null`, in Sodd, this is achieved simply by using a `nullable` with no arguments.
:::

```ts
import { nullable, string } from "@sodd/core";

const schema = nullable(string());

schema.parse(null); // ✅ => null
schema.parse("sodd"); // ✅ => "sodd"
schema.parse(123); // 🚨

const justNullSchema = nullable();

justNullSchema.parse(null); // ✅ => null
justNullSchema.parse("sodd"); // 🚨
```

## Issue types

- If no schema is passed, the `nullable` schema can only produce[`InvalidTypeIssue`](/api/issues/InvalidTypeIssue)
- If a schema is passed, the possible issue types will be those of the schema
