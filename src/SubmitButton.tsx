import * as React from "react";
import { Omit } from "./types";
import { FormContext } from "./Context";
import { Button } from "./Button";

export type SubmitButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled">
  & {
    disabledOnError?: true | string[];
    disabledUntilChanged?: true | string[];
    disabled?: boolean | { (form: FormContext): boolean };
  };

export class SubmitButton extends React.PureComponent<SubmitButtonProps> {

  static defaultProps: Partial<SubmitButtonProps> = {
    disabledOnError: true,
    disabledUntilChanged: true,
  };

  render() {
    const { children, ...props } = this.props;

    return (
      <Button type="submit" {...props}>
        {children}
      </Button>
    );
  }
}