import * as React from "react";
import { FormContext } from "./Context";
import { withForm, WithContextProps } from "./helpers";

export type SubscriberProps = {
  name: string | string[];
  children(form: FormContext): React.ReactNode;
};

class _Subscriber extends React.PureComponent<WithContextProps<SubscriberProps>> {

  static displayName = "Subscriber";

  private unsubFormUpdate: Function;
  private unsubFieldUpdate: Function;

  componentWillMount() {
    this.unsubFormUpdate = this.props.form.onFormUpdate(this.forceUpdate.bind(this));
    this.unsubFieldUpdate = this.props.form.onFieldUpdate(this.handleFieldUpdate.bind(this));
  }

  componentWillUnmount() {
    this.unsubFormUpdate();
    this.unsubFieldUpdate();
  }

  protected handleFieldUpdate(field: string) {
    const name = this.props.name;
    const observed = (typeof name === "string" ? [name] : name);

    if (observed.indexOf(field) !== -1) {
      this.forceUpdate();
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children(this.props.form)}
      </React.Fragment>
    );
  }

}

export const Subscriber = withForm<SubscriberProps>(_Subscriber);