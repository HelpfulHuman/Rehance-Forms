import * as React from "react";
import { FormContext, FormProvider } from "./Context";
import { FieldMap } from "./types";
import { FormScopeContext } from "./FormScopeContext";

export type CollectionScopeItemChildrenProps = {
  scope: FormContext;
  removeItem(): void;
};

export type CollectionScopeItemProps = {
  parentScope: FormContext;
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

  private scopedApi: FormContext;
  private unsubFieldUpdate: Function;

  constructor(props: CollectionScopeItemProps, context: any) {
    super(props, context);
    this.scopedApi = new FormScopeContext(props.initialValues, props.parentScope);
    this.unsubFieldUpdate = this.scopedApi.onFieldUpdate(this.handleChange);
  }

  /**
   * Unsubscribe from the field updates.
   */
  componentWillUnmount() {
    this.unsubFieldUpdate();
  }

  /**
   * Handle field change on the scope.
   */
  private handleChange = () => {
    console.log("scope item handle change triggered");
    this.props.onChange(this.props.index, this.scopedApi.getValues());
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
  render() {
    return (
      <FormProvider value={this.scopedApi}>
        {this.props.children({
          scope: this.scopedApi,
          removeItem: this.handleRemove,
        })}
      </FormProvider>
    );
  }

}