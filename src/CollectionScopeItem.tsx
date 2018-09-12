import * as React from "react";
import { FieldMap } from "./types";
import { ScopeContext, ListScopeContext, FormScopeProvider } from "./ScopeContext";
import { FormEvent } from "./EventBus";

export type CollectionScopeItemChildrenProps = {
  scope: ScopeContext;
  removeItem(): void;
};

export type CollectionScopeItemProps = {
  parentScope: ListScopeContext;
  initialValues?: FieldMap;
  index: number;
  children(scope: CollectionScopeItemChildrenProps): React.ReactNode;
  onChange(index: number, values: FieldMap): void;
  onRemove(index: number): void;
};

export class CollectionScopeItem extends React.Component<CollectionScopeItemProps> {

  static defaultProps: Partial<CollectionScopeItemProps> = {
    initialValues: {},
  };

  private scope: ScopeContext;
  private unsubscribe: Function;

  constructor(props: CollectionScopeItemProps, context: any) {
    super(props, context);
    this.unsubscribe = props.parentScope.listen(this.handleScopeEvents);
  }

  /**
   * Unsubscribe from the field updates.
   */
  public componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * Handle field change on the scope.
   */
  private handleScopeEvents = (ev: FormEvent) => {

  }

  /**
   * Splice this element out of the parent array.
   */
  private handleRemove = () => {
    this.props.onRemove(this.props.index);
  }

  /**
   * Render the item scope.
   */
  public render() {
    return (
      <FormScopeProvider value={this.scope}>
        {this.props.children({
          scope: this.scope,
          removeItem: this.handleRemove,
        })}
      </FormScopeProvider>
    );
  }

}