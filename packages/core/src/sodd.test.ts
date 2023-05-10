import {
  Brand,
  InferIssue,
  Infer,
  InvalidEnumValueIssue,
  InvalidLiteralIssue,
  InvalidTypeIssue,
  InvalidUnionIssue,
  LiteralSchema,
  MissingKeyIssue,
  NumberSchema,
  ObjectSchema,
  Result,
  Schema,
  StringSchema,
  TooBigIssue,
  TooSmallIssue,
  UnknownKeyIssue,
  any,
  array,
  boolean,
  brand,
  deepPartial,
  enumeration,
  keyof,
  lazy,
  literal,
  merge,
  nonEmpty,
  nullable,
  number,
  object,
  omit,
  optional,
  partial,
  passthrough,
  pick,
  record,
  required,
  strict,
  string,
  strip,
  tuple,
  union,
  unknown,
} from "./sodd";
import { test, expect } from "vitest";

export type Expect<T extends true> = T;

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

test("string", () => {
  const schema = string();

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, string>>,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse("asd")).toEqual({
    ok: true,
    data: "asd",
  });

  expect(schema.parse(123)).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        received: "number",
        expected: "string",
        path: [],
      },
    ],
  });
});

test("number", () => {
  const schema = number();

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, number>>,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse(123)).toEqual({
    ok: true,
    data: 123,
  });

  expect(schema.parse("asd")).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "number",
        received: "string",
        path: [],
      },
    ],
  });
});

test("boolean", () => {
  const schema = boolean();

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, boolean>>,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse(true)).toEqual({
    ok: true,
    data: true,
  });

  expect(schema.parse("asd")).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "boolean",
        received: "string",
        path: [],
      },
    ],
  });
});

test("literal", () => {
  const schema = literal("asd");

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, "asd">>,
    Expect<Equal<InferIssue<typeof schema>, InvalidLiteralIssue<"asd">>>
  ];

  expect(schema.parse("asd")).toEqual({
    ok: true,
    data: "asd",
  });

  expect(schema.parse("123")).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_literal",
        expected: "asd",
        received: "123",
        path: [],
      },
    ],
  });
});

test("array", () => {
  const schema = array(string());

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, string[]>>,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse(["asd", "123"])).toEqual({
    ok: true,
    data: ["asd", "123"],
  });

  expect(schema.parse(["asd", 123])).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: [1],
      },
    ],
  });
});

test("array with non-empty option", () => {
  const schema = array(string(), "non-empty");

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, [string, ...string[]]>>,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | TooSmallIssue>>
  ];

  expect(schema.parse(["asd", "123"])).toEqual({
    ok: true,
    data: ["asd", "123"],
  });

  expect(schema.parse([])).toEqual({
    ok: false,
    issues: [
      {
        code: "too_small",
        min: 1,
        value: 0,
        path: [],
      },
    ],
  });
});

test("nonEmpty", () => {
  const schema = nonEmpty(array(string()));

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, [string, ...string[]]>>,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | TooSmallIssue>>
  ];

  expect(schema.parse(["asd", "123"])).toEqual({
    ok: true,
    data: ["asd", "123"],
  });

  expect(schema.parse([])).toEqual({
    ok: false,
    issues: [
      {
        code: "too_small",
        min: 1,
        value: 0,
        path: [],
      },
    ],
  });
});

test("simple object", () => {
  const schema = object({
    foo: string(),
    bar: number(),
  });

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo: string;
          bar: number;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd", bar: 123 })).toEqual({
    ok: true,
    data: { foo: "asd", bar: 123 },
  });

  expect(schema.parse({ foo: "asd", bar: "123" })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "number",
        received: "string",
        path: ["bar"],
      },
    ],
  });
});

test("nested object", () => {
  const schema = object({
    foo: object({
      bar: string(),
    }),
  });

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo: { bar: string };
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: { bar: "asd" } })).toEqual({
    ok: true,
    data: { foo: { bar: "asd" } },
  });

  expect(schema.parse({ foo: { bar: 123 } })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["foo", "bar"],
      },
    ],
  });
});

