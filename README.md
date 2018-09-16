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
    <Form onSubmit={(values) => /* your code here */}>
      <div>
        <Input
          type="email"
          name="email"
          required
        />
        <ErrorOutput name="email" />
      </div>
      <div>
        <Input
          type="password"
          name="password"
          required
          minLength={8}
          maxLength={26}
        />
        <ErrorOutput name="password" />
      </div>
      <SubmitButton>
        Login
      </SubmitButton>
    </Form>
  );
}
```

## Standard Components

### `<Form>`

The most critical component out of this list, the `Form` component sets up and provides the lightweight form API used by all other components. Unlike the other standard element components provided (`Input`, `TextArea`, `Select`) the `Form` component does not provide a 1-to-1 pass through for the standard `<form>` props (yet).

```tsx
<Form onSubmit={values => console.log(values)} />
```

You can optionally supply an `initialValues` prop with an object containing the default values for all the fields of the form. This initial value is not only used to propogate the default values for each form field but also for determining what fields have changed from their initial value.

```tsx
<Form initialValues={{ message: "Hello World" }}>
  <Input name="message" />
</Form>
```

### `<Input>` and `<TextArea>`

The `<Input>` and `<TextArea>` components are direct abstractions over the standard `<input>` and `<textarea>` elements. They support nearly all of the standard props for their base elements, with a few exceptions. They automatically handle state management for input value and error states.

#### Checkboxes and Radios

Because this library manages the values of your fields from a top down approach, you cannot set the `value` for each field directly. For checkboxes and radios, this can be an issue since `value` is used to denote the value of the field when the element is considered "checked". You can get around this issue by padding the `checkedValue` prop.

```tsx
// checkbox
<Input type="checkbox" name="exampleCheckbox" checkedValue="1" />

// radio
<Input type="radio" name="exampleRadio" checkedValue="blue" />
```

#### Validation Basics

Native browser validation is supported by default for these fields. This means you can simply set the `required` prop if a field is required or provide the `type="email"` prop if the `<input>` needs to be an email address.

```tsx
<Input name="email" type="email" required />
```

These fields will automatically validate themselves based on any set validation rules when the component is first mounted. Subsequent validation occurs when the field is blurred by default. Alternatively, you can set the field to validate any time it is changed (in addition to when it's blurred) by providing the `validateOnChange` prop.

```tsx
<Input name="example" required validateOnChange />
```

#### Custom Validation

You can override the default validation behaviour by providing your own `validate` function prop. The validation prop receives the current function name and access to all form values. If a `string` is returned, that `string` will be used as the error message for the field. If a falsey value is returned, then any existing error message for the field will be removed.

```ts
type Valdiator = (field: string, formValues: object) => string | null;
```

#### Value Formatting

By default, the value type passed to and from `Input`, `TextArea` and `Select` typically gets coerced to a `string` (since this is what the underlying HTML element does). However, you can choose to format this value to whatever you want using a `format` function prop. You could use this feature to create things such as form field masks.

```ts
type Formatter = (value: any, isOutput: boolean) => any;
```

Here's an example of how you might convert an object to a string input and vice versa. In this scenario, we want the data stored as an object `{custom: ""}` where the field is used to display and edit the `custom` key's value.

```ts
function formatToObject(value, output) {
  return output ? { custom: value } : value.custom;
}

<Input name="someObjectField" format={formatToObject} />;
```

> **Note:** If you wish to edit many fields of an object within your form, it may be preferable to use a `<Scope>` instead. [You can find more information about the `<Scope>` component below.](#Scope)

#### Customizations

The `<Input>` and `<TextArea>` components are simple wrappers around the default `<input>` and `<texarea>` elements and can be easily customized using CSS rules like `input`, `input:focused` and `input:disabled`. However, for greater control you can customize the CSS the controls using custom CSS classes via the `className` prop. You can either pass a `string` value, or if you need access to the field's state, you can supply a function.

```tsx
// string value
<Input type="text" className="MyCustomInput" />

// custom function
<Input
  type="text"
  className={({ value, error, changed, touched }) => (
    "MyCustomInput" +
    (!!error ? " isInvalid" : "") +
    (touched ? " isDirty" : " isClean")
  )}
/>
```

### `<Select>`

The `<Select>` component is a direct abstraction of the standard `<select>` _and_ `<option>` elements. Rather than requiring the `<option>` children be provided manually, an `options` prop can be provided containing an array of `string` values or using `{ value: string, label: string }` objects for each option to be rendered.

Validation handling for `<Select>` is identical to [validation handling for `<Input>` and `<TextArea>`](#validation-basics), as well as, [adding custom formatting](#value-formatting).

The following approaches work with the `<Select>` component.

```tsx
// standard approach to <select>
<Select name="favColor">
  <option value="red">Red</option>
  <option value="green">Green</option>
  <option value="blue">Blue</option>
</Select>

// alternate approach 1
<Select
  name="favColor"
  options={["Red", "Green", "Blue"]}
/>

// alternate approach 2
<Select
  name="favColor"
  options={[
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
  ]}
