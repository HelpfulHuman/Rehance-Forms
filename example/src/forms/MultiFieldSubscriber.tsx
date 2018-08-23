import * as React from "react";
import { Form, Input, Subscriber, ErrorOutput, Select, SubmitButton, Toggle } from "rehance-forms";
import { FormWrapper } from "./FormWrapper";

export class MultiFieldSubscriber extends React.PureComponent {

  handleSubmit = ({ values }: any) => {
    this.setState({ ...values });
  }

  render() {
    return (
      <FormWrapper title="Multi-Field Subscriber" result={this.state}>
        <Form onSubmit={this.handleSubmit}>
          <div>
            <Subscriber field={["firstName", "lastName"]}>
              {({ getValue }) => <span>Full Name: {getValue("firstName")} {getValue("lastName")}</span>}
            </Subscriber>
          </div>
          <div>
            <Input name="firstName" />
            <Input name="lastName" />
          </div>
          <div>
            Is there support for toggle components?
            <Toggle name="exampleToggle" />
          </div>
          <div>
            How about custom toggle components?
            <Toggle name="exampleToggle">
              {({ value, onToggle }) => (
                <span onClick={onToggle}>{value ? "Yes" : " No"}</span>
              )}
            </Toggle>
          </div>
          <SubmitButton className="Button">
            Submit
          </SubmitButton>
        </Form>
      </FormWrapper>
    );
  }

}