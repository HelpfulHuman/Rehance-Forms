import * as React from "react";
import { render } from "react-dom";
import { Form, Input, Select, ErrorOutput, SubmitButton, FormOutput, Subscriber, toNumber } from "./lib";

function handleFormSubmit({ values }: FormOutput) {
  console.log(values);
}

render(
  <LoginForm />
  , document.getElementById("root")
);

function LoginForm() {
  return (
    <Form onSubmit={handleFormSubmit}>
      <div>
        <Input type="email" name="email" required placeholder="Email" />
        <ErrorOutput name="email" className="Errors" />
      </div>
      <div>
        <Input
          type="password"
          name="password"
          required
          minLength={8}
          maxLength={26}
          placeholder="Password"
        />
        <ErrorOutput name="password" />
      </div>
      <SubmitButton>
        Login
      </SubmitButton>
    </Form>
  );
}

function LargerForm() {
  return (
    <Form onSubmit={handleFormSubmit}>
      <div>
        <Input name="firstName" />
        <Input name="lastName" />

        <Subscriber name={["firstName", "lastName"]}>
          {({ getValue }) => <span>Full Name: {getValue("firstName")} {getValue("lastName")}</span>}
        </Subscriber>
      </div>
      <div>
        <Input type="email" name="email" required validateOnChange />
        <ErrorOutput name="email" />
      </div>
      <div>
        <Select name="favColor" options={[
          { value: "Green", label: "Green" },
          { value: "Blue", label: "Blue" },
          { value: "Red", label: "Red" },
        ]} />
      </div>
      <SubmitButton className="Button">
        Submit
    </SubmitButton>
    </Form>
  );
}