test("object with strict behavior", () => {
  const schema = object(
    {
      foo: string(),
      bar: number(),
    },
    "strict"
  );

  type Type = Infer<typeof schema>;
  type Issue = InferIssue<typeof schema>;

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Type,
        {
          foo: string;
          bar: number;
        }
      >
    >,
    Expect<Equal<Issue, InvalidTypeIssue | MissingKeyIssue | UnknownKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd", bar: 123 })).toEqual({
    ok: true,
    data: { foo: "asd", bar: 123 },
  });

  expect(schema.parse({ foo: "asd", bar: "123" })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "number",
        received: "string",
        path: ["bar"],
      },
    ],
  });

  expect(schema.parse({ foo: "asd", bar: 123, baz: "123" })).toEqual({
    ok: false,
    issues: [
      {
        code: "unknown_key",
        key: "baz",
        path: [],
      },
    ],
  });
});

test("nested object with strict and strip behavior", () => {
  const schema = object({
    foo: object(
      {
        bar: string(),
      },
      "strict"
    ),
  });

  type Type = Infer<typeof schema>;
  type Issue = InferIssue<typeof schema>;

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Type,
        {
          foo: { bar: string };
        }
      >
    >,
    Expect<Equal<Issue, InvalidTypeIssue | MissingKeyIssue | UnknownKeyIssue>>
  ];

  expect(schema.parse({ foo: { bar: "asd" } })).toEqual({
    ok: true,
    data: { foo: { bar: "asd" } },
  });

  expect(schema.parse({ foo: { bar: "asd", baz: "123" } })).toEqual({
    ok: false,
    issues: [
      {
        code: "unknown_key",
        key: "baz",
        path: ["foo"],
      },
    ],
  });
});

test("object with passthrough behavior", () => {
  const schema = object(
    {
      foo: string(),
      bar: number(),
    },
    "passthrough"
  );

  type Type = Infer<typeof schema>;
  type Issue = InferIssue<typeof schema>;

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Type,
        {
          foo: string;
          bar: number;
        }
      >
    >,
    Expect<Equal<Issue, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd", bar: 123 })).toEqual({
    ok: true,
    data: { foo: "asd", bar: 123 },
  });

  expect(schema.parse({ foo: "asd", bar: "123" })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "number",
        received: "string",
        path: ["bar"],
      },
    ],
  });

  expect(schema.parse({ foo: "asd", bar: 123, baz: "123" })).toEqual({
    ok: true,
    data: { foo: "asd", bar: 123, baz: "123" },
  });
});

test("object strips extra fields by default", () => {
  const schema = object({
    foo: string(),
  });

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo: string;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd", bar: 123 })).toEqual({
    ok: true,
    data: { foo: "asd" },
  });
});

test("strict", () => {
  const schema = object({
    foo: string(),
    bar: strict(
      passthrough(
        object({
          baz: number(),
        })
      )
    ),
  });

  type Type = Infer<typeof schema>;
  type Issue = InferIssue<typeof schema>;

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Type,
        {
          foo: string;
          bar: {
            baz: number;
          };
        }
      >
    >,
    Expect<Equal<Issue, InvalidTypeIssue | MissingKeyIssue | UnknownKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd", bar: { baz: 123, lol: "123" } })).toEqual({
    ok: false,
    issues: [
      {
        code: "unknown_key",
        key: "lol",
        path: ["bar"],
      },
    ],
  });
});

test("passthrough", () => {
  const schema = object({
    foo: string(),
    bar: passthrough(
      strict(
        object({
          baz: number(),
        })
      )
    ),
  });

  type Type = Infer<typeof schema>;
  type Issue = InferIssue<typeof schema>;

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Type,
        {
          foo: string;
          bar: {
            baz: number;
          };
        }
      >
    >,
    Expect<Equal<Issue, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd", bar: { baz: 123, lol: "123" } })).toEqual({
    ok: true,
    data: { foo: "asd", bar: { baz: 123, lol: "123" } },
  });
});

