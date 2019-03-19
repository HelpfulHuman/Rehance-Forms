import * as React from "react";
import { Omit } from "./types";
import { HTMLFieldComponent, FieldProps } from "./HTMLField";
import { withFormScope } from "./helpers";

export type TextAreaProps =
  & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "value" | "form" | "onChange" | "onBlur" | "onFocus">
  & FieldProps<HTMLTextAreaElement>;

export class TextAreaComponent extends HTMLFieldComponent<TextAreaProps, HTMLTextAreaElement> {

  static displayName = "TextArea";

  /**
   * Render the textarea component.
   */
  public render() {
    const { formScope, validate, validateOnChange, format, className, keepChangesOnUnmount, ...props } = this.props;
    const value = this.value;

    return (
      <textarea
        {...props}
        className={this.classes}
        ref={this.bindRef}
        value={value !== null && value !== undefined ? "" + value : ""}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onChange={this.handleChange}
      />
    );
  }

}

export const TextArea = withFormScope<TextAreaProps>(TextAreaComponent);