const _string = "string";
const _number = "number";
const _boolean = "boolean";
const _object = "object";
const _array = "array";
const _nullable = "nullable";
const _optional = "optional";
const _literal = "literal";
const _union = "union";
const _record = "record";
const _tuple = "tuple";
const _enumeration = "enumeration";
const _brand = "brand";
const _lazy = "lazy";

/**
 * @link https://sodd.dev/api/Infer
 */
export type Infer<TSchema extends Schema> = Extract<
  ReturnType<TSchema["parse"]>,
  { ok: true }
>["data"];

/**
 * @link https://sodd.dev/api/InferIssue
 */
export type InferIssue<TSchema extends Schema> = ReturnType<
  TSchema["parse"]
> extends Result<unknown, infer TIssue>
  ? TIssue
  : never;

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type Schema<T = unknown, TIssue extends BaseIssue = BaseIssue> = {
  type: string;
  parse: (input: unknown) => Result<T, TIssue>;
};

const invalid_type = "invalid_type";
const invalid_literal = "invalid_literal";
const too_small = "too_small";
const too_big = "too_big";
const missing_key = "missing_key";
const invalid_enum_value = "invalid_enum_value";
const invalid_union = "invalid_union";
const unknown_key = "unknown_key";

interface BaseIssue {
  path: Array<string | number>;
  code: string;
}

/**
 * @link https://sodd.dev/api/issues/InvalidTypeIssue
 */
export interface InvalidTypeIssue extends BaseIssue {
  code: typeof invalid_type;
  expected: string;
  received: string;
}

const invalidType = (
  expected: string,
  received: string,
  path: Array<string | number> = []
): InvalidTypeIssue => ({
  code: invalid_type,
  expected,
  received,
  path,
});

/**
 * @link https://sodd.dev/api/issues/InvalidLiteralIssue
 */
export interface InvalidLiteralIssue<Literal extends string | number | boolean>
  extends BaseIssue {
  code: typeof invalid_literal;
  expected: Literal;
  received: unknown;
}

/**
 * @link https://sodd.dev/api/issues/MissingKeyIssue
 */
export interface MissingKeyIssue extends BaseIssue {
  code: typeof missing_key;
  key: string;
}

/**
 * @link https://sodd.dev/api/issues/InvalidEnumValueIssue
 */
export interface InvalidEnumValueIssue<
  Enumerations extends ReadonlyArray<string>
> extends BaseIssue {
  code: typeof invalid_enum_value;
  expected: Enumerations;
  received: unknown;
}

/**
 * @link https://sodd.dev/api/issues/InvalidUnionIssue
 */
export interface InvalidUnionIssue<
  Schemas extends [Schema, Schema, ...Schema[]]
> extends BaseIssue {
  code: typeof invalid_union;
  issues: InferIssue<Schemas[number]>[];
}

/**
 * @link https://sodd.dev/api/issues/TooBigIssue
 */
export interface TooBigIssue extends BaseIssue {
  code: typeof too_big;
  max: number;
  value: number;
}

/**
 * @link https://sodd.dev/api/issues/TooSmallIssue
 */
export interface TooSmallIssue extends BaseIssue {
  code: typeof too_small;
  min: number;
  value: number;
}

/**
 * @link https://sodd.dev/api/issues/UnknownKeyIssue
 */
export interface UnknownKeyIssue extends BaseIssue {
  code: typeof unknown_key;
  key: string;
}

type ErrorResult<TIssue extends BaseIssue> = {
  ok: false;
  issues: TIssue[];
};

type SuccessResult<T> = {
  ok: true;
  data: T;
};

export type Result<T, TIssue extends BaseIssue> =
  | SuccessResult<T>
  | ErrorResult<TIssue>;

const ok = <T>(data: T): SuccessResult<T> => ({
  ok: true,
  data,
});

const err = <TIssue extends BaseIssue>(
  issues: TIssue[]
): ErrorResult<TIssue> => ({
  ok: false,
  issues,
});

