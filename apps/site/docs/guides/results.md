---
sidebar_position: 2
---

# Results

Parsing with Sodd will never throw errors, unless something has gone very wrong within Sodd itself, or if the type safety is bypassed during usage. Instead, parsing will always return a `Result` object, which in turn will contain either the parsed data, or a list of issues that occured during parsing. This is similar to Zod's `.safeParse` method.

```ts
const userSchema = object({
  name: string(),
  coordinates: tuple([number(), number()]),
});

const result = userSchema.parse(someData);
```

The type of the `result` object is a [discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) of the `SuccessResult` and `ErrorResult` types:

```ts
if (result.ok) {
  // The `data` prop only exists if `ok` is `true`,
  // and will have the type specified by the schema
  result.data;
  // => { name: string, location: [number, number] }
} else {
  // the `issues` prop only exists if `ok` is `false`,
  // and will be an array of encountered issues (with types!)
  result.issues;
  // => Array<MissingKeyIssue | InvalidTypeIssue | TooBigIssue | TooSmallIssue>
}
```

:::info
See [the guide on Error handling](/guides/error-handling) to learn more about working with the `ErrorResult` type.
:::

If this is not the behavior you want, you can use something like this `unwrap` function to assert that the parsing went well, so that the data may be extracted, or throw an error otherwise:

```ts
import { Result, string } from "@sodd/core";

const unwrap = <T>(result: Result<T, any>): T => {
  if (result.ok) {
    return result.data;
  }

  throw new Error(JSON.stringify(result.issues));
};

// returns a string or blows up
const data = unwrap(string().parse(someData));
```