test("strip", () => {
  const schema = object({
    foo: string(),
    bar: strip(
      strict(
        object(
          {
            baz: number(),
          },
          "passthrough"
        )
      )
    ),
  });

  type Type = Infer<typeof schema>;
  type Issue = InferIssue<typeof schema>;

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Type,
        {
          foo: string;
          bar: {
            baz: number;
          };
        }
      >
    >,
    Expect<Equal<Issue, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd", bar: { baz: 123, lol: "123" } })).toEqual({
    ok: true,
    data: { foo: "asd", bar: { baz: 123 } },
  });
});

test("required", () => {
  // separate schema because of bug
  // see "UnknownKeysBehavior bug" test
  const subSchema = deepPartial(
    object({
      baz: number(),
    })
  );

  const schema = required(
    object({
      foo: optional(string()),
      bar: subSchema,
    })
  );

  type Type = Infer<typeof schema>;
  type Issue = InferIssue<typeof schema>;

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Type,
        {
          foo: string;
          bar: {
            baz?: number;
          };
        }
      >
    >,
    Expect<Equal<Issue, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd", bar: { baz: 123 } })).toEqual({
    ok: true,
    data: { foo: "asd", bar: { baz: 123 } },
  });

  expect(schema.parse({})).toEqual({
    ok: false,
    issues: [
      {
        code: "missing_key",
        key: "foo",
        path: [],
      },
      {
        code: "missing_key",
        key: "bar",
        path: [],
      },
    ],
  });
});

// TODO fix this
test("UnknownKeysBehavior bug", () => {
  const schema = object({
    // when defined inline like this, and passed through a function (doesn't have to be deepPartial!),
    // TUnknownKeysBehavior is widened from "strip" to the entire union of UnknownKeysBehavior
    bar: deepPartial(
      object({
        baz: number(),
      })
    ),
  });

  type Type = Infer<typeof schema>;

  type Issue = InferIssue<typeof schema>; // UnknownKeyIssue shouldn't be present here

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Type,
        {
          bar: {
            baz?: number;
          };
        }
      >
    >,
    // @ts-expect-error :(
    Expect<Equal<Issue, InvalidTypeIssue | MissingKeyIssue>>
  ];

  // works as intended if defined outside of the object
  const subSchema = deepPartial(
    object({
      baz: number(),
    })
  );

  const schema2 = object({
    bar: subSchema,
  });

  type Type2 = Infer<typeof schema2>;
  type Issue2 = InferIssue<typeof schema2>;

  // @ts-ignore - noUnusedLocals
  type Assertions2 = [
    Expect<
      Equal<
        Type2,
        {
          bar: {
            baz?: number;
          };
        }
      >
    >,
    Expect<Equal<Issue2, InvalidTypeIssue | MissingKeyIssue>>
  ];
});

test("object with optional field", () => {
  const schema = object({
    foo: string(),
    bar: optional(number()),
  });

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo: string;
          bar?: number;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd" })).toEqual({
    ok: true,
    data: { foo: "asd" },
  });

  expect(schema.parse({ foo: "asd", bar: 123 })).toEqual({
    ok: true,
    data: { foo: "asd", bar: 123 },
  });

  expect(schema.parse({ foo: "asd", bar: "123" })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "number",
        received: "string",
        path: ["bar"],
      },
    ],
  });
});

test("object with only one optional field", () => {
  const schema = object({
    foo: optional(number()),
  });

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: number;
        }
      >
    >,
    // note: no MissingKeyIssue since all keys are optional
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];
});

test("union", () => {
  const schema = union([string(), number()]);

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, string | number>>,
    Expect<
      Equal<
        InferIssue<typeof schema>,
        InvalidUnionIssue<[StringSchema, NumberSchema]>
      >
    >
  ];

  expect(schema.parse("asd")).toEqual({
    ok: true,
    data: "asd",
  });

  expect(schema.parse(123)).toEqual({
    ok: true,
    data: 123,
  });

  expect(schema.parse(true)).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_union",
        issues: [
          {
            code: "invalid_type",
            expected: "string",
            received: "boolean",
            path: [],
          },
          {
            code: "invalid_type",
            expected: "number",
            received: "boolean",
            path: [],
          },
        ],
        path: [],
      },
    ],
  });
});

