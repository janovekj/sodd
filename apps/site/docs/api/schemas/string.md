# `string`

Creates a schema that parses `string` values.

Most likely there will be cases where you want to perform additional validation to the parsed string. For example, you might want to check if the string is a valid email address. In that case, you can use the `string` schema as a building block for your own [custom schema](/guides/custom-schemas).

## Example

```ts
import { string } from "@sodd/core";

const myString = string();

string(parse).parse("sodd"); // ✅ => "sodd"
string(parse).parse(123); // 🚨
```

## Issue types

- [`InvalidTypeIssue`](/api/issues/InvalidTypeIssue)
