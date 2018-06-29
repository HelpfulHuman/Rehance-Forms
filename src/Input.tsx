import * as React from "react";
import { withForm } from "./helpers";
import { Omit } from "./types";
import { HTMLFieldComponent, FieldProps } from "./HTMLField";

export type InputProps =
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "form">
  & FieldProps<HTMLInputElement>;

export class InputComponent extends HTMLFieldComponent<InputProps, HTMLInputElement> {

  static displayName = "Input";

  render() {
    const { form, validate, validateOnChange, format, ...props } = this.props;

    return (
      <input
        {...props}
        ref={this.bindRef}
        value={this.value || ""}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
      />
    );
  }

}

export const Input = withForm<InputProps>(InputComponent);