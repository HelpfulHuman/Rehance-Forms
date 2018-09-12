import * as React from "react";
import { FieldMap } from "./types";
import { WithFormScopeProps, withFormScope } from "./helpers";
import { FieldContext } from "./FieldContext";
import { ScopeContext } from "./ScopeContext";
import { FormEventSignal } from "./EventBus";

export type AddCollectionItemProps = {
  field: string;
  values?: FieldMap;
  className?: string;
  style?: React.CSSProperties;
};

export class _AddCollectionItem extends React.Component<WithFormScopeProps<AddCollectionItemProps>> {

  static displayName: string = "AddCollectionItem";

  static defaultProps: Partial<AddCollectionItemProps> = {
    values: {},
  };

  /**
   * Handle the button click that will add a new item to the array item within
   * the scope.
   */
  private handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    let formScope: ScopeContext = this.props.formScope;
    let field: FieldContext | null = formScope.field(this.props.field);
    let arr: any[] = (!!field ? field.value : []);
    if (!Array.isArray(arr)) {
      console.warn(`AddCollectionItem cannot add an item to the field "${this.props.field}" because the field is not an array.`);
      return;
    }
    arr = arr.concat(this.props.values);
    field.value = arr;
    formScope.broadcast(FormEventSignal.FieldUpdate, this.props.field);
  }

  /**
   * Render the button.
   */
  public render() {
    return (
      <button
        style={this.props.style}
        className={this.props.className}
        onClick={this.handleClick}
      >
        {this.props.children}
      </button>
    );
  }

}

export const AddCollectionItem = withFormScope<AddCollectionItemProps>(_AddCollectionItem);