const getParsedType = (data: unknown) => {
  const t = typeof data;

  switch (t) {
    case _number:
      return isNaN(data as number) ? "NaN" : _number;
    case _object:
      if (Array.isArray(data)) {
        return _array;
      }
      if (data === null) {
        return "null";
      }
      return _object;
    case "undefined":
    case _string:
    case _boolean:
    case "function":
    case "bigint":
    case "symbol":
    default:
      return t;
  }
};

const parseString = (input: unknown): Result<string, InvalidTypeIssue> => {
  if (typeof input === _string) {
    return ok(input as string);
  } else {
    return err([invalidType(_string, getParsedType(input))]);
  }
};

export type StringSchema = {
  type: typeof _string;
  parse: typeof parseString;
};

/**
 * @link https://sodd.dev/api/schemas/string
 */
export const string = (): StringSchema => {
  return {
    type: _string,
    parse: parseString,
  };
};

const parseNumber = (input: unknown): Result<number, InvalidTypeIssue> => {
  const parsedType = getParsedType(input);
  if (parsedType === "number") {
    return ok(input as number);
  } else {
    return err([invalidType(_number, parsedType)]);
  }
};

export type NumberSchema = {
  type: typeof _number;
  parse: typeof parseNumber;
};

/**
 * @link https://sodd.dev/api/schemas/number
 */
export const number = (): NumberSchema => ({
  type: _number,
  parse: parseNumber,
});

const parseBoolean = (input: unknown): Result<boolean, InvalidTypeIssue> => {
  if (typeof input === _boolean) {
    return ok(input as boolean);
  } else {
    return err([invalidType(_boolean, getParsedType(input))]);
  }
};

export type BooleanSchema = {
  type: typeof _boolean;
  parse: typeof parseBoolean;
};

/**
 * @link https://sodd.dev/api/schemas/boolean
 */
export const boolean = (): BooleanSchema => ({
  type: _boolean,
  parse: parseBoolean,
});

export type LiteralSchema<Value extends string | number | boolean> = {
  type: typeof _literal;
  parse: (input: unknown) => Result<Value, InvalidLiteralIssue<Value>>;
};

/**
 * @link https://sodd.dev/api/schemas/literal
 */
export const literal = <Type extends string | number | boolean>(
  type: Type
): LiteralSchema<Type> => ({
  type: _literal,
  parse: (input: unknown) => {
    if (input === type) {
      return ok(type);
    } else {
      const issue: InvalidLiteralIssue<Type> = {
        code: invalid_literal,
        path: [],
        expected: type,
        received: input,
      };
      return err([issue]);
    }
  },
});

type ArrayCardinality = "many" | "non-empty";

export type ArraySchema<
  TSchema extends Schema,
  Cardinality extends ArrayCardinality
> = {
  type: typeof _array;
  schema: TSchema;
  cardinality: Cardinality;
  parse: (
    input: unknown
  ) => Result<
    Cardinality extends "many"
      ? Array<Infer<TSchema>>
      : NonEmptyArray<Infer<TSchema>>,
    | InvalidTypeIssue
    | (Cardinality extends "non-empty" ? TooSmallIssue : never)
    | InferIssue<TSchema>
  >;
};

type NonEmptyArray<T> = [T, ...T[]];

/**
 * @link https://sodd.dev/api/schemas/array
 */
export const array = <
  TSchema extends Schema,
  Cardinality extends ArrayCardinality = never
>(
  schema: TSchema,
  cardinality?: Cardinality
): ArraySchema<
  TSchema,
  [Cardinality] extends [never] ? "many" : Cardinality
