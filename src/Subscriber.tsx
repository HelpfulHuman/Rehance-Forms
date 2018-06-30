import * as React from "react";
import { FormContext } from "./Context";
import { withForm, WithContextProps } from "./helpers";

export type SubscriberProps = {
  field: string | string[] | { (field: string): boolean };
  children(form: FormContext): React.ReactNode;
};

class _Subscriber extends React.PureComponent<WithContextProps<SubscriberProps>> {

  static displayName = "Subscriber";

  private unsubFormUpdate: Function;
  private unsubFieldUpdate: Function;
  private shouldUpdate: { (field: string): boolean };

  constructor(props: WithContextProps<SubscriberProps>, context: any) {
    super(props, context);
    this.bindUpdateCheck(props.field);
  }

  componentWillReceiveProps(nextProps: WithContextProps<SubscriberProps>) {
    if (this.props.field !== nextProps.field) {
      this.bindUpdateCheck(nextProps.field);
    }
  }

  componentWillMount() {
    this.unsubFormUpdate = this.props.form.onFormUpdate(this.forceUpdate.bind(this));
    this.unsubFieldUpdate = this.props.form.onFieldUpdate(this.handleFieldUpdate.bind(this));
  }

  componentWillUnmount() {
    this.unsubFormUpdate();
    this.unsubFieldUpdate();
  }

  protected bindUpdateCheck(fieldProp: any) {
    if (typeof fieldProp === "function") {
      this.shouldUpdate = fieldProp;
    } else if (typeof fieldProp === "string") {
      this.shouldUpdate = (field) => field === fieldProp;
    } else {
      this.shouldUpdate = (field) => fieldProp.indexOf(field) !== -1;
    }
  }

  protected handleFieldUpdate(field: string) {
    if (this.shouldUpdate(field)) {
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