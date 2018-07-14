import * as React from "react";
import { Form, Input } from "../lib";
import { FormWrapper } from "./FormWrapper";
import { ErrorOutput } from "../lib";

export class ValidateOnChange extends React.PureComponent {

  handleSubmit = ({ values }: any) => {
    this.setState({ ...values });
  }

  render() {
    return (
      <FormWrapper title="Validate on Change">
        <Form onSubmit={this.handleSubmit}>
          <Input name="example" validateOnChange required minLength={6} maxLength={20} />
          <ErrorOutput name="example" style={{ color: "#f00" }} />
        </Form>
      </FormWrapper>
    );
  }

}