> => ({
  type: _array,
  schema,
  cardinality: cardinality ?? ("many" as any),
  parse: (input: unknown) => {
    if (Array.isArray(input)) {
      if (input.length === 0 && cardinality === "non-empty") {
        return err([
          {
            code: too_small,
            min: 1,
            path: [],
            value: 0,
          },
        ]);
      }

      const issues: BaseIssue[] = [];
      const newArray: Array<Infer<TSchema>> = [];
      for (let i = 0; i < input.length; i++) {
        const item = input[i];
        const result = schema.parse(item);
        if (result.ok) {
          // @ts-ignore
          newArray.push(result.data);
        } else {
          issues.push(
            ...result.issues.map(
              (issue) =>
                ({
                  ...issue,
                  path: [i, ...issue.path],
                } as BaseIssue)
            )
          );
        }
      }
      if (issues.length) {
        return err(issues);
      } else {
        return ok(newArray);
      }
    } else {
      return err([invalidType(_array, getParsedType(input))]) as any;
    }
  },
});

export type TupleSchema<
  Schemas extends [Schema] | [...Schema[]],
  Rest extends Schema | null = null
> = {
  type: typeof _tuple;
  schemas: Schemas;
  parse: (
    input: unknown
  ) => Result<
    Rest extends Schema
      ? [
          ...AssertArray<{ [Key in keyof Schemas]: Infer<Schemas[Key]> }>,
          ...Infer<Rest>[]
        ]
      : AssertArray<{ [Key in keyof Schemas]: Infer<Schemas[Key]> }>,
    | InvalidTypeIssue
    | (Rest extends Schema ? never : TooBigIssue)
    | TooSmallIssue
    | InferIssue<Schemas[number]>
    | (Rest extends Schema ? InferIssue<Rest> : never)
  >;
};

/**
 * @link https://sodd.dev/api/schemas/tuple
 */
export function tuple<Schemas extends [Schema] | [...Schema[]]>(
  schemas: Schemas
): TupleSchema<Schemas>;
export function tuple<
  Schemas extends [Schema] | [...Schema[]],
  Rest extends Schema
>(schemas: Schemas, rest: Rest): TupleSchema<Schemas, Rest>;
export function tuple<
  Schemas extends [Schema] | [...Schema[]],
  Rest extends Schema
>(schemas: Schemas, rest?: Rest): TupleSchema<Schemas, Rest> {
  return {
    type: _tuple,
    schemas,
    parse: (input: unknown) => {
      const issues: InferIssue<TupleSchema<Schemas, Rest>>[] = [];
      const newTuple: any[] = [];

      if (Array.isArray(input)) {
        // if length checks doesn't pass, we bail early,
        // but maybe it's desirable to also check the schemas?

        if (input.length < schemas.length) {
          issues.push({
            code: too_small,
            min: schemas.length,
            path: [],
            value: input.length,
          });
        } else if (input.length > schemas.length && !rest) {
          issues.push({
            code: too_big,
            max: schemas.length,
            path: [],
            value: input.length,
          } as any);
        } else {
          for (let i = 0; i < input.length; i++) {
            const schema = schemas[i] ?? rest;
            if (schema) {
              const result = schema.parse(input[i]);
              if (result.ok) {
                (newTuple as any)[i] = result.data;
              } else {
                issues.push(
                  ...result.issues.map(
                    (issue) =>
                      ({
                        ...issue,
                        path: [i, ...issue.path],
                      } as any)
                  )
                );
              }
            } else {
              throw new Error(
                "Internal Sodd error: schema is undefined. Please report this issue."
              );
            }
          }
        }
      } else {
        issues.push(invalidType(_array, getParsedType(input)));
      }

      if (issues.length) {
        return err(issues);
      } else {
        return ok(newTuple as any);
      }
    },
  };
}

export type RecordSchema<TSchema extends Schema> = {
  type: typeof _record;
  schema: TSchema;
  parse: (
    input: unknown
  ) => Result<
    { [key: string]: Infer<TSchema> },
    InferIssue<TSchema> | InvalidTypeIssue
  >;
};

/**
 * @link https://sodd.dev/api/schemas/record
 */
