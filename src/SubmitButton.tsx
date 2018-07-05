import * as React from "react";
import { Omit } from "./types";
import { FormContext } from "./Context";
import { Button } from "./Button";

export type SubmitButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled">
  & {
    disabled?(form: FormContext): boolean;
  };

export function SubmitButton({ disabled, children, ...props }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled} {...props}>
      {children}
    </Button>
  );
}