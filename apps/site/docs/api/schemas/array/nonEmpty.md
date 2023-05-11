# `nonEmpty`

Utility function to clone a given [`array`](/api/schemas/array) schema with the `"non-empty"` cardinality.

## Example

```ts
import { nonEmpty, array, string } from "@sodd/core";

const schema = array(string()); // `"many"` cardinality by default

const nonEmptySchema = nonEmpty(schema); // `"non-empty"` cardinality
```
