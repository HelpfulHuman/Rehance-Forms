# Rehance-Forms

This library offers utilities for creating forms in React using stateless components.

## Getting Started

Install via `npm`:

```bash
npm i -S rehance-forms
```

## `createForm`

The `createForm` method allows you to configure the fields of your form, how to handle submit, etc...  Each defined field will have methods generated automatically on construction that are then passed down via props to the nested component.

Let's kick off with an example.  Here we have a simple form with a text input named `myNumber`.  The value of this input field gets converted to an integer via the given `format()` method before being passed to the `validate()` method.  We can then access the field data and methods on the "namespace" key (which is `form` by default) of the props passed to the nested component.

For our `myNumber` field, we can see that an `onMyNumberChange` method is created and we can access the new field value using `myNumber.value`.

```tsx
import * as React from "react";
import {createForm} from "rehance-forms";

const NumericInput = createForm({
  fields: {
    myNumber: {
      default: 0,
      format: (numString) => parseInt(numString),
      validate: (num) => (num < 1 || num > 10 ? "Must be between 1 and 10." : null),
    },
  },
  onSubmit(props) {
    alert(`You entered ${props.form.myNumber.value}`);
  },
})(function (props) {
  var form = props.form;
  var errors = null;

  if (form.errors.length > 0) {
    errors = (<span className="error">{form.errors[0]}></span>);
  }

  return (
    <div>
      {errors}
      <input type="numeric" onChange={form.onMyNumberChange} value={form.myNumber.value} />
      <button disabled={!form.isValid} onClick={form.onSubmit}>Log In</button>
    </div>
  );
});
```

#### Field State Data

Key | Type | Description
----|------|------------
**value** | `any` | The current value for the field.
**error** | `string` | The error messages for the field, or `null` if there are no errors.
**dirty** | `boolean` | Set to `true` when the user has interacted with the field.