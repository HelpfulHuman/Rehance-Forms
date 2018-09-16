import * as React from "react";
import { Form, SubmitButton, Scope, CollectionScope, Input, AddCollectionItem, ErrorOutput, Select } from "rehance-forms";
import { FormWrapper } from "./FormWrapper";

export class EditFormWithScopes extends React.PureComponent {

  private initialValues = {
    username: "PhillipFry",
    beenFrozen: true,
    friends: [
      {
        name: "Leela",
        species: "Mutant",
      },
      {
        name: "Bender",
        species: "Robot",
      },
      {
        name: "The Professor",
        species: "Human",
      },
    ],
  };

  handleSubmit = (values: any) => {
    this.setState({ ...values });
  }

  render() {
    return (
      <FormWrapper title="Edit Form w/ Scopes" result={this.state}>
        <Form initialValues={this.initialValues} onSubmit={this.handleSubmit}>
          <div style={{
            margin: "1em 0",
            display: "flex",
            alignItems: "center",
          }}>
            <Input name="username" required />
            <ErrorOutput name="username" style={{ color: "#f00" }} />
          </div>
          <div style={{
            margin: "1em 0",
            display: "flex",
            alignItems: "center",
          }}>
            Has ever been frozen?
            <div>
              <Input type="radio" id="notFrozen" name="beenFrozen" checkedValue={false} />
              <label htmlFor="notFrozen">No</label>
            </div>
            <div>
              <Input type="radio" id="wasFrozen" name="beenFrozen" checkedValue={true} />
              <label htmlFor="notFrozen">Yes</label>
            </div>
          </div>
          <div style={{ margin: "1em 0" }}>
            Friends
            <CollectionScope name="friends">
              {({ index, removeItem }) => (
                <div style={{ display: "flex" }}>
                  <div>
                    <Input name="name" placeholder="Name" required />
                    <ErrorOutput name="name" style={{ color: "#f00" }} />
                  </div>
                  <div>
                    <Select name="species" options={["Human", "Mutant", "Robot", "Alien"]} />
                  </div>
                  <span onClick={removeItem} style={{ color: "#666", cursor: "pointer" }}>Remove</span>
                </div>
              )}
            </CollectionScope>
            <div>
              <AddCollectionItem to="friends">
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