# Working with forms

Depending on your setup, you might need to do some extra work to get Sodd to work with forms. In the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object, which is the web standard for working with forms, all values are strings. In vanilla JS/TS, and libraries and frameworks that also use this standard, you will likely want to convert the values to the correct types before parsing them with Sodd.

That being said, this doesn't mean it was to be a whole lot of work. Consider the following simple form:

```html
<form>
  <input type="text" name="name" required="true" />
  <input type="number" name="age" />
  <input type="checkbox" name="allergies" value="milk" />
  <input type="checkbox" name="allergies" value="wheat" />
  <input type="checkbox" name="allergies" value="sodd" />
  <button>Submit</button>
</form>
```

Let's say you want to validate it according to the following schema:

```ts
import {
  object,
  string,
  number,
  optional,
  array,
  enumeration,
} from "@sodd/core";

const formSchema = object({
  name: string(),
  age: optional(number()),
  allergies: optional(array(enumeration(["milk", "wheat", "sodd"]))),
});
```

Then, depending on how form submission is handled in your application, you might be able to access and parse the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) like this:

```ts
const formData = // <get the form data>

const name = formData.get("name");
const age = formData.get("age");
const allergies = formData.getAll("allergies");

const result = formSchema.parse({
  name,

  // if age was submitted, remove any whitespace and coerce it to a number.
  // otherwise, leave it as null and have the schema handle it
  age: age !== null
    ? Number(age.replace(/\s/g, ""))
    : formData.age,

  allergies
})

if (result.ok) {
  // do something with the parsed data
} else {
  // handle errors
}
```

Your requirements will vary, but hopefully this illustrates how what sort of preprocessing you might need to do before parsing form data.

For larger and more complex validation requirements, you might want to consider [Zod](https://zod.dev), which has built-in functionality for both pre- and post-processing data.
