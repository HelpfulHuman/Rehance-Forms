import * as React from "react";
import { WithContextProps } from "./helpers";
import { FieldMap } from "./types";

export interface Formatter {
  (input: any | null, output: string | null): any;
}

export type FieldProps<ElementType> = {
  name: string;
  validateOnChange?: boolean;
  format?: Formatter;
  validate?(field: string, values: FieldMap): string | null;
  onChange?(ev: React.ChangeEvent<ElementType>): void;
  onBlur?(ev: React.FocusEvent<ElementType>): void;
};

export abstract class HTMLFieldComponent<Props extends FieldProps<ElementType>, ElementType extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, State = {}>
  extends React.PureComponent<WithContextProps<Props>, State> {

  private unsubFormUpdate: Function;
  private unsubFieldUpdate: Function;
  protected element: ElementType;

  constructor(props: WithContextProps<Props>, context: any) {
    super(props, context);

    // this is to make sure we don't break inheritance
    this.bindRef = this.bindRef.bind(this);
    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateSelf = this.validateSelf.bind(this);
  }

  componentWillMount() {
    this.props.form.register(this.props.name);
    this.unsubFormUpdate = this.props.form.onFormUpdate(this.forceUpdate.bind(this));
    this.unsubFieldUpdate = this.props.form.onFieldUpdate(this.handleFieldUpdate.bind(this));
  }

  componentWillUnmount() {
    this.unsubFormUpdate();
    this.unsubFieldUpdate();
    this.props.form.unregister(this.props.name);
  }

  protected get value(): string {
    const value = this.props.form.getValue(this.props.name);
    return this.format(value, null);
  }

  protected format(input: any, output: string | null): any {
    if (!this.props.format) {
      return (output || input);
    }
    return this.props.format(input, output);
  }

  protected bindRef(el: ElementType) {
    const firstBind = !this.element;
    this.element = el;

    // we trigger validation on first bind because element is not available
    // before this to check validation state
    if (firstBind) {
      this.props.form.setError(this.props.name, this.validateSelf());
    }
  }

  protected handleFieldUpdate(field: string) {
    if (field === this.props.name) {
      this.forceUpdate();
    }
  }

  protected handleBlur(ev: React.FocusEvent<ElementType>) {
    const { form, name, onBlur } = this.props;

    const error = this.validateSelf();
    form.setField(name, { error, touched: true });

    if (onBlur) {
      onBlur(ev);
    }
  }

  protected handleChange(ev: React.ChangeEvent<ElementType>) {
    const { form, name, validateOnChange, onChange } = this.props;
    const value = this.format(null, ev.target.value);

    if (validateOnChange) {
      const error = this.validateSelf();
      form.setField(name, { value, error });
    } else {
      form.setValue(name, value);
    }

    if (onChange) {
      onChange(ev);
    }
  }

  protected validateSelf() {
    const element = this.element as any;
    const { name, validate, form } = this.props;
    const result = (
      !!validate ?
        validate(name, form.getValues()) :
        element.validationMessage
    );

    return result || null;
  }

}