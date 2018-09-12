import * as React from "react";
import { withFormScope, WithFormScopeProps } from "./helpers";
import { ScopeContext, FormScopeProvider } from "./ScopeContext";

export type ScopeProps = {
  name: string;
};

export class _Scope extends React.PureComponent<WithFormScopeProps<ScopeProps>> {

  static displayName = "Scope";

  static defaultProps: Partial<ScopeProps> = {};

  private scope: ScopeContext;

  constructor(props: WithFormScopeProps<ScopeProps>, context: any) {
    super(props, context);
    const values = props.formScope.initialValues[this.props.name] || {};
    this.scope = new ScopeContext(values, props.formScope);
  }

  /**
   * Register the scope with the parent scope.
   */
  public componentWillMount() {
    this.props.formScope.setChild(this.props.name, this.scope);
  }

  /**
   * Unregister the scope with the parent scope.
   */
  public componentWillUnmount() {
    this.props.formScope.clearChild(this.props.name);
  }

  /**
   * Render the scope provider.
   */
  public render() {
    return (
      <FormScopeProvider value={this.scope}>
        {this.props.children}
      </FormScopeProvider>
    );
  }

}

export const Scope = withFormScope<ScopeProps>(_Scope);