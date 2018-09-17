import * as React from "react";
import { withFormScope } from "./helpers";
import { Omit } from "./types";
import { HTMLFieldComponent, FieldProps } from "./HTMLField";

export type InputProps =
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "value" | "checked" | "form">
  & FieldProps<HTMLInputElement>
  & { checkedValue?: any };

export class InputComponent extends HTMLFieldComponent<InputProps, HTMLInputElement> {

  static displayName = "Input";

  static defaultProps = {
    type: "text",
  };

  /**
   * Handle changes to the element for radios and checkboxes.
   */
  private handleCheckbox = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.handleChange({
      ...ev,
      target: {
        ...ev.target,
        value: this.props.checkedValue
      }
    });
  }

  /**
   * Render the component.
   */
  public render() {
    let { formScope, validate, validateOnChange, format, className, checkedValue, ...props } = this.props;

    const isCheckable = this.props.type === "checkbox" || this.props.type === "radio";
    const currentValue = this.value;
    const value = (isCheckable ? checkedValue : currentValue);
    const checked = (isCheckable && ("" + checkedValue) === ("" + currentValue));
    const onChange = (isCheckable ? this.handleCheckbox : this.handleChange);

    return (
      <input
        {...props}
        className={this.classes}
        ref={this.bindRef}
        value={value !== null ? value : ""}
        onBlur={this.handleBlur}
        onChange={onChange}
        checked={checked}
      />
    );
  }

}

export const Input = withFormScope<InputProps>(InputComponent);