import * as React from "react";
import { Omit } from "./types";
import { FormContext } from "./Context";
import { Button } from "./Button";

export type ResetButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">
  & {
    disabledOnError?: true | string[];
    disabledUntilChanged?: true | string[];
    disabled?: boolean | { (form: FormContext): boolean };
  };

export class ResetButton extends React.PureComponent<ResetButtonProps> {

  static defaultProps: Partial<ResetButtonProps> = {
    disabledOnError: true,
    disabledUntilChanged: true,
  };

  private handleClick = (ev: React.MouseEvent<HTMLButtonElement>, form: FormContext) => {
    form.reset();
  }

  render() {
    const { children, ...props } = this.props;

    return (
      <Button
        {...props}
        onClickWithForm={this.handleClick}
      >
        {children}
      </Button>
    );
  }
}