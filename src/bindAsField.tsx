import * as React from "react";
import { FormContext, FieldState } from "./Context";
import { Subscriber } from "./Subscriber";

export type WithFieldProps<ChildProps> = ChildProps & {
  name: string;
  field: FieldState;
  form: FormContext;
};

export function bindAsField<ChildProps extends object = {}>(
  Component: React.ComponentType<WithFieldProps<ChildProps>>,
) {
  const name = Component.displayName || Component.name;

  return class extends React.PureComponent<ChildProps & { name: string }> {

    static displayName = `Field(${name})`;

    render() {
      const name = this.props.name;

      return (
        <Subscriber field={name}>
          {form => <Component {...this.props} field={form.getField(name)} form={form} />}
        </Subscriber>
      );
    }

  };
}