export const record = <TSchema extends Schema>(
  schema: TSchema
): RecordSchema<TSchema> => {
  return {
    type: _record,
    schema,
    parse: (input: unknown) => {
      if (typeof input === _object && input !== null) {
        const issues: InferIssue<TSchema>[] = [];
        const newRecord: { [key: string]: Infer<TSchema> } = {};
        for (const key in input as object) {
          const result = schema.parse((input as any)[key] as any);
          if (result.ok) {
            newRecord[key] = result.data;
          } else {
            issues.push(
              ...result.issues.map(
                (issue) =>
                  ({
                    ...issue,
                    path: [key, ...issue.path],
                  } as InferIssue<TSchema>)
              )
            );
          }
        }
        if (issues.length) {
          return err(issues);
        } else {
          return ok(newRecord);
        }
      } else {
        return err([invalidType(_object, getParsedType(input))]);
      }
    },
  };
};

type ObjectDefinition = { [key: string]: Schema };

type OptionalKeys<Definition extends ObjectDefinition> = {
  [Key in keyof Definition]: Definition[Key] extends OptionalSchema<any>
    ? Key
    : never;
}[keyof Definition];

export type ObjectSchema<
  Definition extends ObjectDefinition = ObjectDefinition,
  TUnknownKeysBehaviour extends UnknownKeysBehavior = UnknownKeysBehavior
> = {
  type: typeof _object;
  definition: Definition;
  unknownKeysBehavior: TUnknownKeysBehaviour;
  parse: (input: unknown) => Result<
    Expand<
      Omit<
        {
          [Key in keyof Definition]: Infer<Definition[Key]>;
        },
        OptionalKeys<Definition>
      > & {
        [Key in OptionalKeys<Definition>]?: Infer<Definition[Key]>;
      }
    >,
    | {
        [Key in keyof Definition]: InferIssue<Definition[Key]>;
      }[keyof Definition]
    | InvalidTypeIssue
    | (TUnknownKeysBehaviour extends "strict" ? UnknownKeyIssue : never)
    // if all keys have been made optional, MissingKeyIssue cannot occur
    | (Exclude<keyof Definition, OptionalKeys<Definition>> extends never
        ? never
        : MissingKeyIssue)
  >;
};

type GetDefinition<
  TObjectSchema extends ObjectSchema<ObjectDefinition, UnknownKeysBehavior>
> = TObjectSchema extends ObjectSchema<infer Definition, UnknownKeysBehavior>
  ? Definition
  : never;

type GetUnknownKeysBehavior<
  TObjectSchema extends ObjectSchema<ObjectDefinition, UnknownKeysBehavior>
> = TObjectSchema extends ObjectSchema<
  ObjectDefinition,
  infer TUnknownKeysBehavior
>
  ? TUnknownKeysBehavior
  : never;

type UnknownKeysBehavior = "passthrough" | "strict" | "strip";

/**
 * @link https://sodd.dev/api/schemas/object
 */
export const object = <
  Definition extends ObjectDefinition,
  TUnknownKeysBehavior extends UnknownKeysBehavior = never
>(
  definition: Definition,
  unknownKeysBehavior?: TUnknownKeysBehavior
): ObjectSchema<
  Definition,
  [TUnknownKeysBehavior] extends [never] ? "strip" : TUnknownKeysBehavior
