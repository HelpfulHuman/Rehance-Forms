import * as React from "react";
import { withForm } from "./helpers";
import { Omit } from "./types";
import { HTMLFieldComponent, FieldProps } from "./HTMLField";

export type TextAreaProps =
  & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "form">
  & FieldProps<HTMLTextAreaElement>;

export class TextAreaComponent extends HTMLFieldComponent<TextAreaProps, HTMLTextAreaElement> {

  static displayName = "TextArea";

  render() {
    const { form, validate, validateOnChange, format, className, ...props } = this.props;

    return (
      <textarea
        {...props}
        className={this.classes}
        ref={this.bindRef}
        value={this.value || ""}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
      />
    );
  }

}

export const TextArea = withForm<TextAreaProps>(TextAreaComponent);