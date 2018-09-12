import * as React from "react";
import { Form, SubmitButton, Scope, CollectionScope, Input, AddCollectionItem, ErrorOutput } from "rehance-forms";
import { FormWrapper } from "./FormWrapper";

export class Scopes extends React.PureComponent {

  handleSubmit = (values: any) => {
    this.setState({ ...values });
  }

  render() {
    return (
      <FormWrapper title="Scopes" result={this.state}>
        <Form onSubmit={this.handleSubmit}>
          <div style={{
            margin: "1em 0",
            display: "flex",
            alignItems: "center",
          }}>
            Object Scoping Example
                        <Scope name="example">
              <Input name="message" />
            </Scope>
          </div>
          <div style={{ margin: "1em 0" }}>
            Collection Scope Example
              <CollectionScope name="people">
              {({ index, removeItem }) => (
                <div>
                  <h4>Person #{index}</h4>
                  <div>
                    <Input name="name" placeholder="Name" required />
                    <ErrorOutput name="name" style={{ color: "#f00" }} />
                  </div>
                  <div>
                    <Input type="number" name="age" placeholder="Age" />
                    <ErrorOutput name="age" style={{ color: "#f00" }} />
                  </div>
                  <span onClick={removeItem} style={{ color: "#666", cursor: "pointer" }}>Remove</span>
                </div>
              )}
            </CollectionScope>
            <div>
              <AddCollectionItem to="people">
                Add Person
              </AddCollectionItem>
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