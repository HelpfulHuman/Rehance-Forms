import * as React from "react";
import { withForm, WithContextProps } from "./helpers";
import { Omit } from "./types";
import { FormContext } from "./Context";

export type ButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">
  & {
    disabled?(form: FormContext): boolean;
  };

class _Button extends React.PureComponent<WithContextProps<ButtonProps>> {

  static displayName = "Button";

  static defaultProps: Partial<ButtonProps> = {
    disabled(form: FormContext) {
      return form.hasErrors();
    },
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

  render() {
    const { form, disabled, children, ...props } = this.props;

    return (
      <button
        {...props}
        disabled={disabled!(form)}
      >
        {children}
      </button>
    );
  }

}

export const Button = withForm<ButtonProps>(_Button as any);