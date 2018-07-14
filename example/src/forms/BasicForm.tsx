import * as React from "react";
import { Form, Input, ErrorOutput, SubmitButton } from "../lib";
import { FormWrapper } from "./FormWrapper";

export class BasicForm extends React.PureComponent {

  handleSubmit = ({ values }: any) => {
    this.setState({ ...values });
  }

  render() {
    return (
      <FormWrapper title="Basic Form" result={this.state}>
        <Form onSubmit={this.handleSubmit}>
          <Input name="example" />
          <SubmitButton>
            Submit
          </SubmitButton>
        </Form>
      </FormWrapper>
    );
  }

}