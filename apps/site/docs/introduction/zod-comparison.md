---
sidebar_position: 2
---

# Comparison with Zod

:::note
**Tl;dr**: Sodd is smaller, but has fewer features and is probably slower. Use Zod if in doubt.
:::

Sodd is highly inspired by and outright copies lots of Zod's API, and also some of its implementations. Imitation is the most sincere form of flattery, and that is certainly the intention here — hopefully that comes across. Zod is an excellent library, and can be highly recommended if you're looking for a more mature and powerful alternative to Sodd.

However, there are _some_ differences. Read on!

## Features

Sodd is mostly focused on representing schemas for JSON data, and does not include many of the features that makes Zod a great choice. Some notable features that are missing from Sodd are:

- Schemas for non-JSON data types, such as `Date`, `Function`, `BigInt`, `Promise` and so on
- Specific string and number validations, such as email, url, uuid, etc.
- Error formatting
- Coercion, preprocessing, refinements and transformations
- Async parsing
- ...and more, probably! See [Zod's documentation](https://zod.dev/docs) for a full list of features, and compare with [Sodd's API reference](/category/api-reference). The individual API pages attempts to make clear any differences in behavior between the two libraries.

However, Sodd is designed to be extensible, and it is possible to add many of these features yourself. See [Custom schemas](/guides/custom-schemas) and [Error handling](/guides/error-handling) for more information. In the future, Sodd may also provide some of these features out of the box, likely as separate packages.

## Size

Sodd is designed to be as small as possible, and is only 2 kB minified and gzipped. With tree-shaking, the size becomes even smaller, since only the things you use will be included in the final bundle. Zod is 10 kB minified and gzipped, which is still very small (negligble, even!), but has limited support for tree-shaking, which means the bundle size will be fairly constant.

## Runtime performance

While no benchmarks have actually been made for Sodd, it is presumed to be slower than Zod. This is due to differing design choices in the implementation. Sodd's implementation is relatively naïve, and mostly focused on great TypeScript support and bundle size. Contributions are welcome!

## API design

Zod's implementation is class-based, and provides a nice chainable API for composing schemas. Due to Sodd's focus on tree-shaking, its implementation and API is function-based, and schema composition is done in a more functional style, which may or may not be preferable to you.

Furthermore, Sodd's `.parse` methods will always return a result object instead of throwing. This was a choice made to make it easier to type issues. Zod's schemas provides both a `.safeParse` method, which is similar to Sodd's `.parse`, and a `.parse` method which throws.

## TypeScript support

Both libraries have excellent TypeScript support, and Sodd tries to mimic Zod's API as much as possible.

One advantage of Sodd, is the support for type-safe validation issues. Where errors in Zod will be reduced to the `ZodError` type, Sodd keeps track of the exact type of validation issue that can occur in your schema. This makes it possible to do exhaustive checks on the issues, and get better type inference when handling them. Which may or may not be useful to you!

## TypeScript version

Zod works in any project with a TypeScript version of 4.5 or higher, whereas Sodd uses some newer features that requires 4.7 or higher. Support for older versions of TypeScript may be added in the future.

## Ecosystem

Zod has a rich ecosystem built around it, which greatly amplifies its usefulness. Sodd is still very new, and has no such ecosystem. However, Sodd's similar API makes it possible to port many of the existing packages.

## The name

The keen eye will spot that the libraries also have slightly differing names. Sodd is first and foremost a [traditional Norwegian dish](https://www.google.com/search?q=sodd). If you're fancy, it could also be a [portmanteau](https://en.wikipedia.org/wiki/Portmanteau) of "small" and "Zod".
