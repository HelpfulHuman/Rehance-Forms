import * as React from "react";
import { Omit } from "./types";
import { HTMLFieldComponent, FieldProps } from "./HTMLField";
import { withFormScope } from "./helpers";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps =
  & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className" | "value" | "form">
  & FieldProps<HTMLSelectElement>
  & {
    options?: (string | SelectOption)[];
  };

class _Select extends HTMLFieldComponent<SelectProps, HTMLSelectElement> {

  static displayName = "Select";

  /**
   * Bind the select element and set the initial value to the first option.
   */
  protected bindRef(el: HTMLSelectElement) {
    const firstBind = !this.element;
    this.element = el;

    // we trigger validation and set the value (if any) on first bind because
    // the element is not yet available otherwise
    if (firstBind) {
      this.field.value = el.value;
      this.field.error = this.validateSelf();
      this.triggerUpdate();
    }
  }

  /**
   * Render a single option element.
   */
  protected renderOption = (option: string | SelectOption, idx: number) => {
    if (typeof option === "string") {
      option = { value: option, label: option };
    }

    return (
      <option key={idx} value={option.value}>
        {option.label}
      </option>
    );
  }

  /**
   * Renders the select element.
   */
  public render() {
    const { formScope, validate, validateOnChange, className, options, children, ...props } = this.props;

    return (
      <select
        {...props}
        className={this.classes}
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

export const Select = withFormScope<SelectProps>(_Select);