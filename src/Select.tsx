import * as React from "react";
import { withForm } from "./helpers";
import { Omit } from "./types";
import { HTMLFieldComponent, FieldProps } from "./HTMLField";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps =
  & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "form">
  & FieldProps<HTMLSelectElement>
  & {
    options?: SelectOption[];
  };

class _Select extends HTMLFieldComponent<SelectProps, HTMLSelectElement> {

  static displayName = "Select";

  protected renderOption = (option: SelectOption, idx: number) => {
    return (
      <option key={idx} value={option.value}>
        {option.label}
      </option>
    );
  }

  render() {
    const { form, validate, validateOnChange, options, children, ...props } = this.props;

    return (
      <select
        {...props}
        ref={this.bindRef}
        value={this.value || ""}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
      >
        {Array.isArray(options) ? options.map(this.renderOption) : children}
      </select>
    );
  }

}

export const Select = withForm<SelectProps>(_Select);