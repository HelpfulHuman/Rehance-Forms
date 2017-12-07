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
  onSubmit(): void;
};

export type FormProps<Fields> =
  & FormChildProps<Fields>
  & FieldProps<Fields>;

export type ChildProps<Fields, Props> = Props & {
  [namespace: string]: FormProps<Fields>;
};

export interface FormState<Fields> {
  allowSubmit: boolean;
  focused: string;
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

export interface FormOptions<Fields, Props> {
  namespace?: string;
  fields: Fields|{(props: Props): Fields};
  validate?: Validator<Fields, Props>;
  onSubmit?(fields: Fields, props: Props): void;
  shouldResetValues?(nextProps: Props): boolean;
}

export interface ComponentFactory<Props, ChildProps> {
  (Component: React.ComponentClass<ChildProps>|React.StatelessComponent<ChildProps>): React.ComponentClass<Props>;
}

/**
 * Take a validation method and return a safe default with support for promises,
 * if no value is provided, then a fallback method will be provided.
 */
function createValidator<Fields, Props>(validate: Validator<Fields, Props>): AsyncValidator<Fields, Props> {
  // If they didn't provide a validation method, then we don't care
  if (!validate) {
    return () => null;
  }

  return function (form, props) {
    try {
      return Promise.resolve(validate(form, props));
    } catch (err) {
      return Promise.reject(err);
    }
  };
}

export function createForm<Fields = object, Props = object>(opts: FormOptions<Fields, Props>): ComponentFactory<Props, ChildProps<Fields, Props>> {
  // Cache options and apply defaults
  const ns = (opts.namespace || "form");

  // Create a function out of the values object
  const getFields = (typeof opts.fields === "function" ? opts.fields : (props) => opts.fields);

  // Create a validator that supports both return values and promises
  const validate = createValidator<Fields, Props>(opts.validate);

  // Return a factory method for generating new components
  return function (Component) {
    return class extends React.Component<Props, FormState<Fields>> {

      state: FormState<Fields> = {
        allowSubmit: false,
        focused: null,
        values: {} as any,
        errors: {} as any,
        dirty: {} as any,
      };

      private methods: FieldMethods<Fields> = {} as any;

      private fieldNames: string[] = [];

      private initialValues: Fields = {} as any;

      /**
       * Constructor.
       */
      constructor(props, context) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this);

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
        // Store the field name for later
        this.fieldNames.push(name);

        // Set the given value as the initial value for comparing dirty states
        this.initialValues[name] = value;

        // Set our initial values in state now
        this.state.values[name] = value;
        this.state.dirty[name]  = false;

        // Bind a set method handler for this field
        this.methods[name] = {
          set: (value) => this.validateAndSetField(name, value),
          onFocus: (event) => this.handleFocus(event, name),
          onBlur: (event) => this.handleBlur(event, name),
          onChange: (event) => this.handleChange(event, name),
        };
      }

      componentWillReceiveProps(nextProps: Props): void {
        if (isFunc(opts.shouldResetValues) && opts.shouldResetValues(nextProps)) {
          // TODO: Implement reset logic
        }
      }

      /**
       * Run validation on the whole form.
       */
      private validateForm(): void {
        // Disallow submit until AFTER validation
        this.setState({ allowSubmit: false });

        // Validate the entire form's contents
        validate(this.state.values, this.props)
          .then(() => {
            this.setState({ allowSubmit: true });
          })
          .catch((errors) => {
            this.setState({ errors });
          });
      }

      /**
       * Handle focus for either an anonymous input component or an explicitly named
       * field that was previously bound.
       */
      handleFocus(ev: React.SyntheticEvent<any>, name?: string): void {
        // Attempt to get a name from the SyntheticEvent if one is not given explicitly
        if (!name) name = (ev.currentTarget.name || null);

        // Set the focused state for this field
        this.setState({ focused: name });
      }

      /**
       * Handle blur for either an anonymous input component or an explicitly named
       * field that was previously bound.
       */
      handleBlur(ev: React.SyntheticEvent<any>, name?: string): void {
        // Attempt to get a name from the SyntheticEvent if one is not given explicitly
        if (!name) name = ev.currentTarget.name;

        // Set the current state to
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
        var value = (ev.currentTarget && ev.currentTarget.value ? ev.currentTarget.value : ev);

        // Disable form submission, set the current field to focused (since it happened in onChange)
        // and update the value for the field (should we drop the error as well?)
        this.setState({
          allowSubmit: false,
          focused: name,
          values: { [name]: value },
        } as any);
      }

      /**
       * Set a field value explicitly outside of an onChange event and perform immediate
       * validation as a blur-call is not expected after this call.
       */
      validateAndSetField(name: string, value: any): void {
        // Set the value for the field and disallow submit until AFTER validation
        this.setState((state) => ({
          allowSubmit: false,
          values: { ...state.values, [name]: value }
        }));

        // Validate the entire form's contents
        validate(this.state.values, this.props)
        .then(() => {
          this.setState({ allowSubmit: true });
        })
        .catch((errors) => {
          this.setState({ errors });
        });
      }

      /**
       * Handle the call to submit.
       */
      handleSubmit(): void {
        if (isFunc(opts.onSubmit)) {
          opts.onSubmit(this.state.values, this.props);
        }
      }

      getChildProps(): ChildProps<Props, Fields> {
        // Track if there are any dirty fields
        var formHasChanges = false;

        // Whether or not we've encountered any errors
        var formHasErrors = false;

        // Create a new object to hold our field props
        var fields: FieldProps<Fields> = {} as any;

        // Loop through our field values to construct our field props
        for (var k in this.state.values) {
          if (this.state.dirty[k]) {
            formHasChanges = true;
          }

          if (this.state.errors[k]) {
            formHasErrors = true;
          }

          fields[k as any] = {
            ...this.methods[k] as any,
            value: this.state.values[k],
            error: this.state.errors[k],
            dirty: this.state.dirty[k],
          };
        }

        return {
          ...this.props as any,
          [ns]: {
            ...fields as any,
            onSubmit: this.handleSubmit,
            isValid: (formHasChanges && !formHasErrors),
          }
        };
      }

      render() {
        var childProps = this.getChildProps();

        return (
          <Component
            {...childProps as any}>
            {this.props.children}
          </Component>
        );
      }

    }
  };
}