/>
```

> **Note:** Providing an array of `string` values via the `options` prop will result in the `<option>` tags using the value for both the value and label of the option.

### `<Toggle>`

The `<Toggle>` component is for creating custom `boolean` switches in place of a traditional `<input type="checkbox" />` element. This component can be used in 2 different ways. Both approaches support the `disabled` prop, an `onToggle` event prop (for external change effects) and requires a `name` prop to be provided.

#### Customize `Toggle` With CSS

The first approach will create a single `<span>` element and apply the base `className`, along with, the appropriate classes for active and disabled states.

```tsx
// the classes used here are the default classes provided by the component
<Toggle
  name="enableFeature"
  className="Toggle"
  activeClassName="isActive"
  disabledClassName="isDisabled"
  onToggle={enabled => alert(enabled)}
/>
```

#### Completely Custom `Toggle` Markup

Using a child render prop, custom markup can be supplied in the function and will be provided with the current `value`, the component `disabled` state and a `toggle` function for toggling the current value (when `disabled` is `false`).

```tsx
<Toggle name="enableFeature">
  {({ value, disabled, toggle }) => (
    <span onClick={toggle}>{value ? "On" : "Off"}</span>
  )}
</Toggle>
```

### `<Radio>`

The `<Radio>` component is extremely similar to the `<Toggle>` component and offers a quick way to create a customizable "radio" selection type of control. This component can be used in 2 different ways. Both approaches support the `disabled` prop, an `onChange` event prop (for external change effects) and requires `name` and `value` props to be provided.

#### Customize `Radio` With CSS

The first approach will create a single `<span>` element and apply the base `className`, along with, the appropriate classes for active and disabled states.

```tsx
// the classes used here are the default classes provided by the component
<Radio
  name="favoriteColor"
  value="green"
  className="Radio"
  activeClassName="isActive"
  disabledClassName="isDisabled"
  onChange={state => alert(state)}
>
  Green
</Radio>
```

This approach also allows you to enable the ability for the radio option to be deselected on subsequent clicks after it's already active/selected. You can do this by supplying an `allowDeselect` prop. When the radio is deselected, it sets the value as `null`.

```tsx
<Radio name="favoriteColor" value="green" allowDeselect>
  Green
</Radio>
```

#### Completely Custom `Radio` Markup

Using a child render prop, custom markup can be supplied in the function and will be provided with the component's value, the current `groupValue`, the component's `disabled` state and 2 field mutation methods: `select` and `deselect`. When using this approach, the `allowSelect` prop is _not_ taken into account.

- `select()` will set the radio group's value to the component's set `value`.
- `deselect()` will set the radio group's value `null`.

```tsx
<Radio name="favoriteColor" value="green">
  {({ groupValue, value, selected, disabled, select, deselect }) => (
    <span onClick={selected ? deselect : select}>
      {value} {selected ? "(Selected)" : ""}
    </span>
  )}
</Radio>
```

### `<Subscriber>`

The `<Subscriber>` component provides a quick and easy way to subscribe to specific field and form changes. It simply needs `field` prop for describing what fields should trigger a re-render. This `field` prop can be `string` containing the field name, an `array` of strings containing multiple field names or a function that determines whether it should update by returning a `boolean` value.

During a render, it passes the current form API to its child render prop and displays the results.

```tsx
// any form changes
<Subscriber>
  {scope => (
    <span>Form/Scope Values: {scope.value}</span>
  )}
</Subscriber>

// single field
<Subscriber field="example">
  {scope => (
    <span>{scope.get("example")}</span>
  )}
</Susbcriber>

// multiple fields
<Subscriber field={["firstName", "lastName"]}>
  {scope => (
    <span>
      {scope.get("firstName")} {scope.get("lastName")}
    </span>
  )}
</Susbcriber>

// custom field predicate
<Subscriber field={fieldName => fieldName === "example"}>
  {scope => (
    <span>{scope.get("example")}</span>
  )}
</Susbcriber>
```

### `<PreviewOutput>`

The `<PreviewOutput>` component provides a quick and simple way to display a preview of a field's value that automatically updates when the field changes. The returned value is wrapped in a `<span>` tag and supports all of the standard HTML span props like `style` and `className`.

```tsx
<PreviewOutput name="example" />
```

Additionally, if the stored value for the field isn't a string, you can format the value by providing a `format` prop. For example, let's say we had an array of strings stored as `todos` that we wanted to list as a string of comma-separated values:

```tsx
<PreviewOutput name="todos" format={todos => todos.join(", ")} />
```

### `<ErrorOutput>`

Similarly to `<PreviewOutput>`, the `<ErrorOutput>` component provides a quick and simple way to display a field's validation error if one exists. The returned value is wrapped in a `<span>` tag and supports all of the standard HTML span props like `style` and `className`.

```tsx
<ErrorOutput name="example" />
```

One subtle, but important detail to note, is that the initial error of a field is not shown by default. This is because the field has not been "touched" and displaying errors for a field that the user has not yet interacted with could be confusing or annoying. If you need the error message to show 100% of the time (so long as an error exists), you can provide the `alwaysShow` prop.

```tsx
<ErrorOutput name="example" alwaysShow />
```

### `<Button>`

The `<Button>` component provides a convenient way to create a `<button>` element that can be disabled based on your form's state. For example, if you want the button to be disabled if any errors exist on the form, you can provide the `disabledOnError` prop. Or if you want to disable the button when no changes have been made to the form, then you can provide the `disabledUntilChanged` prop.

```tsx
<Button
  onClick={() => /* your code here */}
  disabledOnError
  disabledUntilChanged
