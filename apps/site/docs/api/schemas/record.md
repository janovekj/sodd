# `record`

Creates a schema that parses input as a [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type), where the keys are `string`s and the values are of the given schema.

**Note**: Sodd's `record` only supports `string` keys, as opposed to Zod, which lets you specify the key type as well.

## Example

```ts
import { record, number } from "@sodd/core";

const ageSchema = record(number());

ageSchema.parse({ "Test McTestface": 100, "Sodd McSoddface": 43 }); // ✅
ageSchema.parse({ "Test McTestface": 100, "Sodd McSoddface": "43" }); // 🚨
```

## Issue types

- [`InvalidTypeIssue`](/api/issues/InvalidTypeIssue)
- ...and any issues from the given schema
