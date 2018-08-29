import * as React from "react";
import { FormContext, FieldState, FieldStatePartial } from "./Context";
import { WithContextProps, withForm } from "./helpers";

export type FieldMutations = {
  update(nextState: FieldStatePartial<any>): void;
};

export type WithFieldProps<ChildProps> = ChildProps & {
  name: string;
  field: FieldState & FieldMutations;
  form: FormContext;
};

export type CustomFieldProps<ChildProps> = ChildProps & {
  name: string;
};

export function bindAsField<ChildProps extends object = {}>(
  Component: React.ComponentType<WithFieldProps<ChildProps>>,
) {
  const name = Component.displayName || Component.name;

  return withForm<CustomFieldProps<ChildProps>>(class extends React.PureComponent<WithContextProps<CustomFieldProps<ChildProps>>> {

    static displayName = `Field(${name})`;

    form: FormContext;
    unsubFormUpdate: Function;
    unsubFieldUpdate: Function;

    componentWillMount() {
      this.props.form.register(this.props.name);
      this.unsubFormUpdate = this.props.form.onFormUpdate(this.forceUpdate.bind(this));
      this.unsubFieldUpdate = this.props.form.onFieldUpdate(this.handleFieldUpdate);
    }

    componentWillUnmount() {
      this.unsubFormUpdate();
      this.unsubFieldUpdate();
      this.props.form.unregister(this.props.name);
    }

    handleFieldUpdate = (name: string) => {
      if (this.props.name === name) {
        this.forceUpdate();
      }
    }

    update = (nextState: FieldStatePartial<any>) => {
      this.form.setField(this.props.name, nextState);
    }

    render() {
      const state = this.props.form.getField(this.props.name);
      const field = { ...state, update: this.update };

      return (
        <Component {...this.props} field={field} />
      );
    }

  });
}