> => ({
  type: _object,
  definition,
  unknownKeysBehavior: unknownKeysBehavior ?? ("strip" as any),
  parse: (input) => {
    const issues: InferIssue<ObjectSchema<Definition, TUnknownKeysBehavior>>[] =
      [];
    const newObj = {};

    if (!!input && typeof input === _object) {
      const definitionKeys = new Set(Object.keys(definition));

      const unknownKeys = Object.keys(input as object).filter(
        (key) => !definitionKeys.has(key)
      );

      for (const key of definitionKeys) {
        if (key in (input as object)) {
          const val = definition[key].parse(
            (input as Record<string, unknown>)[key]
          );

          if (val.ok) {
            // @ts-ignore
            newObj[key] = val.data;
          } else {
            issues.push(
              ...val.issues.map(
                (issue) =>
                  ({
                    ...issue,
                    path: [key, ...issue.path],
                  } as any)
              )
            );
          }
        } else {
          if (definition[key].type === "optional") {
            continue;
          } else {
            const issue: MissingKeyIssue = {
              code: missing_key,
              key,
              path: [],
            };
            issues.push(issue as any);
          }
        }
      }

      const resolvedUnknownKeysBehavior: UnknownKeysBehavior =
        unknownKeysBehavior ?? "strip";
      if (resolvedUnknownKeysBehavior === "passthrough") {
        for (const key of unknownKeys) {
          // @ts-ignore
          newObj[key] = (input as Record<string, unknown>)[key];
        }
      } else if (resolvedUnknownKeysBehavior === "strict") {
        for (const key of unknownKeys) {
          const issue: UnknownKeyIssue = {
            code: unknown_key,
            key,
            path: [],
          };
          issues.push(issue as any);
        }
      } else if (resolvedUnknownKeysBehavior === "strip") {
        // do nothing
      }
    } else {
      issues.push(invalidType(_object, getParsedType(input)));
    }

    if (issues.length > 0) {
      return err(issues as any);
    } else {
      return ok(newObj as any);
    }
  },
});

/**
 * @link https://sodd.dev/api/schemas/object/strict
 */
export const strict = <TObjectSchema extends ObjectSchema>(
  schema: TObjectSchema
): ObjectSchema<GetDefinition<TObjectSchema>, "strict"> =>
  object(schema.definition, "strict" as any) as any;

/**
 * @link https://sodd.dev/api/schemas/object/passthrough
 */
export const passthrough = <TObjectSchema extends ObjectSchema>(
  schema: TObjectSchema
): ObjectSchema<GetDefinition<TObjectSchema>, "passthrough"> =>
  object(schema.definition, "passthrough" as any) as any;

/**
 * @link https://sodd.dev/api/schemas/object/strip
 */
export const strip = <TObjectSchema extends ObjectSchema>(
  schema: TObjectSchema
): ObjectSchema<GetDefinition<TObjectSchema>, "strip"> =>
  object(schema.definition, "strip" as any) as any;

type WithoutOptionalSchema<TSchema extends Schema> =
  TSchema extends OptionalSchema<infer OSchema>
    ? WithoutOptionalSchema<OSchema>
    : TSchema;

/**
 * @link https://sodd.dev/api/schemas/object/required
 */
export const required = <TObjectSchema extends ObjectSchema>(
  schema: TObjectSchema
): ObjectSchema<
  {
    [Key in keyof GetDefinition<TObjectSchema>]: WithoutOptionalSchema<
      GetDefinition<TObjectSchema>[Key]
    >;
  },
  GetUnknownKeysBehavior<TObjectSchema>
> => {
  const newDefinition = {} as any;

  for (const key in schema.definition) {
    const val = schema.definition[key];
    if (val.type === _optional) {
      newDefinition[key] = (val as any).schema;
    } else {
      newDefinition[key] = val;
    }
  }

  return object(newDefinition, schema.unknownKeysBehavior) as any;
};

export type OptionalSchema<TSchema extends Schema> = {
  type: typeof _optional;
  schema: TSchema;
  parse: (
    input: unknown
  ) => Result<Infer<TSchema> | undefined, InferIssue<TSchema>>;
};

/**
 * @link https://sodd.dev/api/schemas/optional
 */
export const optional = <TSchema extends Schema>(
  schema: TSchema
): OptionalSchema<TSchema> => ({
  type: _optional,
  schema,
  parse: (input: unknown) => {
    if (input === undefined) {
      return ok(undefined);
    } else {
      return schema.parse(input) as any;
    }
  },
});

