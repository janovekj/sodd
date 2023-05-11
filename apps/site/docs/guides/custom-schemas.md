# Custom schemas

:::caution
**Work in progress!** Custom schemas are very powerful, but we're still figuring out which building blocks to provide, and more importantly: how to explain them.

Currently, custom schemas are _possible_ but not _easy_. Feel free to [suggest improvements](https://github.com/janovekj/sodd/issues) to the docs or Sodd's API!
:::

Out of the box, Sodd mainly provides tools for parsing JSON data and other basic types. However, often you'll want to apply more specific rules to your data, or create your own types. Sodd aims to be extensible, and to provide the building blocks needed to fill in the gaps where it falls short.

For example, let's say you want to parse some user input as an email address. You could use the `string` parser, but that would allow any string to pass validation. Instead, you want to ensure that the string is a valid _email address_. Here is how you could do that:

```ts
import { string, Result, InvalidTypeIssue, InferIssue } from "@sodd/core";

// We want to provide a custom issue for this schema
interface InvalidEmailIssue {
  // Required. Used to identify the issue type
  code: "invalid_email";
  received: unknown;
  // Required. If the schema is used in an object or array,
  // this will describe the path to the invalid value
  // For example: ["users", 0, "email"]
  path: Array<string | number>;
}

// A schema is pretty much an object with a `type` property and a `parse` function
const emailSchema = {
  type: "string", // We'll keep the returned type as `string`
  parse: (
    input: unknown
  ): Result<
    // ↓ We'll keep the returned type as `string`
    string,
    // ↓ Pass along whatever issues might occur in the string parser
    InferIssue<StringSchema> | InvalidEmailIssue
    //                       ↑ Add our custom issue type
  > => {
    // Use the `string` schema to get some basic validation
    const result = string().parse(input);

    // It doesn't even parse as a string! Return the error result
    if (!result.ok) {
      return result;
    }

    // If the string is valid, check if it's an email address
    if (result.data.includes("@")) {
      // Good! Return a SuccessResult object with the parsed data
      return {
        ok: true,
        data: result.data,
      };
    } else {
      // Oh no! Return an ErrorResult object,
      // with an array of the issues that occured
      return {
        ok: false,
        issues: [
          {
            code: "invalid_email",
            received: input,
            // We don't have any path information at this point.
            // However, if this schema is used inside an `object` schema, for instance,
            // the path will be added automatically.
            path: [],
          },
        ],
      };
    }
  },
};

const schema = object({
  email: emailSchema,
});

schema.parse({ email: "test@example.com" })
// =>
{
  ok: true,
  data: { email: "test@example" }
}


schema.parse({ email: "test" }))
// =>
{
  ok: false,
  issues: [
    {
      code: "invalid_email",
      received: "test",
      path: ["email"], // the path was added!
    },
  ],
}
```
