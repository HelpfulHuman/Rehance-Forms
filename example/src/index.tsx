import * as React from "react";
import {render} from "react-dom";
import {createForm, withYup} from "../../dist";
import * as yup from "yup";

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email || !re.test(email)) {
    return "You must provide a valid email address.";
  }
}

function validatePassword(password, min, max) {
  if (!password || password.length < min || password.length > max) {
    return `You must provide a password that is between ${min} and ${max} characters long.`;
  }
}

function renderError(error, i) {
  return (
    <li key={i}>{error}</li>
  );
}

function FormLayout({ form }) {
  var errorMessage = null;

  if (form.hasErrors) {
    errorMessage = (<div>1 or more errors has occurred.</div>);
  }

  return (
    <div>
      {errorMessage}
      <div>
        <input type="email" {...form.email} />
        <span>{form.email.error}</span>
      </div>
      <div>
        <input type="password" {...form.password} />
        <span>{form.password.error}</span>
      </div>
      <button disabled={!form.isValid} onClick={form.onSubmit}>Submit</button>
    </div>
  );
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const Form = createForm({
  fields: {
    email: "",
    password: "",
  },
  validate: withYup(schema),
  onSubmit(fields) {
    console.log(fields);
  },
})(FormLayout);

render(
  <Form />
  , document.getElementById("root")
);