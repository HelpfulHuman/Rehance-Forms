# Rehance-Forms

This library aims to ease the pain of creating forms in React. It offers automatic state management and validation support, along with utility components and connected versions of standard HTML form control elements.

**This library is written using [Typescript](http://www.typescriptlang.org/) and offers full typing support.**

## Getting Started

Install via `npm`:

```bash
npm i -S rehance-forms
```

## Usage

```tsx
import * as React from "react";
import { Form, Input, ErrorOutput, SubmitButton } from "rehance-forms";

function LoginForm() {
  return (
    <Form onSubmit={({ values }) => /* your code here */}>
      <div>
        <Input type="email" name="email" required />
        <ErrorOutput name="email" />
      </div>
      <div>
        <Input type="password" name="password" required min={8} max={24} />
        <ErrorOutput name="password" />
      </div>
      <SubmitButton>
        Login
      </SubmitButton>
    </Form>
  );
}
```

## Components

### `<Form>`

The most critical component out of this list, the `Form` component sets up and provides the lightweight form API used by all other components.  Unlike the other standard element components provided (`Input`, `TextArea`, `Select`) the `Form` component does not provide a 1-to-1 pass through for the standard `<form>` props.

##### Props

| Prop     | Type                   | Description                                            |
| -------- | ---------------------- | ------------------------------------------------------ |
| onSubmit | `(FormOutput) => void` | A custom method for consuming the results of the form. |

### `<FormProvider>` and `<FormConsumer>`

Under the hood, this library is using React's new Context API as a delivery mechanism for a lightweight API that manages the state information for the fields of your form. State changes are not broadcast through the React context as this can quickly cause expensive re-renders on many components at once. Instead, the lightweight API provides access to its own event bus for macro (form) and micro (field) updates, allowing for components to be selective in what they respond to.

The 2 React context components for providing and accessing a form API. If you'd like to know more about the props used by these components you can read the [official React context documentation](https://reactjs.org/docs/context.html#reactcreatecontext) on the subject.

### `<Input>` and `<TextArea>`

The `<Input>` and `<TextArea>` components are direct abstractions over the standard `<input>` and `<textarea>` elements.  They support nearly all of the standard props for their base elements, with a few exceptions.  They automatically handle state management for input value and error states.

#### Custom Validation

Native browser validation is supported by default for these fields.  However, you can override this behaviour by providing your own `validate` function prop.  The validation prop receives the current function name and access to all form values.  If a `string` is returned, that `string` will be used as the error message for the field.  If a falsey value is returned, then any existing error message for the field will be removed.

```ts
type Valdiator = (field: string, formValues: object) => string | null
```

#### Value Formatting

By default, the value type for `Input`, `TextArea` and `Select` is a `string`.  However, you can choose to format this value to whatever you want.  A `format` function can be provided that will be passed the current value input/output for the component.

```ts
type Formatter =
  | (input: any, output: null) => string
  | (input: null, output: string) => any
```

An important thing to consider here is that an incoming input value must always be coercible to a `string` (since that's the required format for `<input>`, `<textarea>` and `<select>`).

Let's say you need to format a text field into and out of an object.  An example of a proper format implementation for this use case would be:

```ts
function formatToObject(input, output) {
  if (output !== null) {
    return { custom: output };
  } else {
    return (input ? input.custom : "");
  }
}
```

### `<Select>`

The `<Select>` component is a direct abstraction of the standard `<select>` _and_ `<option>` elements.  Rather than requiring the `<option>` children be provided manually, an `options` prop can be provided containing an array of `{ value: string, label: string }` objects for each option to be rendered.

Validation handling for `<Select>` is identical to [validation handling for `<Input>` and `<TextArea>`](#custom-validation), as well as, [adding custom formatting](#value-formatting).

```tsx
// standard approach to <select>
<Select name="favColor">
  <option value="red">Red</option>
  <option value="green">Green</option>
  <option value="blue">Blue</option>
</Select>

// alternate approach
<Select
  name="favColor"
  options={[
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
  ]}
/>

### `<Subscriber>`

### `<ErrorOutput>`

### `<PreviewOutput>`