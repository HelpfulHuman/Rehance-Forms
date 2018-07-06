import * as React from "react";
import { withForm, WithContextProps } from "./helpers";
import { Omit } from "./types";
import { FormContext } from "./Context";

export type ButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">
  & {
    onClickWithForm?(ev: React.MouseEvent<HTMLButtonElement>, form: FormContext): void;
    disabledOnError?: boolean | string[];
    disabledUntilChanged?: boolean | string[];
    disabled?: boolean | { (form: FormContext): boolean };
  };

class _Button extends React.PureComponent<WithContextProps<ButtonProps>> {

  static displayName = "Button";

  static defaultProps: Partial<ButtonProps> = {
    disabled: false,
  };

  unsubFormUpdate: Function;
  unsubFieldUpdate: Function;

  componentWillMount() {
    this.unsubFormUpdate = this.props.form.onFormUpdate(() => this.forceUpdate());
    this.unsubFieldUpdate = this.props.form.onFieldUpdate(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubFormUpdate();
    this.unsubFieldUpdate();
  }

  private isDisabled(): boolean {
    const { form, disabled, disabledOnError, disabledUntilChanged } = this.props;

    // bail immediately if the standard disabled prop is (or returns) true
    if (
      (disabled === true) ||
      (typeof disabled === "function" && disabled(form))
    ) {
      return true;
    }

    // check for form errors if the disabledOnError prop is set
    if (!!disabledOnError) {
      let fields = (Array.isArray(disabledOnError) ? disabledOnError : []);
      if (form.hasErrors(...fields)) {
        return true;
      }
    }

    // finally, check for changes on the form or specific fields when the
    // disabledUntilChange prop is set
    if (!!disabledUntilChanged) {
      let fields = (Array.isArray(disabledUntilChanged) ? disabledUntilChanged : []);
      if (form.hasChanged(...fields)) {
        return true;
      }
    }

    return false;
  }

  private handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (this.props.onClickWithForm) {
      this.props.onClickWithForm(ev, this.props.form);
    }

    if (this.props.onClick) {
      this.props.onClick(ev);
    }
  }

  render() {
    const { form, disabled, disabledOnError, disabledUntilChanged, onClickWithForm, children, ...props } = this.props;

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

export const Button = withForm<ButtonProps>(_Button as any);