test("literal union", () => {
  const schema = union([literal("asd"), literal("123")]);

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, "asd" | "123">>,
    Expect<
      Equal<
        InferIssue<typeof schema>,
        InvalidUnionIssue<[LiteralSchema<"asd">, LiteralSchema<"123">]>
      >
    >
  ];

  expect(schema.parse("asd")).toEqual({
    ok: true,
    data: "asd",
  });

  expect(schema.parse(123)).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_union",
        issues: [
          {
            code: "invalid_literal",
            expected: "asd",
            received: 123,
            path: [],
          },
          {
            code: "invalid_literal",
            expected: "123",
            received: 123,
            path: [],
          },
        ],
        path: [],
      },
    ],
  });
});

test("enum", () => {
  const schema = enumeration(["asd", "123"]);

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, "asd" | "123">>,
    Expect<
      Equal<
        InferIssue<typeof schema>,
        InvalidTypeIssue | InvalidEnumValueIssue<["asd", "123"]>
      >
    >
  ];

  expect(schema.parse("asd")).toEqual({
    ok: true,
    data: "asd",
  });

  expect(schema.parse("lol")).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_enum_value",
        expected: ["asd", "123"],
        received: "lol",
        path: [],
      },
    ],
  });

  expect(schema.parse(123)).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: [],
      },
    ],
  });
});

test("brand", () => {
  const schema = brand(string(), "foo");

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, Brand<string, "foo">>>,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse("asd")).toEqual({
    ok: true,
    data: "asd",
  });

  expect(schema.parse(123)).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: [],
      },
    ],
  });
});

test("tuple", () => {
  const schema = tuple([string(), object({ foo: number() })]);

  type Type = Infer<typeof schema>;
  type Issue = InferIssue<typeof schema>;

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Type, [string, { foo: number }]>>,
    Expect<
      Equal<
        Issue,
        InvalidTypeIssue | TooBigIssue | TooSmallIssue | MissingKeyIssue
      >
    >
  ];

  expect(schema.parse(["asd", { foo: 123 }])).toEqual({
    ok: true,
    data: ["asd", { foo: 123 }],
  });

  expect(schema.parse(["asd", { foo: "123" }])).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "number",
        received: "string",
        path: [1, "foo"],
      },
    ],
  });

  expect(schema.parse(["asd"])).toEqual({
    ok: false,
    issues: [
      {
        code: "too_small",
        min: 2,
        value: 1,
        path: [],
      },
    ],
  });

  expect(schema.parse(["asd", { foo: 123 }, false])).toEqual({
    ok: false,
    issues: [
      {
        code: "too_big",
        max: 2,
        value: 3,
        path: [],
      },
    ],
  });
});

test("tuple with rest", () => {
  const schema = tuple([string(), object({ foo: number() })], number());

  type Type = Infer<typeof schema>;
  type Issue = InferIssue<typeof schema>;

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Type, [string, { foo: number }, ...number[]]>>,
    Expect<Equal<Issue, InvalidTypeIssue | TooSmallIssue | MissingKeyIssue>>
  ];

  expect(schema.parse(["asd", { foo: 123 }])).toEqual({
    ok: true,
    data: ["asd", { foo: 123 }],
  });

  expect(schema.parse(["asd"])).toEqual({
    ok: false,
    issues: [
      {
        code: "too_small",
        min: 2,
        value: 1,
        path: [],
      },
    ],
  });

  expect(schema.parse(["asd", { foo: 123 }, 456])).toEqual({
    ok: true,
    data: ["asd", { foo: 123 }, 456],
  });

  expect(schema.parse(["asd", { foo: 123 }, false])).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "number",
        received: "boolean",
        path: [2],
      },
    ],
  });
});

test("record", () => {
  const schema = record(string());

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, Record<string, string>>>,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse({ foo: "asd" })).toEqual({
    ok: true,
    data: { foo: "asd" },
  });

  expect(schema.parse({ foo: 123 })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["foo"],
      },
    ],
  });
});

test("lazy", () => {
  type Category = {
    subcategories: Category[];
  };

  const categorySchema: Schema<Category, InvalidTypeIssue | MissingKeyIssue> =
    object({
      subcategories: array(lazy(() => categorySchema)),
    });

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof categorySchema>, Category>>,
    Expect<
      Equal<
        InferIssue<typeof categorySchema>,
        InvalidTypeIssue | MissingKeyIssue
      >
    >
  ];

  expect(categorySchema.parse({ subcategories: [] })).toEqual({
    ok: true,
    data: { subcategories: [] },
  });
});

