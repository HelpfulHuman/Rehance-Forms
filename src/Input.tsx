import * as React from "react";
import { withForm } from "./helpers";
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

  private handleCheckbox = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (this.value === this.props.checkedValue) {
      ev = { ...ev, target: { ...ev.target, value: "" } };
    }

    this.handleChange(ev);
  }

  render() {
    let { form, validate, validateOnChange, format, className, checkedValue, ...props } = this.props;

    const isCheckable = this.props.type === "checkbox" || this.props.type === "radio";
    const currentValue = this.value;
    const value = (isCheckable ? checkedValue : currentValue || "");
    const checked = (isCheckable && checkedValue === currentValue);
    const onChange = this.props.type === "checkbox" ? this.handleCheckbox : this.handleChange;

    return (
      <input
        {...props}
        className={this.classes}
        ref={this.bindRef}
        value={value}
        onBlur={this.handleBlur}
        onChange={onChange}
        checked={checked}
      />
    );
  }

}

export const Input = withForm<InputProps>(InputComponent);