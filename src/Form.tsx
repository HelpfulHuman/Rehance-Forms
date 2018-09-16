import * as React from "react";
import { FieldMap } from "./types";
import { FormScopeProvider, ScopeContext } from "./ScopeContext";
import { FormEvent, FormEventSignal } from "./EventBus";

export type RenderProp = (scope: ScopeContext) => React.ReactNode;

export type FormProps = {
  className?: string;
  style?: React.CSSProperties;
  initialValues?: FieldMap;
  tag?: string;
  onSubmit?(values: FieldMap, scope: ScopeContext): void;
  children?: React.ReactNode | RenderProp;
};

export class Form extends React.Component<FormProps> {

  static defaultProps: Partial<FormProps> = {
    tag: "form",
    initialValues: {},
  };

  private formScope: ScopeContext;

  constructor(props: FormProps, context: any) {
    super(props, context);

    let initialValues = {};
    if (
      typeof props.initialValues !== "object" ||
      Array.isArray(props.initialValues)
    ) {
      console.warn("You must provide an object type for the initialValues prop!  Reverting to an empty object.");
    } else {
      initialValues = { ...props.initialValues };
    }

    this.formScope = new ScopeContext(initialValues);
    this.formScope.listen(this.handleScopeEvent);
  }

  /**
   * Handle scope updates for the the top level scope created by this component,
   * including the call to submit the form.
   */
  private handleScopeEvent = (ev: FormEvent) => {
    if (ev.signal === FormEventSignal.SubmitForm) {
      this.handleSubmit();
    }
  };

  /**
   * The actual function that handles that calls the submit handler prop.
   */
  private handleSubmit = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.formScope.value, this.formScope);
    }
  }

  /**
   * Invoke the onSubmit prop with the current form values when submitted.
   */
  private handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    this.handleSubmit();
  }

  /**
   * Render the form and its contents.
   */
  public render() {
    let Tag: string = this.props.tag!;
    let props: any = {
      className: this.props.className,
      style: this.props.style,
    };

    if (Tag === "form") {
      props.noValidate = true;
      props.onSubmit = this.handleFormSubmit;
    }

    return (
      <Tag {...props}>
        <FormScopeProvider value={this.formScope}>
          {
            typeof this.props.children === "function" ?
              this.props.children(this.formScope) :
              this.props.children
          }
        </FormScopeProvider>
      </Tag>
    );
  }

}