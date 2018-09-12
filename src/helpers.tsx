import * as React from "react";
import { FormScopeConsumer, ScopeContext } from "./ScopeContext";

export type WithFormScopeProps<ChildProps> = ChildProps & {
  formScope: ScopeContext;
  ref?: React.Ref<any>;
};

/**
 * Creates a higher-order component that binds the given component to the FormScopeConsumer
 * that provides access to the form scope context API.
 */
export function withFormScope<ChildProps extends object = {}>(Component: React.ComponentType<WithFormScopeProps<ChildProps>>) {
  const Result = React.forwardRef<any, ChildProps>(function (props, ref) {
    return (
      <FormScopeConsumer>
        {context => <Component {...props} formScope={context!} ref={ref!} />}
      </FormScopeConsumer>
    );
  });

  Result.displayName = (Component.displayName || Component.name);

  return Result;
}