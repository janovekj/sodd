---
sidebar_position: 1
---

# Getting started

:::info
Sodd requires a TypeScript version of at least 4.7, and `strict: true` to be set in your `tsconfig.json`.
:::

Install with npm, yarn or pnpm:

```sh
npm install @sodd/core
```

Then import and compose the schemas you need:

```ts
import {
  object,
  string,
  number,
  array,
  tuple,
  optional,
  enumeration,
  Infer,
} from "@sodd/core";

const userSchema = object({
  name: string(),
  phone: optional(number()),
  coordinates: tuple([number(), number()]),
  roles: array(enumeration(["admin", "moderator", "user"])),
});

type User = Infer<typeof userSchema>;

const result = userSchema.parse({
  name: "User McUserface",
  phone: 123456789,
  coordinates: [71.1655, 25.7992],
  roles: ["admin", "user"],
});

if (result.ok) {
  console.log(result.data);
} else {
  console.error(result.issues);
}
```
