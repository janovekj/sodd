# `brand`

Creates a branded clone of the given schema. This is useful if you want to "disable" the structural typing behavior of TypeScript, and ensure that a value has been parsed by a specific schema. Most likely, you'll want to use this together with [custom schemas](/guides/custom-schemas).

## Example

```ts
import { brand, string } from "@sodd/core";

const email = /* custom email schema creator, see separate guide */

const emailSchema = brand(email(), "email");
type Email = Infer<typeof emailSchema>;

const sendSpam = (email: Email) => { /* ... */};

const maybeEmail: string = /* some string from some source that may or may not be a valid email address */

sendSpam(maybeEmail) // 🚨 => Argument of type 'string' is not assignable to parameter of type 'Brand<string, "email">'

const emailResult = emailSchema.parse("test@example.com");

if (emailResult.ok) {
  sendSpam(emailResult.data) // ✅
}
```

## Issue types

Any issues the given schema may produce.
