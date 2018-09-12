import * as React from "react";
import { Form, SubmitButton, Scope, CollectionScope, Input, AddCollectionItem } from "rehance-forms";
import { FormWrapper } from "./FormWrapper";

export class Scopes extends React.PureComponent {

    handleSubmit = ({ values }: any) => {
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
                            {({ removeItem }) => (
                                <div>
                                    <Input name="name" placeholder="Name" />
                                    <Input name="age" placeholder="Age" />
                                    <button onClick={removeItem}>Remove</button>
                                </div>
                            )}
                        </CollectionScope>
                        <div>
                            <AddCollectionItem field="people">
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