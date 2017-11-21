# Rehance-Forms

## Getting Started

Install via `npm`:

```bash
npm i -S rehance-forms
```

## Usage

```tsx
import * as React from "react";
import {createForm} from "rehance-forms";

const LoginForm = createForm({
  fields: {
    email: "",
    password: "",
  },
  onSubmit(fields, props) {
    console.log(fields.email, fields.password);
  },
})(function (props) {
  return (
    <div>
      <input type="email" onChange={props.onEmailChange} value={props.email} />
      <input type="password" onChange={props.onPasswordChange} value={props.password} />
      <button onClick={props.onSubmit}>Log In</button>
    </div>
  );
});
```
