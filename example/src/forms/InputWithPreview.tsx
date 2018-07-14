import * as React from "react";
import { Form, Input } from "rehance-forms";
import { FormWrapper } from "./FormWrapper";
import { PreviewOutput } from "../lib";

export class InputWithPreview extends React.PureComponent {

  handleSubmit = ({ values }: any) => {
    this.setState({ ...values });
  }

  render() {
    return (
      <FormWrapper title="Single Input w/ Preview">
        <Form onSubmit={this.handleSubmit}>
          <Input name="example" />
          <PreviewOutput name="example" />
        </Form>
      </FormWrapper>
    );
  }

}