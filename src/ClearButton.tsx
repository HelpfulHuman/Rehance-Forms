import * as React from "react";
import { Omit } from "./types";
import { Button } from "./Button";
import { ScopeContext } from "./ScopeContext";

export type ClearButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">
  & {
    disabledOnError?: boolean | string[];
    disabledUntilChanged?: boolean | string[];
    disabled?: boolean | { (scope: ScopeContext): boolean };
  };

export class ClearButton extends React.PureComponent<ClearButtonProps> {

  static defaultProps: Partial<ClearButtonProps> = {
    disabled(scope: ScopeContext) {
      const values = scope.value;
      return Object.keys(values).length === 0;
    },
  };

  /**
   * Handle the button click.
   */
  private handleClick = (ev: React.MouseEvent<HTMLButtonElement>, scope: ScopeContext) => {
    scope.clear();
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