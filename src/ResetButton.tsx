import * as React from "react";
import { Omit } from "./types";
import { Button } from "./Button";
import { ScopeContext } from "./ScopeContext";

export type ResetButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">
  & {
    disabledOnError?: boolean;
    disabledUntilChanged?: boolean;
    disabled?: boolean | { (scope: ScopeContext): boolean };
  };

export class ResetButton extends React.PureComponent<ResetButtonProps> {

  static defaultProps: Partial<ResetButtonProps> = {
    disabledOnError: true,
    disabledUntilChanged: true,
  };

  /**
   * Handle the button click.
   */
  private handleClick = (ev: React.MouseEvent<HTMLButtonElement>, scope: ScopeContext) => {
    scope.reset();
  }

  /**
   * Render the button.
   */
  public render() {
    const { children, ...props } = this.props;

    return (
      <Button
        {...props}
        onClickWithScope={this.handleClick}
      >
        {children}
      </Button>
    );
  }
}