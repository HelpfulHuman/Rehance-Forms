import * as React from "react";
import { WithFormScopeProps, withFormScope } from "./helpers";
import { ScopeContext } from "./ScopeContext";
import { FormEvent } from "./EventBus";

export type SubscriberProps = {
  field: string | string[] | { (ev: FormEvent): boolean };
  children(scope: ScopeContext): React.ReactNode;
};

class _Subscriber extends React.PureComponent<WithFormScopeProps<SubscriberProps>> {

  static displayName = "Subscriber";

  private unsubscribe: Function;
  private shouldUpdate: { (ev: FormEvent): boolean };

  constructor(props: WithFormScopeProps<SubscriberProps>, context: any) {
    super(props, context);
    this.bindUpdateCheck(props.field);
  }

  /**
   * Generate the update predicate when props are changed.
   */
  public componentWillReceiveProps(nextProps: WithFormScopeProps<SubscriberProps>) {
    if (this.props.field !== nextProps.field) {
      this.bindUpdateCheck(nextProps.field);
    }
  }

  /**
   * When the component mounts, subscribe to scope updates.
   */
  public componentWillMount() {
    this.unsubscribe = this.props.formScope.listen(this.handleScopeEvents);
  }

  /**
   * When the component unmounts, unsubscribe from scope updates.
   */
  public componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * Generate the update predicate.
   */
  protected bindUpdateCheck(fieldProp: any) {
    if (typeof fieldProp === "function") {
      this.shouldUpdate = fieldProp;
    } else if (Array.isArray(fieldProp)) {
      this.shouldUpdate = (ev: FormEvent) => {
        return !ev.field || fieldProp.indexOf(ev.field) !== -1;
      };
    } else if (typeof fieldProp === "string") {
      this.shouldUpdate = (ev: FormEvent) => {
        return !ev.field || ev.field === fieldProp;
      };
    } else {
      this.shouldUpdate = () => true;
    }
  }

  /**
   * Determine whether the subscriber should force and update.
   */
  protected handleScopeEvents = (ev: FormEvent) => {
    if (this.shouldUpdate(ev)) {
      this.forceUpdate();
    }
  }

  /**
   * Render the component.
   */
  public render() {
    return (
      <React.Fragment>
        {this.props.children(this.props.formScope)}
      </React.Fragment>
    );
  }

}

export const Subscriber = withFormScope<SubscriberProps>(_Subscriber);