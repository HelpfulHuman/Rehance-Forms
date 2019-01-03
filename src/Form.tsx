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
  mergeInitialStateOnSubmit?: boolean;
  onMount?(scope: ScopeContext): void;
  onEvent?(ev: FormEvent, scope: ScopeContext): void;
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
   * Provide the "onMount" prop (if any) with the form scope object for the form.
   */
  public componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this.formScope);
    }
  }

  /**
   * Handle scope updates for the the top level scope created by this component,
   * including the call to submit the form.
   */
  private handleScopeEvent = (ev: FormEvent) => {
    if (ev.signal === FormEventSignal.SubmitForm) {
      this.handleSubmit();
    } else if (this.props.onEvent) {
      this.props.onEvent(ev, this.formScope);
    }
  }

  /**
   * The actual function that handles that calls the submit handler prop.
   */
  private handleSubmit = () => {
    if (this.props.onSubmit) {
      const values = (this.props.mergeInitialStateOnSubmit ? { ...this.props.initialValues, ...this.formScope.value } : this.formScope.value);
      this.props.onSubmit(values, this.formScope);
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
              (this.props.children as RenderProp)(this.formScope) :
              this.props.children
          }
        </FormScopeProvider>
      </Tag>
    );
  }

}