import {
  string,
  object,
  boolean,
  tuple,
  omit,
  optional,
  pick,
  merge,
  number,
  partial,
  deepPartial,
  record,
  literal,
  nullable,
  array,
  brand,
  enumeration,
  keyof,
  lazy,
  union,
  passthrough,
  required,
  strict,
  strip,
  any,
  unknown,
} from "@sodd/core";

const schema = object({
  name: string(),
  a: boolean(),
  b: tuple([string(), number()]),
  c: omit(
    object({
      d: string(),
      e: boolean(),
    }),
    ["e"]
  ),
  f: optional(
    object({
      g: string(),
      h: boolean(),
    })
  ),
  i: pick(
    object({
      a: string(),
    }),
    ["a"]
  ),
  j: merge(
    object({
      a: string(),
    }),
    object({
      b: number(),
    })
  ),
  k: partial(
    object({
      a: string(),
    })
  ),
  l: deepPartial(
    object({
      a: object({
        b: string(),
      }),
    })
  ),
  m: record(string()),
  n: literal("a"),
  o: nullable(string()),
  p: array(string()),
  q: brand(string(), "brand"),
  r: enumeration(["a", "b"]),
  s: keyof(
    object({
      a: string(),
      b: number(),
    })
  ),
  t: lazy(() => string()),
  v: union([string(), number()]),
  w: passthrough(object({ a: string() })),
  x: required(
    object({
      a: string(),
    })
  ),
  y: strict(
    object({
      a: string(),
    })
  ),
  z: strip(
    object({
      a: string(),
    })
  ),
  aa: any(),
  ab: unknown(),
});

function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            const result = schema.parse({});

            if (result.ok) {
              console.log(result.data);
            } else {
              console.log(result);

              result.issues.map((issue) => {
                issue.code === "missing_key";
              });
            }
          }}
        >
          test
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
