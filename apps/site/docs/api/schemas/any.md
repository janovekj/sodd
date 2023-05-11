# `any`

Creates a schema that accepts any value. See also [`unknown`](/api/schemas/unknown) which is usually preferred when dealing with, well, unknown values.

## Example

```ts
import { any } from "@sodd/core";

const schema = any();

schema.parse("sodd"); // ✅
schema.parse(42); // ✅
schema.parse(undefined); // ✅
schema.parse(new Error()); // ✅
```

## Issue types

None! This schema accepts any value, and therefore never produces any issues. Even though `.parse` can technically never fail, it nevertheless returns a `Result` object, for consistency with the other schemas.
