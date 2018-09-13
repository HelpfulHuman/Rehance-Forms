import * as React from "react";
import { Omit } from "./types";
import { withFormScope, WithFormScopeProps } from "./helpers";
import { ScopeContext } from "./ScopeContext";

export type ButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">
  & {
    onClickWithScope?(ev: React.MouseEvent<HTMLButtonElement>, scope: ScopeContext): void;
    disabledOnError?: boolean | string[];
    disabledUntilChanged?: boolean | string[];
    disabled?: boolean | { (scope: ScopeContext): boolean };
  };

class _Button extends React.PureComponent<WithFormScopeProps<ButtonProps>> {

  static displayName = "Button";

  static defaultProps: Partial<ButtonProps> = {
    disabled: false,
  };

  private unsubscribe: Function;

  /**
   * Subscribe to scope changes and update the button when any
   * value on the scope has changed.
   */
  public componentWillMount() {
    this.unsubscribe = this.props.formScope.listen(() => this.forceUpdate());
  }

  /**
   * Unsubscribe from scope updates.
   */
  public componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * Determines if the button should be disabled.
   */
  private isDisabled(): boolean {
    const { formScope, disabled, disabledOnError, disabledUntilChanged } = this.props;

    // bail immediately if the standard disabled prop is (or returns) true
    if (
      (disabled === true) ||
      (typeof disabled === "function" && disabled(formScope))
    ) {
      return true;
    }

    // check for form errors if the disabledOnError prop is set
    if (
      disabledOnError && (
        (Array.isArray(disabledOnError) && formScope.getErrors(disabledOnError)) ||
        !formScope.valid
      )
    ) {
      return true;
    }

    // finally, check for changes on the form when the disabledUntilChange prop is set
    if (
      disabledUntilChanged && (
        (Array.isArray(disabledUntilChanged) && formScope.hasChanges(disabledUntilChanged)) ||
        !formScope.changed
      )
    ) {
      return true;
    }

    return false;
  }

  /**
   * Handles click events for the button.
   */
  private handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (this.props.onClickWithScope) {
      this.props.onClickWithScope(ev, this.props.formScope);
    }

    if (this.props.onClick) {
      this.props.onClick(ev);
    }
  }

  /**
   * Render the button.
   */
  public render() {
    const { formScope, disabled, disabledOnError, disabledUntilChanged, onClickWithScope, children, ...props } = this.props;

    return (
      <button
        {...props}
        onClick={this.handleClick}
        disabled={this.isDisabled()}
      >
        {children}
      </button>
    );
  }

}

export const Button = withFormScope<ButtonProps>(_Button as any);