type PartialObjectDefinition<TObjectSchema extends ObjectSchema> = {
  [Key in keyof GetDefinition<TObjectSchema>]: OptionalSchema<
    GetDefinition<TObjectSchema>[Key]
  >;
};

/**
 * @link https://sodd.dev/api/schemas/object/partial
 */
export const partial = <TObjectSchema extends ObjectSchema>(
  schema: TObjectSchema
): ObjectSchema<
  PartialObjectDefinition<TObjectSchema>,
  GetUnknownKeysBehavior<TObjectSchema>
> => {
  const newDefinition = {} as any;
  for (const key in schema.definition) {
    newDefinition[key] = optional(schema.definition[key]);
  }

  return object(newDefinition, schema.unknownKeysBehavior as any);
};

type AssertArray<T> = T extends any[] ? T : never;

type DeepPartial<TSchema extends Schema> = TSchema extends ObjectSchema
  ? ObjectSchema<
      {
        [Key in keyof GetDefinition<TSchema>]: OptionalSchema<
          DeepPartial<GetDefinition<TSchema>[Key]>
        >;
      },
      GetUnknownKeysBehavior<TSchema>
    >
  : TSchema extends ArraySchema<infer ArraySchemaType, infer Cardinality>
  ? ArraySchema<DeepPartial<ArraySchemaType>, Cardinality>
  : TSchema extends TupleSchema<infer TupleSchemaType, infer Rest>
  ? TupleSchema<
      AssertArray<{
        [Key in keyof TupleSchemaType]: TupleSchemaType[Key] extends Schema
          ? DeepPartial<TupleSchemaType[Key]>
          : never;
      }>,
      Rest
    >
  : TSchema extends RecordSchema<infer RecordSchemaType>
  ? RecordSchema<DeepPartial<RecordSchemaType>>
  : TSchema extends OptionalSchema<infer OptionalSchemaType>
  ? OptionalSchema<DeepPartial<OptionalSchemaType>>
  : TSchema extends NullableSchema<infer NullableSchemaType>
  ? NullableSchemaType extends Schema
    ? NullableSchema<DeepPartial<NullableSchemaType>>
    : TSchema
  : TSchema;

const _deepPartial = <TSchema extends Schema>(
  schema: TSchema
): DeepPartial<TSchema> => {
  if (schema.type === _object) {
    const newDefinition = {} as ObjectDefinition;

    for (const key in (schema as any).definition) {
      newDefinition[key] = optional(
        _deepPartial((schema as any).definition[key])
      );
    }

    return object(
      newDefinition as any,
      (schema as any).unknownKeysBehavior as any
    ) as any;
  } else if (schema.type === _array) {
    return array(_deepPartial((schema as any).schema)) as any;
  } else if (schema.type === _tuple) {
    return tuple(
      (schema as any).schemas.map((s: Schema) => _deepPartial(s))
    ) as any;
  } else if (schema.type === _record) {
    return record(_deepPartial((schema as any).schema)) as any;
  } else if (schema.type === _optional) {
    return optional(_deepPartial((schema as any).schema)) as any;
  } else if (schema.type === _nullable) {
    return nullable(_deepPartial((schema as any).schema)) as any;
  } else {
    return schema as any;
  }
};

/**
 * @link https://sodd.dev/api/schemas/object/deepPartial
 */
// can this limitation be fixed, tho?
export const deepPartial = <TObjectSchema extends ObjectSchema>(
  schema: TObjectSchema
): DeepPartial<TObjectSchema> => {
  return _deepPartial(schema);
};

export type LazySchema<TSchema extends Schema> = {
  type: typeof _lazy;
  parse: TSchema["parse"];
};

/**
 * @link https://sodd.dev/api/schemas/lazy
 */
export const lazy = <TSchema extends Schema>(
  getter: () => TSchema
): LazySchema<TSchema> => ({
  type: _lazy,
  parse: (input: unknown) => getter().parse(input),
});

