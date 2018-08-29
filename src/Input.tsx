import * as React from "react";
import { withForm } from "./helpers";
import { Omit } from "./types";
import { HTMLFieldComponent, FieldProps } from "./HTMLField";

export type InputProps =
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "checked" | "form">
  & FieldProps<HTMLInputElement>
  & { checkedValue?: any };

export class InputComponent extends HTMLFieldComponent<InputProps, HTMLInputElement> {

  static displayName = "Input";

  static defaultProps = {
    type: "text",
  };

  render() {
    let { form, validate, validateOnChange, format, className, checkedValue, ...props } = this.props;

    const isCheckable = this.props.type === "checkbox" || this.props.type === "radio";
    const currentValue = this.value;
    const value = (isCheckable ? checkedValue : currentValue || "");
    const checked = (isCheckable && checkedValue === currentValue);

    return (
      <input
        {...props}
        className={this.classes}
        ref={this.bindRef}
        value={value}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        checked={checked}
      />
    );
  }

}

export const Input = withForm<InputProps>(InputComponent);