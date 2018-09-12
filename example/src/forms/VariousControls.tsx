import * as React from "react";
import { Form, Input, SubmitButton, Toggle, Radio, PreviewOutput } from "rehance-forms";
import { FormWrapper } from "./FormWrapper";

export class VariousControls extends React.PureComponent {

  handleSubmit = (values: any) => {
    this.setState({ ...values });
  }

  render() {
    return (
      <FormWrapper title="Various Controls" result={this.state}>
        <Form onSubmit={this.handleSubmit}>
          <div style={{
            margin: "1em 0",
            display: "flex",
            alignItems: "center",
          }}>
            <Input type="checkbox" name="simpleCheckbox" checkedValue="Check!" />
            <span>Checkboxes? <PreviewOutput name="simpleCheckbox" /></span>
          </div>
          <div style={{
            margin: "1em 0",
            display: "flex",
            alignItems: "center",
          }}>
            Simple radios?
            <label style={{ display: "flex", alignItems: "center", padding: "0 1em" }}>
              <Input type="radio" name="simpleRadio" checkedValue="yes" />
              Yes
            </label>
            <label style={{ display: "flex", alignItems: "center", padding: "0 1em" }}>
              <Input type="radio" name="simpleRadio" checkedValue="no" />
              No
            </label>
          </div>
          <div style={{
            margin: "1em 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            Is there support for toggle components?
            <Toggle name="exampleToggle" />
          </div>
          <div style={{
            margin: "1em 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            How about custom toggle components?
            <Toggle name="exampleToggle">
              {({ value, toggle }) => (
                <span onClick={toggle}>{value ? "You betcha!" : "Still custom"}</span>
              )}
            </Toggle>
          </div>
          <div style={{ margin: "1em 0" }}>
            What about custom radio options?
            <div className="Radios">
              <Radio name="radios" value="yup">Yup!</Radio>
              <Radio name="radios" value="maybe">Maybe</Radio>
              <Radio name="radios" value="no">No</Radio>
            </div>
          </div>
          <SubmitButton>
            Submit
          </SubmitButton>
        </Form>
      </FormWrapper>
    );
  }

}