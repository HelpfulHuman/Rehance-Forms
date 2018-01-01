# Rehance-Forms

This library aims to ease the pain of creating forms and other state-oriented components in React.  It offers support for handling validation states, form interaction state and automatically binds methods (outside of the `render()`).

## Getting Started

Install via `npm`:

```bash
npm i -S rehance-forms
```

## Methods

### `createForm` (WIP)

The `createForm` method allows you to configure the fields of your form, how to handle submit, etc...  Each defined field will have methods generated automatically on construction that are then passed down via props to the nested component.

Let's kick off with an example.  Here we have a simple form with a text input named `myNumber`.  We can then access the field data and methods on the "namespace" key (which is `form` by default) of the props passed to the nested component.

For our `myNumber` field, we can see that a `myNumber` object is created and we can access the new field value using `myNumber.value`.  Alongside `value`, we also have the properties `.error` and `.dirty`, as well as the methods, `.onFocus`, `.onChange` and `.onBlur`.

```tsx
import * as React from "react";
import {createForm} from "rehance-forms";

const NumericInput = createForm({
  fields: (props) => ({
    myNumber: (props.initialNumber || 0),
  }),
  validate(fields, props) {
    var errors = {};
    if (fields.myNumber < 0 || fields.myNumber > 20) {
      errors.myNumber = "You must enter a number between 0 and 20 characters.";
    }
    return errors;
  }
  onSubmit(fields, props) {
    alert(`You entered ${fields.myNumber}`);
  },
})(function (props) {
  var form = props.form;

  return (
    <div>
      <input type="numeric" {...form.myNumber} />
      <div>{form.myNumber.error}</div>
      <button disabled={!form.isValid} onClick={form.onSubmit}>Log In</button>
    </div>
  );
});
```

#### Field Data

Key | Type | Description
----|------|------------
**value** | `any` | The current value for the field.
**error** | `string` | The error messages for the field, or `null` if there are no errors.
**dirty** | `boolean` | Set to `true` when the user has interacted with the field.
**onFocus** | `Function` | Generated function for handling focus effects for an `<input />` element.
**onChange** | `Function` | Generated function for updating the field's value from an `<input />` element.
**onBlur** | `Function` | Generated function for handling blur effects, namely full form validation, for an `<input />` element.