test("nullable", () => {
  const schema = object({
    foo: nullable(string()),
  });

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo: string | null;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: null })).toEqual({
    ok: true,
    data: { foo: null },
  });

  expect(schema.parse({ foo: "asd" })).toEqual({
    ok: true,
    data: { foo: "asd" },
  });

  expect(schema.parse({ foo: 123 })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["foo"],
      },
    ],
  });

  expect(schema.parse({})).toEqual({
    ok: false,
    issues: [
      {
        code: "missing_key",
        key: "foo",
        path: [],
      },
    ],
  });

  expect(schema.parse({ foo: undefined })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        received: "undefined",
        path: ["foo"],
      },
    ],
  });
});

test("nullable null", () => {
  const schema = object({
    foo: nullable(),
  });

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo: null;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: null })).toEqual({
    ok: true,
    data: { foo: null },
  });

  expect(schema.parse({ foo: "asd" })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "null",
        received: "string",
        path: ["foo"],
      },
    ],
  });
});

test("pick", () => {
  const schema = pick(object({ foo: string(), bar: number() }), ["foo"]);

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo: string;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd" })).toEqual({
    ok: true,
    data: { foo: "asd" },
  });

  expect(schema.parse({ foo: "asd", bar: 123 })).toEqual({
    ok: true,
    data: { foo: "asd" },
  });

  expect(schema.parse({ bar: 123 })).toEqual({
    ok: false,
    issues: [
      {
        code: "missing_key",
        key: "foo",
        path: [],
      },
    ],
  });
});

test("omit", () => {
  const schema = omit(object({ foo: string(), bar: number() }), ["foo"]);

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          bar: number;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd", bar: 123 })).toEqual({
    ok: true,
    data: { bar: 123 },
  });

  expect(schema.parse({ bar: 123 })).toEqual({
    ok: true,
    data: { bar: 123 },
  });

  expect(schema.parse({ foo: "asd" })).toEqual({
    ok: false,
    issues: [
      {
        code: "missing_key",
        key: "bar",
        path: [],
      },
    ],
  });
});

test("merge", () => {
  const schema = merge(object({ foo: string() }), object({ bar: number() }));

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo: string;
          bar: number;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({ foo: "asd", bar: 123 })).toEqual({
    ok: true,
    data: { foo: "asd", bar: 123 },
  });

  expect(schema.parse({ foo: "asd" })).toEqual({
    ok: false,
    issues: [
      {
        code: "missing_key",
        key: "bar",
        path: [],
      },
    ],
  });
});

test("keyof", () => {
  const schema = keyof(
    object({
      foo: string(),
      bar: number(),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, "foo" | "bar">>,
    Expect<
      Equal<
        InferIssue<typeof schema>,
        InvalidTypeIssue | InvalidEnumValueIssue<["foo", "bar"]>
      >
    >
  ];

  expect(schema.parse("foo")).toEqual({
    ok: true,
    data: "foo",
  });

  expect(schema.parse("bar")).toEqual({
    ok: true,
    data: "bar",
  });

  expect(schema.parse("baz")).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_enum_value",
        expected: ["foo", "bar"],
        received: "baz",
        path: [],
      },
    ],
  });
});

test("partial", () => {
  const schema = partial(object({ foo: string() }));

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: string;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse({ foo: "asd" })).toEqual({
    ok: true,
    data: { foo: "asd" },
  });

  expect(schema.parse({ foo: 123 })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["foo"],
      },
    ],
  });
});

test("partial with nested properties", () => {
  const schema = partial(
    object({
      foo: object({
        bar: string(),
      }),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: { bar: string };
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse({ foo: { bar: "asd" } })).toEqual({
    ok: true,
    data: { foo: { bar: "asd" } },
  });

  expect(schema.parse({ foo: { bar: 123 } })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        path: ["foo", "bar"],
        expected: "string",
        received: "number",
      },
    ],
  });
});