export type NullableSchema<TSchema extends Schema | undefined = undefined> = {
  type: typeof _nullable;
  schema?: TSchema;
  parse: (
    input: unknown
  ) => Result<
    TSchema extends Schema ? Infer<TSchema> | null : null,
    TSchema extends Schema ? InferIssue<TSchema> : InvalidTypeIssue
  >;
};

/**
 * @link https://sodd.dev/api/schemas/nullable
 */
export const nullable = <TSchema extends Schema | undefined = undefined>(
  schema?: TSchema
): NullableSchema<TSchema> => ({
  type: _nullable,
  schema,
  parse: (input: unknown) => {
    if (input === null) {
      return ok(input as any);
    } else if (schema) {
      return schema.parse(input);
    } else {
      return err([invalidType("null", getParsedType(input))]) as any;
    }
  },
});

export type EnumerationSchema<Enumerations extends ReadonlyArray<string>> = {
  type: typeof _enumeration;
  enumerations: Enumerations;
  parse: (
    input: unknown
  ) => Result<
    Enumerations[number],
    InvalidEnumValueIssue<Enumerations> | InferIssue<StringSchema>
  >;
};

/**
 * @link https://sodd.dev/api/schemas/enumeration
 */
export const enumeration = <
  Enumeration extends string,
  Enumerations extends [Enumeration] | Enumeration[]
>(
  enumerations: Enumerations
): EnumerationSchema<Enumerations> => {
  return {
    type: _enumeration,
    enumerations,
    parse: (input: unknown) => {
      const result = string().parse(input);

      if (result.ok) {
        if (enumerations.includes(result.data as any)) {
          return ok(result.data as any);
        } else {
          const issue: InvalidEnumValueIssue<Enumerations> = {
            code: invalid_enum_value,
            expected: enumerations,
            received: input,
            path: [],
          };
          return err([issue]);
        }
      } else {
        return result;
      }
    },
  };
};

// stolen from Zod
type UnionToIntersectionFn<T> = (
  T extends unknown ? (k: () => T) => void : never
) extends (k: infer Intersection) => void
  ? Intersection
  : never;

type GetUnionLast<T> = UnionToIntersectionFn<T> extends () => infer Last
  ? Last
  : never;

type UnionToTuple<T, Tuple extends unknown[] = []> = [T] extends [never]
  ? Tuple
  : UnionToTuple<Exclude<T, GetUnionLast<T>>, [GetUnionLast<T>, ...Tuple]>;

type CastToStringTuple<T> = T extends [string, ...string[]] ? T : never;

type UnionToTupleString<T> = CastToStringTuple<UnionToTuple<T>>;

/**
 * @link https://sodd.dev/api/schemas/object/keyof
 */
export const keyof = <Definition extends ObjectDefinition>(
  schema: ObjectSchema<Definition>
): EnumerationSchema<UnionToTupleString<keyof Definition>> => {
  return enumeration(Object.keys(schema.definition) as any);
};

/**
 * @link https://sodd.dev/api/schemas/object/pick
 */
export const pick = <
  TObjectSchema extends ObjectSchema,
  Keys extends Array<keyof GetDefinition<TObjectSchema>>
>(
  schema: TObjectSchema,
  keys: Keys
): ObjectSchema<
  Expand<Pick<GetDefinition<TObjectSchema>, Keys[number]>>,
  GetUnknownKeysBehavior<TObjectSchema>
> => {
  const newDefinition = {} as ObjectDefinition;

  for (const key of keys) {
    if ((schema.definition as any)[key]) {
      (newDefinition as any)[key] = (schema.definition as any)[key];
    }
  }

  return object(newDefinition, schema.unknownKeysBehavior) as any;
};

/**
 * @link https://sodd.dev/api/schemas/objet/omit
 */
export const omit = <
  TObjectSchema extends ObjectSchema,
  Keys extends Array<keyof GetDefinition<TObjectSchema>>
