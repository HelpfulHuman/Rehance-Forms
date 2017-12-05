import * as React from "react";
import {render} from "react-dom";
import {createForm} from "../../dist";

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email || !re.test(email)) {
    throw "You must provide a valid email address.";
  }
}

function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 20) {
    throw "You must provide a password that is between 8 and 20 characters long.";
  }
}

function renderError(error, i) {
  return (
    <li key={i}>{error}</li>
  );
}

function FormLayout({ form }) {
  var errors = null;

  if (form.errors.length > 0) {
    errors = (
      <ul>
        {form.errors.map(renderError)}
      </ul>
    );
  }

  return (
    <div>
      {errors}
      <input type="email" onBlur={form.onEmailBlur} onChange={form.onEmailChange} value={form.email.value} />
      <input type="password" onBlur={form.onPasswordBlur} onChange={form.onPasswordChange} value={form.password.value} />
      <button disabled={!form.isValid} onClick={form.onSubmit}>Submit</button>
    </div>
  );
}

const Form = createForm({
  fields: {
    email: {
      default: "",
      validate: validateEmail,
    },
    password: {
      default: "",
      validate: validatePassword,
    },
  },
  onSubmit({ form }) {
    console.log(form);
  },
})(FormLayout);

render(
  <Form />
  , document.getElementById("root")
);