test("deep partial limitation", () => {
  const schema = deepPartial(
    object({
      foo: object({
        bar: union([object({ baz: string() }), object({ bux: number() })]),
      }),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      // @ts-expect-error - this is a limitation in Zod as well.
      // Note the difference below
      // can it actually be supported tho?
      Equal<
        Infer<typeof schema>,
        {
          foo?: { bar?: { baz?: string } | { bux?: number } };
        }
      >
    >,
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: { bar?: { baz: string } | { bux: number } };
        }
      >
    >,
    // similarly, this will implicitly include a MissingKeysIssue, since it's ObjectSchemas inside
    Expect<
      Equal<
        InferIssue<typeof schema>,
        | InvalidTypeIssue
        | InvalidUnionIssue<
            [
              ObjectSchema<
                {
                  baz: StringSchema;
                },
                "strip"
              >,
              ObjectSchema<
                {
                  bux: NumberSchema;
                },
                "strip"
              >
            ]
          >
      >
    >
  ];
});

test("deep partial with nested object", () => {
  const schema = deepPartial(
    object({
      foo: object({
        bar: object({
          baz: string(),
        }),
      }),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: { bar?: { baz?: string } };
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse({ foo: {} })).toEqual({
    ok: true,
    data: { foo: {} },
  });

  expect(schema.parse({ foo: { bar: {} } })).toEqual({
    ok: true,
    data: { foo: { bar: {} } },
  });

  expect(schema.parse({ foo: { bar: { baz: "asd" } } })).toEqual({
    ok: true,
    data: { foo: { bar: { baz: "asd" } } },
  });

  expect(schema.parse({ foo: { bar: { baz: 123 } } })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_type",
        path: ["foo", "bar", "baz"],
        expected: "string",
        received: "number",
      },
    ],
  });
});

