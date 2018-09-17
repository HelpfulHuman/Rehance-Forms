import * as React from "react";
import { Omit } from "./types";
import { HTMLFieldComponent, FieldProps } from "./HTMLField";
import { withFormScope } from "./helpers";

export type TextAreaProps =
  & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "value" | "form">
  & FieldProps<HTMLTextAreaElement>;

export class TextAreaComponent extends HTMLFieldComponent<TextAreaProps, HTMLTextAreaElement> {

  static displayName = "TextArea";

  /**
   * Render the textarea component.
   */
  public render() {
    const { formScope, validate, validateOnChange, format, className, ...props } = this.props;
    const value = this.value;

    return (
      <textarea
        {...props}
        className={this.classes}
        ref={this.bindRef}
        value={value !== null && value !== undefined ? "" + value : ""}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
      />
    );
  }

}

export const TextArea = withFormScope<TextAreaProps>(TextAreaComponent);