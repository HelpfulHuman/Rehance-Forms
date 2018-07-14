import * as React from "react";
import { Form, Input, ErrorOutput, SubmitButton } from "rehance-forms";
import { FormWrapper } from "./FormWrapper";

export class LoginForm extends React.PureComponent {

  handleSubmit = ({ values }: any) => {
    this.setState({ ...values });
  }

  render() {
    return (
      <FormWrapper title="Login" result={this.state}>
        <Form onSubmit={this.handleSubmit}>
          <div>
            <Input type="email" name="email" required placeholder="Email" />
            <ErrorOutput name="email" className="Errors" style={{ color: "#f00" }} />
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
            <ErrorOutput name="password" style={{ color: "#f00" }} />
          </div>
          <SubmitButton>
            Login
          </SubmitButton>
        </Form>
      </FormWrapper>
    );
  }

}