import * as React from "react";
import { InputHTMLAttributes, SyntheticEvent } from "react";
import {isFunc, isPromise} from "./utils";

export interface FieldValues {
  [field: string]: any;
}

export type FieldErrors<Fields> = {
  [field in keyof Fields]: string;
}

export type FieldState<Fields> = {
  [field in keyof Fields]: boolean;
}

export type FieldMethods<Fields> = {
  [field in keyof Fields]: {
    onFocus(ev: SyntheticEvent<any>): void;
    onChange(ev: SyntheticEvent<any>): void;
    onBlur(ev: SyntheticEvent<any>): void;
  };
}

export type FieldProps<Fields> = FieldMethods<Fields> & {
  [field in keyof Fields]: {
    value: Fields[field];
    error: string;
    dirty: boolean;
  };
}

export type FormChildProps<Fields> = {
  isValid: boolean;
  isClean: boolean;
  hasErrors: boolean;
  hasChanges: boolean;
  onSubmit(): void;
  reset(): void;
  resetWith(fields: Fields): void;
  setValues(values: Fields): void;
  setErrors(errors: FieldErrors<Fields>): void;
};

export type FormProps<Fields> =
  & FormChildProps<Fields>
  & FieldProps<Fields>;

export type ChildProps<Fields, Props> = Props & {
  form: FormProps<Fields>; // TODO: Make "form" match a given namespace string
  [namespace: string]: FormProps<Fields>;
};

export interface FormState<Fields> {
  allowSubmit: boolean;
  focused: keyof Fields;
  hasChanges: boolean;
  hasErrors: boolean;
  values: Fields;
  errors: FieldErrors<Fields>;
  dirty: FieldState<Fields>;
}

export interface Validator<Fields, Props> {
  (fields: Fields, props: Props): object|Promise<object>;
}

export interface AsyncValidator<Fields, Props> {
  (form: Fields, props: Props): Promise<object>;
}

export interface FormOptions<Fields = any, Props = any> {
  namespace?: string;
  fields: Fields|{(props: Props): Fields};
  validate?: Validator<Fields, Props>;
  onSubmit?(fields: Fields, props: Props): void;
  shouldResetValues?(nextProps: Props, prevProps: Props): boolean;
}

export interface ComponentFactory<Props, ChildProps> {
  (Component: React.ComponentClass<ChildProps>|React.StatelessComponent<ChildProps>): React.ComponentClass<Props>;
}