test("deep partial with nested array", () => {
  const schema = deepPartial(
    object({
      foo: object({
        bar: array(object({ baz: string() })),
      }),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: { bar?: { baz?: string }[] };
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse({ foo: {} })).toEqual({
    ok: true,
    data: { foo: {} },
  });

  expect(schema.parse({ foo: { bar: [] } })).toEqual({
    ok: true,
    data: { foo: { bar: [] } },
  });

  expect(schema.parse({ foo: { bar: [{ baz: "asd" }] } })).toEqual({
    ok: true,
    data: { foo: { bar: [{ baz: "asd" }] } },
  });
});

test("deep partial with nested tuple", () => {
  const schema = deepPartial(
    object({
      foo: object({
        bar: tuple([
          object({
            baz: string(),
          }),
          object({
            bux: number(),
          }),
        ]),
      }),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: { bar?: [{ baz?: string }, { bux?: number }] };
        }
      >
    >,
    Expect<
      Equal<
        InferIssue<typeof schema>,
        InvalidTypeIssue | TooBigIssue | TooSmallIssue
      >
    >
  ];

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse({ foo: {} })).toEqual({
    ok: true,
    data: { foo: {} },
  });

  expect(schema.parse({ foo: { bar: [{}, {}] } })).toEqual({
    ok: true,
    data: { foo: { bar: [{}, {}] } },
  });

  expect(schema.parse({ foo: { bar: [{ baz: "asd" }, {}] } })).toEqual({
    ok: true,
    data: { foo: { bar: [{ baz: "asd" }, {}] } },
  });
});

test("deep partial with optional", () => {
  const schema = deepPartial(
    object({
      foo: object({
        bar: optional(object({ baz: string() })),
      }),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: { bar?: { baz?: string } };
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse({ foo: {} })).toEqual({
    ok: true,
    data: { foo: {} },
  });

  expect(schema.parse({ foo: { bar: {} } })).toEqual({
    ok: true,
    data: { foo: { bar: {} } },
  });

  expect(schema.parse({ foo: { bar: { baz: "asd" } } })).toEqual({
    ok: true,
    data: { foo: { bar: { baz: "asd" } } },
  });
});

test("deep partial with nullable", () => {
  const schema = deepPartial(
    object({
      foo: nullable(
        object({
          bar: object({
            baz: string(),
          }),
        })
      ),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: { bar?: { baz?: string } } | null;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse({ foo: null })).toEqual({
    ok: true,
    data: { foo: null },
  });

  expect(schema.parse({ foo: {} })).toEqual({
    ok: true,
    data: { foo: {} },
  });

  expect(schema.parse({ foo: { bar: {} } })).toEqual({
    ok: true,
    data: { foo: { bar: {} } },
  });

  expect(schema.parse({ foo: { bar: { baz: "asd" } } })).toEqual({
    ok: true,
    data: { foo: { bar: { baz: "asd" } } },
  });
});

test("deep partial with record of tuples", () => {
  const schema = deepPartial(
    object({
      foo: record(
        tuple([
          object({
            bar: string(),
          }),
          number(),
        ])
      ),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: Record<string, [{ bar?: string }, number]>;
        }
      >
    >,
    Expect<
      Equal<
        InferIssue<typeof schema>,
        InvalidTypeIssue | TooBigIssue | TooSmallIssue
      >
    >
  ];
});

test("deep partial with record", () => {
  const schema = deepPartial(
    object({
      foo: record(object({ baz: string() })),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: Record<string, { baz?: string }>;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue>>
  ];

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse({ foo: {} })).toEqual({
    ok: true,
    data: { foo: {} },
  });

  expect(schema.parse({ foo: { bar: {} } })).toEqual({
    ok: true,
    data: { foo: { bar: {} } },
  });

  expect(schema.parse({ foo: { bar: { baz: "asd" } } })).toEqual({
    ok: true,
    data: { foo: { bar: { baz: "asd" } } },
  });
});

// can this be fixed?
test("deep partial does not apply to lazy", () => {
  type Category = {
    subcategories: Category[];
  };

  const categorySchema: Schema<Category, InvalidTypeIssue | MissingKeyIssue> =
    object({
      subcategories: array(lazy(() => categorySchema)),
    });

  const postSchema = deepPartial(
    object({
      category: categorySchema,
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof postSchema>,
        {
          category?: Category;
        }
      >
    >,
    // _desired_ behavior is that MissingKeysIssue is not present
    Expect<
      Equal<InferIssue<typeof postSchema>, InvalidTypeIssue | MissingKeyIssue>
    >
  ];
});

test("deep partial does not apply to brand", () => {
  const schema = deepPartial(
    object({
      foo: brand(
        object({
          bar: string(),
        }),
        "baz"
      ),
    })
  );

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          foo?: Brand<{ bar: string }, "baz">;
        }
      >
    >,
    Expect<Equal<InferIssue<typeof schema>, InvalidTypeIssue | MissingKeyIssue>>
  ];

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse({ foo: { bar: "asd" } })).toEqual({
    ok: true,
    data: { foo: { bar: "asd" } },
  });

  expect(schema.parse({ foo: {} })).toEqual({
    ok: false,
    issues: [
      {
        code: "missing_key",
        key: "bar",
        path: ["foo"],
      },
    ],
  });
});

test("any", () => {
  const schema = any();

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, any>>,
    Expect<Equal<InferIssue<typeof schema>, never>>
  ];

  expect(schema.parse(1)).toEqual({
    ok: true,
    data: 1,
  });

  expect(schema.parse("asd")).toEqual({
    ok: true,
    data: "asd",
  });

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse(undefined)).toEqual({
    ok: true,
    data: undefined,
  });
});

test("unknown", () => {
  const schema = unknown();

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<Equal<Infer<typeof schema>, unknown>>,
    Expect<Equal<InferIssue<typeof schema>, never>>
  ];

  expect(schema.parse(1)).toEqual({
    ok: true,
    data: 1,
  });

  expect(schema.parse("asd")).toEqual({
    ok: true,
    data: "asd",
  });

  expect(schema.parse({})).toEqual({
    ok: true,
    data: {},
  });

  expect(schema.parse(undefined)).toEqual({
    ok: true,
    data: undefined,
  });
});

test("realistic-ish example", () => {
  const userSchema = object({
    id: string(),
    name: string(),
    location: tuple([string(), string()]),
  });

  const reactionMapSchema = object({
    thumbsUp: number(),
    laugh: number(),
    cry: number(),
  });

  const reactionSchema = keyof(reactionMapSchema);

  type Comment = {
    id: string;
    user: Infer<typeof userSchema>;
    content: string;
    comments: Comment[];
    yourReaction?: Infer<typeof reactionSchema>;
    reactions: Infer<typeof reactionMapSchema>;
  };

  const commentSchema: Schema<
    Comment,
    | MissingKeyIssue
    | InvalidTypeIssue
    | TooBigIssue
    | TooSmallIssue
    | InvalidEnumValueIssue<["thumbsUp", "laugh", "cry"]>
  > = object({
    id: string(),
    user: userSchema,
    content: string(),
    yourReaction: optional(reactionSchema),
    reactions: reactionMapSchema,
    comments: lazy(() => array(commentSchema)),
  });

  const postSchema = object({
    id: string(),
    title: string(),
    user: userSchema,
    content: string(),
    yourReaction: optional(reactionSchema),
    reactions: reactionMapSchema,
    tags: array(string()),
    comments: array(commentSchema),
  });

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof postSchema>,
        {
          id: string;
          title: string;
          user: {
            id: string;
            name: string;
            location: [string, string];
          };
          content: string;
          yourReaction?: "thumbsUp" | "laugh" | "cry";
          reactions: {
            thumbsUp: number;
            laugh: number;
            cry: number;
          };
          tags: string[];
          comments: Comment[];
        }
      >
    >,
    Expect<
      Equal<
        InferIssue<typeof postSchema>,
        | InvalidTypeIssue
        | MissingKeyIssue
        | TooBigIssue
        | TooSmallIssue
        | InvalidEnumValueIssue<["thumbsUp", "laugh", "cry"]>
      >
    >
  ];

  const post = {
    id: "123",
    title: "Hello world",
    user: {
      id: "123",
      name: "John Doe",
      location: ["London", "UK"],
    },
    content: "Lorem ipsum",
    yourReaction: "thumbsUp",
    reactions: {
      thumbsUp: 1,
      laugh: 0,
      cry: 0,
    },
    tags: ["hello", "world"],
    comments: [
      {
        id: "123",
        user: {
          id: "123",
          name: "John Doe",
          location: ["London", "UK"],
        },
        content: "Lorem ipsum",
        reactions: {
          thumbsUp: 1,
          laugh: 0,
          cry: 0,
        },
        comments: [
          {
            id: "123",
            user: {
              id: "123",
              name: "John Doe",
              location: ["London", "UK"],
            },
            content: "Lorem ipsum",
            yourReaction: "thumbsUp",
            reactions: {
              thumbsUp: 1,
              laugh: 0,
              cry: 0,
            },
            comments: [],
          },
        ],
      },
    ],
  };

  expect(postSchema.parse(post)).toEqual({
    ok: true,
    data: post,
  });
});

test("custom schema example", () => {
  interface InvalidEmailIssue {
    code: "invalid_email";
    received: unknown;
    path: Array<string | number>;
  }

  const emailSchema = {
    type: "string",
    parse: (
      input: unknown
    ): Result<string, InvalidEmailIssue | InferIssue<StringSchema>> => {
      const result = string().parse(input);

      if (!result.ok) {
        return result;
      }

      if (result.data.includes("@")) {
        return {
          ok: true,
          data: result.data,
        };
      } else {
        return {
          ok: false,
          issues: [
            {
              code: "invalid_email",
              received: input,
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

  // @ts-ignore - noUnusedLocals
  type Assertions = [
    Expect<
      Equal<
        Infer<typeof schema>,
        {
          email: string;
        }
      >
    >,
    Expect<
      Equal<
        InferIssue<typeof schema>,
        InvalidTypeIssue | InvalidEmailIssue | MissingKeyIssue
      >
    >
  ];

  expect(schema.parse({ email: "test@example.com" })).toEqual({
    ok: true,
    data: { email: "test@example.com" },
  });

  expect(schema.parse({ email: "test" })).toEqual({
    ok: false,
    issues: [
      {
        code: "invalid_email",
        received: "test",
        path: ["email"],
      },
    ],
  });
});
