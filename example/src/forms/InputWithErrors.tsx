import * as React from "react";
import { Form, Input } from "rehance-forms";
import { FormWrapper } from "./FormWrapper";
import { ErrorOutput } from "rehance-forms";

export class InputWithErrors extends React.PureComponent {

  handleSubmit = (values: any) => {
    this.setState({ ...values });
  }

  render() {
    return (
      <FormWrapper title="Single Validated Input w/ Error Output">
        <Form onSubmit={this.handleSubmit}>
          <Input name="example" required minLength={6} maxLength={20} />
          <ErrorOutput name="example" style={{ color: "#f00" }} />
        </Form>
      </FormWrapper>
    );
  }

}