>(
  schema: TObjectSchema,
  keys: Keys
): ObjectSchema<
  Expand<Omit<GetDefinition<TObjectSchema>, Keys[number]>>,
  GetUnknownKeysBehavior<TObjectSchema>
> => {
  const newDefinition = {} as ObjectDefinition;

  for (const key in schema.definition) {
    if (!keys.includes(key)) {
      newDefinition[key] = schema.definition[key];
    }
  }

  return object(newDefinition, schema.unknownKeysBehavior) as any;
};

type Merge<A, B> = Expand<Omit<A, keyof B> & B>;

/**
 * @link https://sodd.dev/api/schemas/object/merge
 */
export const merge = <
  TObjectSchemaA extends ObjectSchema,
  TObjectSchemaB extends ObjectSchema
>(
  a: TObjectSchemaA,
  b: TObjectSchemaB
): ObjectSchema<
  Merge<GetDefinition<TObjectSchemaA>, GetDefinition<TObjectSchemaB>>,
  GetUnknownKeysBehavior<TObjectSchemaB>
> =>
  object(
    {
      ...a.definition,
      ...b.definition,
    },
    b.unknownKeysBehavior
  ) as any;

/**
 * @link https://sodd.dev/api/schemas/array/nonEmpty
 */
export const nonEmpty = <
  TArraySchema extends ArraySchema<Schema, ArrayCardinality>
>(
  schema: TArraySchema
): TArraySchema extends ArraySchema<infer TSchema, any>
  ? ArraySchema<TSchema, "non-empty">
  : never => array(schema.schema, "non-empty") as any;

export type UnionSchema<Schemas extends [Schema, Schema, ...Schema[]]> = {
  type: typeof _union;
  parse: (
    input: unknown
  ) => Result<Infer<Schemas[number]>, InvalidUnionIssue<Schemas>>;
};

/**
 * @link https://sodd.dev/api/schemas/union
 */
export const union = <Schemas extends [Schema, Schema, ...Schema[]]>(
  schemas: Schemas
): UnionSchema<Schemas> => ({
  type: _union,
  parse: (input: unknown) => {
    const issues: InferIssue<Schemas[number]>[] = [];
    for (const schema of schemas) {
      const result = schema.parse(input);
      if (result.ok) {
        return ok(result.data);
      } else {
        issues.push(...(result.issues as InferIssue<Schemas[number]>[]));
      }
    }
    const issue: InvalidUnionIssue<Schemas> = {
      code: invalid_union,
      path: [],
      issues,
    };
    return err([issue]) as any;
  },
});

const _brandSymbol = Symbol("brand");

export type Brand<Type, TBrand extends string> = Type & {
  [_brandSymbol]: TBrand;
};

export type BrandSchema<TSchema extends Schema, TBrand extends string> = {
  type: typeof _brand;
  brand: TBrand;
  parse: (
    input: unknown
  ) => Result<Brand<Infer<TSchema>, TBrand>, InferIssue<TSchema>>;
};

/**
 * @link https://sodd.dev/api/schemas/brand
 */
export const brand = <TSchema extends Schema, TBrand extends string>(
  schema: TSchema,
  brand: TBrand
): BrandSchema<TSchema, TBrand> => ({
  type: _brand,
  brand,
  parse: (schema as TSchema).parse as (
    input: unknown
  ) => Result<Brand<Infer<TSchema>, TBrand>, InferIssue<TSchema>>,
});

export type AnySchema = {
  type: "any";
  parse: (input: unknown) => Result<any, never>;
};

/**
 * @link https://sodd.dev/api/schemas/any
 */
export const any = (): AnySchema => ({
  type: "any",
  parse: ok,
});

export type UnknownSchema = {
  type: "unknown";
  parse: (input: unknown) => Result<unknown, never>;
};

/**
 * @link https://sodd.dev/api/schemas/unknown
 */
export const unknown = (): UnknownSchema => ({
  type: "unknown",
  parse: ok,
});
