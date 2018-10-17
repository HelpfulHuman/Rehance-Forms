import * as React from "react";
import { WithFormScopeProps, withFormScope } from "./helpers";
import { FormEvent, FormEventSignal } from "./EventBus";
import { ListScopeContext, ScopeContext, FormScopeProvider } from "./ScopeContext";

export type CollectionScopeItemChildrenProps = {
  index: number;
  total: number;
  scope: ScopeContext;
  removeItem(): void;
};

export type CollectionScopeProps = {
  name: string;
  children(form: CollectionScopeItemChildrenProps): React.ReactNode;
};

/**
 * The collection scope allows for an array of objects to be mapped to a
 * subform of fields.
 */
export class _CollectionScope extends React.Component<WithFormScopeProps<CollectionScopeProps>> {

  static displayName: string = "CollectionScope";

  private scope: ListScopeContext;
  // private keyOffset = 1;
  private unsubscribe: Function;

  /**
   * Subscribe to changes to the parent array for this scope.
   */
  public componentWillMount() {
    const { formScope, name } = this.props;
    let values: any[] = formScope.initialValues[name] || [];

    if (!Array.isArray(values)) {
      console.warn(`The value for ${this.props.name} is not an array!  Value will be overridden with an array by CollectionScope.`);
      values = [];
    }

    this.scope = new ListScopeContext(values, formScope);
    formScope.setChild(this.props.name, this.scope);
    this.unsubscribe = formScope.listen(this.handleScopeEvent);
  }

  /**
   * Unsubscribe from changes to the parent array for this scope.
   */
  public componentWillUnmount() {
    this.unsubscribe();
    this.props.formScope.clearChild(this.props.name);
  }

  /**
   * Triggers a re-render, only when the array has had an update triggered.
   */
  private handleScopeEvent = (ev: FormEvent) => {
    const isSameOrAncestorScope = ev.scope.isAncestorOf(this.scope);
    if ((!ev.field || ev.field === this.props.name) && isSameOrAncestorScope) {
      // this.keyOffset += 1;
      this.forceUpdate();
    }
  }

  /**
   * Handles the removal of a single item.
   */
  private handleItemRemoval = (index: number) => {
    this.scope.removeChildScope(index);
    this.scope.broadcast(FormEventSignal.FieldUpdate, this.props.name);
  }

  /**
   * Renders a scoped form for each item in the array.
   */
  private renderItemScoped = (scope: ScopeContext, idx: number) => {
    return (
      <FormScopeProvider
        key={scope.id}
        value={scope}
      >
        {this.props.children({
          index: idx,
          scope: scope,
          total: this.scope.children.length,
          removeItem: () => this.handleItemRemoval(idx),
        })}
      </FormScopeProvider>
    );
  }

  /**
   * Renders the collection scopes.
   */
  public render() {
    return (
      <React.Fragment>
        {this.scope.children.map(this.renderItemScoped)}
      </React.Fragment>
    );

  }

}

export const CollectionScope = withFormScope<CollectionScopeProps>(_CollectionScope);