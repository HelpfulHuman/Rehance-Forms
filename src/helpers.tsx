import * as React from "react";
import { FormConsumer, FormContext } from "./Context";

export type WithContextProps<ChildProps> = ChildProps & {
  form: FormContext;
  ref: React.Ref<any>;
};

/**
 * Creates a higher-order component that binds the given component as
 * the render prop for FormConsumer.
 */
export function withForm<ChildProps = {}>(Component: React.ComponentType<WithContextProps<ChildProps>>) {
  return React.forwardRef<any, ChildProps>(function (props, ref) {
    return (
      <FormConsumer>
        {context => <Component {...props} form={context!} ref={ref!} />}
      </FormConsumer>
    );
  });
}