>
  My Custom Action
</Button>
```

If you have a custom need, you can provide a `disabled` prop that accepts a standard `boolean` value or a predicate function that is given access to the form API instance for your form.

```tsx
<Button
  onClick={() => /* your code here */}
  disabled={scope => /* custom logic here */}
>
  My Custom Action
</Button>
```

It's likely that you'll need your button to interact with the form/scope instance directly when clicked. To gain access to this convenience, you can supply a function to a `onClickWithScope` prop. The function provided will receive 2 arguments: the first is the mouse event and the second is the form/scope API.

```tsx
<Button
  onClickWithScope={(ev, scope) => /* your code here */}
>
  My Custom Action
</Button>
```

### `<SubmitButton>`

The `<SubmitButton>` component is a wrapper over top of the previously mentioned [`<Button>` component](#button). It automatically sets the `disabledOnError` and `disabledUntilChanged` props to `true` by default and submits the form when clicked. You can still provide a custom `disabled` prop or override the `disabledOnError` or `disabledUntilChanged` props, if desired.

```tsx
<SubmitButton>Submit</SubmitButton>
```

### `<ResetButton>`

The `<ResetButton>` component is a wrapper over top of the previously mentioned [`<Button>` component](#button). It automatically sets the `disabledUntilChanged` prop to `true` and resets the form values to their `initialValues` setting when clicked.

```tsx
<ResetButton>Reset</ResetButton>
```

### `<ClearButton>`

The `<ClearButton>` component is a wrapper over top of the previously mentioned [`<Button>` component](#button). It completely clears all fields when clicked and automatically disables itself when all form fields are empty.

```tsx
<ClearButton>Clear Fields</ClearButton>
```

## Scope & State Management

Under the hood, this library is using React's new Context API as a delivery mechanism for a lightweight API that manages the state information for the fields of your form. State changes are not broadcast through the React context as this can quickly cause expensive re-renders on many components at once. Instead, the lightweight API provides access to its own event bus for macro (form/scope) and micro (field) updates, allowing for components to be selective in what they respond to.

The underlying form API is referred to as the form scope, and it's not limited to a single level. The form scope can further be broken into child scopes, creating a scope tree for your form.

### `<FormScopeProvider>` and `<FormScopeConsumer>`

The 2 React context components for providing and accessing a form API. If you'd like to know more about the props used by these components you can read the [official React context documentation](https://reactjs.org/docs/context.html#reactcreatecontext) on the subject.

### `<Scope>`

The `<Scope>` component allows you to create a new scope as a child of its parent scope (provided by either `<Form>` or another `<Scope>`). Nested field components will use the new scope provided by this component in place of its parent, allowing for isolation and encapsulation of scope values at this level.

```tsx
<Form initialValues={{ foo: { bar: "" } }}>
  <Scope name="foo">
    <Input name="bar" required />
    <ErrorOutput name="bar" />
  </Scope>
</Form>
```

### `<CollectionScope>`

The `<CollectionScope>` component is for creating a complex array of scopes for an array value within a form or scope. It takes a child render prop for rendering the scoped field elements for the dynamically created scopes. The render prop is provided with the numeric `index` of the item scope, the item's `scope`, and a `remove` function for removing the item (and its scope) entirely.

```tsx
<Form initialValues={{ people: [] }}>
  <CollectionScope name="people">
    {({ index, scope, remove }) => (
      <div>
        <h4>Person #{index}</h4>
        <Input name="firstName" />
        <Input name="lastName" />
        <div>
          <span onClick={remove}>Remove Person</span>
        </div>
      </div>
    )}
  </CollectionScope>
</Form>
```

### `<AddCollectionItem>`

The `<AddCollectionItem>` component creates a simple button for pushing new values onto an array field or `<CollectionScope>` within the current scope. It requires a `to` prop with the name of the target field or scope to push the value onto and can optionally provide a custom `value` prop. The default value added is an empty object literal.

```tsx
<div>
  <CollectionScope name="people">{() => /* render fields */}</CollectionScope>
  <AddCollectionItem to="people" value={{ name: "" }}>
    Add Person
  </AddCollectionItem>
</div>
```

## Higher-Order Components

### `withFormScope()`

The `withFormScope()` function creates a higher-order component for quickly providing the wrapped component with the form API as a `formScope` prop. This is simply a utility over top of the `<FormScopeConsumer>` component.

```tsx
const Example = withFormScope(function({ formScope }) {
  return <div />;
});
```
