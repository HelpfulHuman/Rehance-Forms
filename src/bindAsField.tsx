import * as React from "react";
import { withFormScope, WithFormScopeProps } from "./helpers";
import { FormEvent, FormEventSignal } from "./EventBus";
import { FieldContext } from "./FieldContext";
import { ScopeContext } from "./ScopeContext";

export type FieldMutations = {
  update(nextState: Partial<FieldState>): void;
};

export type WithFieldProps<ChildProps> = ChildProps & {
  name: string;
  field: FieldState & FieldMutations;
  scope: ScopeContext;
};

export type CustomFieldProps<ChildProps> = ChildProps & {
  name: string;
};

export type FieldState = {
  value: any;
  error: string | null;
  touched: boolean;
  changed: boolean;
};

export function bindAsField<ChildProps extends object = {}>(
  Component: React.ComponentType<WithFieldProps<ChildProps>>,
) {
  const name = Component.displayName || Component.name;

  return withFormScope<CustomFieldProps<ChildProps>>(class extends React.PureComponent<WithFormScopeProps<CustomFieldProps<ChildProps>>, FieldState> {

    static displayName = `Field(${name})`;

    private fieldState: FieldContext;

    private unsubscribe: Function;

    /**
     * Register the field with the parent scope and add a subscriber to
     * the scope updates.
     */
    public componentWillMount() {
      const scope: ScopeContext = this.props.formScope;
      this.fieldState = scope.field(this.props.name);
      this.unsubscribe = scope.listen(this.handleScopeEvents);
    }

    /**
     * Unregister the field from the parent scope and unsubscribe from scope events.
     */
    public componentWillUnmount() {
      this.props.formScope.clearChild(this.props.name);
      this.unsubscribe();
    }

    /**
     * Handle updates from the current scope that this field belongs to.
     */
    private handleScopeEvents = (ev: FormEvent) => {
      const scope: ScopeContext = this.props.formScope;
      if (!ev.field && ev.scope.isAncestorOf(scope) || ev.field === this.props.name) {
        this.forceUpdate();
      }
    }

    /**
     * Update the state for the form field.
     */
    public update = (nextState: Partial<FieldState>) => {
      if ("value" in nextState) {
        this.fieldState.value = nextState.value;
      }

      if ("error" in nextState) {
        this.fieldState.error = nextState.error || null;
      }

      if ("touched" in nextState) {
        this.fieldState.touched = !!nextState.touched;
      }

      this.triggerUpdate();
    }

    /**
     * Trigger a scope update for the field.
     */
    private triggerUpdate = () => {
      this.props.formScope.broadcast(FormEventSignal.FieldUpdate, this.props.name);
    }

    /**
     * Render the child component for the field.
     */
    public render() {
      const { formScope, ...props } = this.props as any;
      const field: FieldState & FieldMutations = {
        value: this.fieldState.value,
        error: this.fieldState.error,
        touched: this.fieldState.touched,
        changed: this.fieldState.changed,
        update: this.update,
      };

      return (
        <Component
          {...props}
          scope={formScope}
          field={field}
        >
          {this.props.children}
        </Component>
      );
    }

  });
}