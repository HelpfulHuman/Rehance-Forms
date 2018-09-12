import * as React from "react";
import { Omit } from "./types";
import { Button } from "./Button";
import { ScopeContext } from "./ScopeContext";

export type SubmitButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled" | "form">
  & {
    disabledOnError?: boolean;
    disabledUntilChanged?: boolean;
    disabled?: boolean | { (scope: ScopeContext): boolean };
  };

export class SubmitButton extends React.PureComponent<SubmitButtonProps> {

  static defaultProps: Partial<SubmitButtonProps> = {
    disabledOnError: true,
    disabledUntilChanged: true,
  };

  /**
   * Handle the button click.
   */
  private handleClick = (ev: React.MouseEvent<HTMLButtonElement>, scope: ScopeContext) => {
    ev.preventDefault();
    scope.submit();

    if (this.props.onClick) {
      this.props.onClick(ev);
    }
  }

  /**
   * Render the button.
   */
  public render() {
    const { children, onClick, ...props } = this.props;

    return (
      <Button type="submit" {...props} onClickWithScope={this.handleClick}>
        {children}
      </Button>
    );
  }
}