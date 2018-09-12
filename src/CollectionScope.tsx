import * as React from "react";
import { FieldMap } from "./types";
import { CollectionScopeItemChildrenProps, CollectionScopeItem } from "./CollectionScopeItem";
import { WithFormScopeProps, withFormScope } from "./helpers";
import { FormEvent } from "./EventBus";
import { ListScopeContext } from "./ScopeContext";

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
  private keyOffset = 1;
  private unsubscribe: Function;

  /**
   * Subscribe to changes to the parent array for this scope.
   */
  public componentWillMount() {
    const { formScope, name } = this.props;
    let values: any[] = formScope.initialValues[name] || [];
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
    if (
      ev.field === this.props.name &&
      !ev.scope.isDescendentOf(this.props.formScope)
    ) {
      this.keyOffset += 1;
      this.forceUpdate();
    }
  }

  /**
   * Handles the removal of a single item.
   */
  private handleItemRemoval = (index: number) => {
    let arr: any[] = this.props.form.getValue(this.props.name, []).slice(0);
    arr.splice(index, 1);
    this.props.form.setValue(this.props.name, arr);
  }

  /**
   * Renders a scoped form for each item in the array.
   */
  private renderItemScoped = (value: FieldMap = {}, idx: number) => {
    return (
      <CollectionScopeItem
        key={(idx + 1) * this.keyOffset}
        index={idx}
        initialValues={value}
        parentScope={this.props.form}
        onChange={this.handleItemUpdate}
        onRemove={this.handleItemRemoval}
      >
        {this.props.children}
      </CollectionScopeItem>
    );
  }

  /**
   * Renders the collection scopes.
   */
  public render() {
    let arr = this.props.form.getValue(this.props.name, []);
    if (!Array.isArray(arr)) {
      console.warn(`CollectionScope with name of "${this.props.name}" references a non-array value!`);
      return (<React.Fragment />);
    }

    return (
      <React.Fragment>
        {arr.map(this.renderItemScoped)}
      </React.Fragment>
    );

  }

}

export const CollectionScope = withFormScope<CollectionScopeProps>(_CollectionScope);