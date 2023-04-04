---
sidebar_position: 3
---

# Error handling

:::info
This guide assumes you are familiar with [Results](/guides/results).
:::

Sodd is unopinionated on how errors are handled. Instead, Sodd will provide as much useful information as possible, and leave it up to the user to decide how to handle it.

Out of the box, Sodd ships with a set of issues that cover the most common cases, but it is also possible to create custom issue types. See [the API reference on issue types](/api/issue-types) for more a complete list of the built-in issues.

## Example

Let's look at a fairly simple schema which models a user. It has a `name` property, which is a `string`, and a `coordinates` property, which is a tuple of two `number`s:

```ts
import { object, number, tuple } from "@sodd/core";

const userSchema = object({
  name: string(),
  coordinates: tuple([number(), number()]),
});
```

When failing to parse a user, the `Result` object will contain a list of issues. Sodd is pretty smart about this, and the type of the issues will be a [discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) of all possible issues in the schema. In this example, the combination of `object`, `number` and `tuple` will result in a union consisting of the following issue types:

- `MissingKeyIssue` — from `object`
- `InvalidTypeIssue` — from `object`, `number` and `tuple`
- `TooBigIssue` — from `tuple`
- `TooSmallIssue` — from `tuple`

Then, it is up to you how granular the error handling should be. If the invalid data comes from an HTTP call to your backend, you might want to send a detailed log message to your error tracking service.

```ts
const result = userSchema.parse(someData);

if (result.ok) {
  // do stuff with `result.data`
} else {
  for (const issue of result.issues) {
    switch (issue.code) {
      // IntelliSense and type safety all the way ✅
      case "invalid_type":
        logError(
          `invalid response from '/api/user'. Invalid type at ${issue.path.join(
            "."
          )}. Expected ${issue.expected}, received ${issue.received}.`
        );
        break;
      case "too_small":
        if (issue.path[0] === "coordinates") {
          logError(
            `invalid response from '/api/user'. The coordinates are too small at ${issue.path.join(
              "."
            )}. Expected at least ${issue.min}, received ${issue.received}.`
          );
        }
        break;
      // etc...
    }
  }
}
```

:::tip
Not a fan of big and unwieldy `switch` and `if` statements? For more complex error handling, the excellent library **[ts-pattern](https://github.com/gvergnaud/ts-pattern)** enables you to pattern match on Sodd's issues in a much more elegant way! 💡
:::

On the other hand, an end-user doesn't necessarily need to know the specific details of what went wrong, and a generic error message about the failed action might be enough:

```ts
const result = userSchema.parse(someData);

if (!result.ok) {
  alert("Sorry, we're having trouble accessing your user data.");
}
```

## Error formatting

Sodd does not have a built-in way to format error messages, but might add this in the future. In the meantime, you can have a look at how [https://github.com/causaly/zod-validation-error](zod-validation-error) does things.