export function createForm<Fields = any, Props = any>(opts: FormOptions<Fields, Props>): ComponentFactory<Props, ChildProps<Fields, Props>> {
  // Cache options and apply defaults
  const ns = (opts.namespace || "form");

  // Create a function out of the values object
  const getFields = (typeof opts.fields === "function" ? opts.fields : (props) => opts.fields);

  // Create a validator that supports both return values and promises
  const validate = (opts.validate ? opts.validate : () => null);

  // Return a factory method for generating new components
  return function (Component) {
    return class extends React.Component<Props, FormState<Fields>> {

      state: FormState<Fields> = {
        allowSubmit: false,
        focused: null,
        hasChanges: false,
        hasErrors: false,
        values: {} as any,
        errors: {} as any,
        dirty: {} as any,
      };

      private methods: FieldMethods<Fields> = {} as any;

      private initialValues: Fields = {} as any;

      /**
       * Constructor.
       */
      constructor(props, context) {
        super(props, context);

        // Hard-bind methods
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.validateAndSetValues = this.validateAndSetValues.bind(this);
        this.setErrorsManually = this.setErrorsManually.bind(this);
        this.resetWith = this.resetWith.bind(this);

        // Get the values for the form fields
        var fields = getFields(props);

        // Create the methods for managing fields
        for (var name in fields as object) {
          this.setupField(name, fields[name]);
        }
      }

      /**
       * Create methods for managing a field.
       */
      setupField(name: string, value: any): void {
        // Set the given value as the initial value for comparing dirty states
        this.initialValues[name] = value;

        // Set our initial values in state now
        this.state.values[name] = value;
        this.state.dirty[name]  = false;

        // Bind a set method handler for this field
        this.methods[name] = {
          onFocus: (event) => this.handleFocus(event, name),
          onBlur: (event) => this.handleBlur(event, name),
          onChange: (event) => this.handleChange(event, name),
        };
      }

      /**
       * Reset the form values when new props come in.
       */
      componentWillReceiveProps(nextProps: Props): void {
        if (
          nextProps &&
          isFunc(opts.shouldResetValues) &&
          opts.shouldResetValues(nextProps, this.props)
        ) {
          this.resetWith(getFields(nextProps) as any);
        }
      }

      /**
       * Reset with specific values regardless of known fields.
       */
      resetWith(fields: Fields) {
        this.initialValues = fields;
        this.handleReset();
      }

      /**
       * Run validation on the whole form.
       */
      private validateForm(): void {
        // Disallow submit until AFTER validation
        this.setState({ allowSubmit: false });

        // Validate the entire form's contents
        try {
          var res = validate(this.state.values, this.props) as any;

          if (!isPromise(res) && res) {
            res = Promise.reject(res);
          } else if (!isPromise(res)) {
            return;
          }

          res.then(() => {
            this.setState({
              allowSubmit: true,
              hasErrors: false,
              hasChanges: true,
              errors: {} as any,
            });
          })
          .catch((errors = {}) => {
            // Comb through errors and only display errors for dirty fields
            var hasErrors = false;
            for (var k in this.state.values) {
              if (this.state.dirty[k] && errors[k as string]) {
                hasErrors = true;
              } else {
                delete errors[k as any];
              }
            }

            // Update the state with the new errors
            this.setState({
              allowSubmit: false,
              hasErrors: hasErrors,
              hasChanges: hasErrors,
              errors: (errors || {}),
            } as any);
          });
        } catch (err) {
          console.warn("An error occurred in your form validation that does not conform to the validation format.", err);
        }
      }

      /**
       * Handle focus for either an anonymous input component or an explicitly named
       * field that was previously bound.
       */
      handleFocus(ev: React.SyntheticEvent<any>, name?: string): void {
        // Attempt to get a name from the SyntheticEvent if one is not given explicitly
        if (!name) name = (ev.currentTarget.name || null);

        // Set the focused state for this field
        this.setState((state) => ({
          focused: name as any,
          dirty: {
            ...state.dirty as any,
            [name]: !this.initialValues[name],
          }
        }));
      }

      /**
       * Handle blur for either an anonymous input component or an explicitly named
       * field that was previously bound.
       */
      handleBlur(ev: React.SyntheticEvent<any>, name?: string): void {
        this.setState({ focused: null });
        this.validateForm();
      }

      /**
       * Handle change for either an anonymous input component or an explicitly named
       * field that was previously bound.
       */
      handleChange(ev: any, name?: string): void {
        // Attempt to get a name from the SyntheticEvent if one is not given explicitly
        if (!name) name = (ev.currentTarget ? ev.currentTarget.name : null);

        // No name still? Warn and bail
        if (!name) {
          console.warn(`Your rehance-form component encountered an onChange event where neither a synthetic event or name were given so the value cannot be tracked.`);
          return;
        }

        // Attempt to get the value from the SyntheticEvent (if that's what it is)
        var value = "";
        if (typeof ev === "object" && "currentTarget" in ev) {
          value = (ev.currentTarget.value || "");
        } else {
          value = ev;
        }

        // Determine if the field has actually changed
        var dirty = (!this.initialValues[name] || this.initialValues[name] != value);

        // Disable form submission, set the current field to focused (since it happened in onChange)
        // and update the value for the field (should we drop the error as well?)
        this.setState((state) => ({
          allowSubmit: false,
          focused: name,
          dirty: { ...state.dirty as any, [name]: dirty },
          values: { ...state.values as any, [name]: value },
        }));
      }

      /**
       * Reset the form to its initial values and empty out the dirty states.
       */
      handleReset() {
        this.setState({
          allowSubmit: false,
          hasChanges: false,
          hasErrors: false,
          values: this.initialValues,
          errors: {} as any,
          dirty: {} as any,
        });
      }

      /**
       * Set a field value explicitly outside of an onChange event and perform immediate
       * validation as a blur-call is not expected after this call.
       */
      validateAndSetValues(values: {[key in keyof Fields]: Fields[key]}): void {
        // Set the value for the field and disallow submit until AFTER validation
        this.setState((state) => ({
          allowSubmit: false,
          values: { ...state.values as any, ...values as any },
        }), this.validateForm);
      }

      /**
       * Manually set the error messages.
       */
      setErrorsManually(errors: FieldErrors<Fields>): void {
        this.setState({
          errors: (errors || {}),
          hasErrors: (!!errors),
        } as any);
      }

      /**
       * Handle the call to submit.
       */
      handleSubmit(): void {
        if (isFunc(opts.onSubmit)) {
          opts.onSubmit(this.state.values, this.props);
        }
      }

      /**
       * Generate an object of props that will be passed down to the component children.
       */
      getChildProps(): ChildProps<Props, Fields> {
        // Break apart the state values for the component
        var {values, errors, dirty, allowSubmit, hasChanges, hasErrors} = this.state;

        // Create a new object to hold our field props
        var fields: FieldProps<Fields> = {} as any;

        // Loop through our field values to construct our field props
        for (var k in values) {
          fields[k as string] = {
            ...this.methods[k] as any,
            value: values[k],
            error: (errors[k] || null),
            dirty: (dirty[k] || false).toString(),
          };
        }

        return {
          ...this.props as any,
          [ns]: {
            ...fields as any,
            onSubmit: this.handleSubmit,
            reset: this.handleReset,
            resetWith: this.resetWith,
            setValues: this.validateAndSetValues,
            // setErrors: this.setErrorsManually,
            isClean: !hasChanges,
            hasErrors: hasErrors,
            hasChanges: hasChanges,
            isValid: (allowSubmit && !hasErrors),
          }
        };
      }

      render() {
        var {children, ...props} = this.getChildProps() as any;

        return (
          <Component {...props}>
            {children}
          </Component>
        );
      }

    }
  };
}