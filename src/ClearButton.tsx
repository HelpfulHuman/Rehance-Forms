import * as React from "react";
import { Omit } from "./types";
import { FormContext } from "./Context";
import { Button } from "./Button";

export type ClearButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">
  & {
    disabledOnError?: true | string[];
    disabledUntilChanged?: true | string[];
    disabled?: boolean | { (form: FormContext): boolean };
  };

export class ClearButton extends React.PureComponent<ClearButtonProps> {

  static defaultProps: Partial<ClearButtonProps> = {
    disabled(form: FormContext) {
      const values = form.getValues();
      return Object.keys(values).length === 0;
    },
  };

  private handleClick = (ev: React.MouseEvent<HTMLButtonElement>, form: FormContext) => {
    form.setValues({});
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