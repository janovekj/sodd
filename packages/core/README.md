# 🥫 @sodd/core

Sodd is a lightweight TypeScript data validation library, heavily inspired by [Zod](https://zod.dev).

👉 **[Documentation](https://sodd.dev)** 👈

**Some highlights:**

- **Small** — Only 2 kB minified and gzipped, and highly tree-shakeable.
- **Focused** — Sodd's main focus is on parsing JSON data, which keeps the API surface small.
- **Excellent TypeScript support** — Type safety for the parsed data is a given, and Sodd also keeps track of the types of validation issues that can occur in your schema.
- **Extensible** — Sodd is designed to be extended with custom types and validation functionality.
- **Zero dependencies**

Sodd aims to be a good alternative when you don't need the full power of Zod, and want something with a slightly smaller bundle footprint. Sodd should include most things you need to parse data the most common sources, such as JSON responses from HTTP requests, query params from the URL, or data from a form. See [the comparison with Zod](https://sodd.dev/introduction/zod-comparison) for more information.
