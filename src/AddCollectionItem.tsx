import * as React from "react";
import { FieldMap } from "./types";
import { WithFormScopeProps, withFormScope } from "./helpers";
import { FieldContext } from "./FieldContext";
import { ScopeContext, ListScopeContext } from "./ScopeContext";
import { FormEventSignal } from "./EventBus";

export type AddCollectionItemProps = {
  to: string;
  values?: FieldMap;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean | { (scope: ScopeContext): boolean };
  onClick?(ev: React.MouseEvent<HTMLButtonElement>, scope: ScopeContext): void;
};

class _AddCollectionItem extends React.Component<WithFormScopeProps<AddCollectionItemProps>> {

  static displayName: string = "AddCollectionItem";

  /**
   * Checks if the component should be considered disabled or not.
   */
  private isDisabled() {
    return (typeof this.props.disabled === "function" ? this.props.disabled(this.props.formScope) : this.props.disabled);
  }

  /**
   * Handle the button click that will add a new item to the array item within
   * the scope.
   */
  private handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    if (this.isDisabled()) { return; }

    let formScope: ScopeContext = this.props.formScope;

    let scopeChild = formScope.getChild(this.props.to);
    if (!scopeChild) {
      console.warn(`AddCollectionItem cannot add an item to the "${this.props.to}" field becaue it does not exist.`);
      return;
    }

    if (scopeChild instanceof FieldContext) {
      let arr: any[] = scopeChild.value;
      if (Array.isArray(arr)) {
        arr.push(this.props.values);
        formScope.broadcast(FormEventSignal.FieldUpdate, this.props.to);
      }
    } else if (scopeChild instanceof ListScopeContext) {
      scopeChild.addChildScope(this.props.values!);
      formScope.broadcast(FormEventSignal.FieldUpdate, this.props.to);
    } else {
      console.warn(`AddCollectionItem cannot add an item to "${this.props.to}" because the target is not an array field or CollectionScope.`);
    }

    if (this.props.onClick) {
      this.props.onClick(ev, formScope);
    }

  }

  /**
   * Render the button.
   */
  public render() {
    return (
      <button
        type="button"
        style={this.props.style}
        className={this.props.className}
        disabled={this.isDisabled()}
        onClick={this.handleClick}
      >
        {this.props.children}
      </button>
    );
  }

}

export const AddCollectionItem = withFormScope<AddCollectionItemProps>(_AddCollectionItem);