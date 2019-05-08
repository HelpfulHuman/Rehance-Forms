import * as React from "react";
import { WithFormScopeProps, withFormScope } from "./helpers";
import { FormEvent, FormEventSignal } from "./EventBus";
import { ListScopeContext, ScopeContext, FormScopeProvider } from "./ScopeContext";
import { memoize } from "./utils";

export type CollectionScopeItemChildrenProps = {
  index: number;
  total: number;
  scope: ScopeContext;
  removeItem(): void;
};

export type CollectionScopeProps = {
  /** The field key that this collection scope will mount to. */
  name: string;
  /** Event that is triggered when an update is triggered realted to this collection scope (but not necessarily _by_ this collection scope. Called _after_ re-render and scope update. */
  onChange?(scope: ListScopeContext): void;
  /** Event that is triggered when an item is removed from the collection via the `removeItem` callback given to `children`.  Called _after_ re-render and scope update. */
  onRemove?(index: number, scope: ListScopeContext): void;
  /** Renders a form or view per item in this collection scope. */
  children(itemScope: CollectionScopeItemChildrenProps): React.ReactNode;
};

/**
 * The collection scope allows for an array of objects to be mapped to a
 * subform of fields.
 */
class _CollectionScope extends React.Component<WithFormScopeProps<CollectionScopeProps>> {

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
      if (this.props.onChange) {
        this.props.onChange(this.scope);
      }
    }
  }

  /**
   * Handles the removal of a single item.
   */
  private bindItemRemoval = memoize((index: number) => {
    this.scope.removeChildScope(index);
    this.scope.broadcast(FormEventSignal.FieldUpdate, this.props.name);
    if (this.props.onRemove) {
      this.props.onRemove(index, this.scope);
    }
  });

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
          removeItem: this.bindItemRemoval(`remove_${idx}`, idx),
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