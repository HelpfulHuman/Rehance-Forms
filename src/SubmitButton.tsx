import * as React from "react";
import { withForm, WithContextProps } from "./helpers";
import { Omit } from "./types";
import { FormContext } from "./Context";

export type SubmitButtonProps =
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled">
  & {
    disabled?(form: FormContext): boolean;
  };

class _SubmitButton extends React.PureComponent<WithContextProps<SubmitButtonProps>> {

  static displayName = "SubmitButton";

  static defaultProps: Partial<SubmitButtonProps> = {
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
        type="submit"
        disabled={disabled!(form)}
      >
        {children}
      </button>
    );
  }

}

export const SubmitButton = withForm<SubmitButtonProps>(_SubmitButton as any);