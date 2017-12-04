import * as React from "react";

export interface FieldOptions {
  default?: any;
  format?(val: any): any;
  validate?(val: any): any;
}

export interface Fields {
  [key: string]: FieldOptions;
}

export interface FormOptions<Props, ChildProps> {
  fields: Fields | {(props: Props): Fields};
  namespace?: string;
  onSubmit?(props: ChildProps): void;
  updateFieldsFromProps?(props: ChildProps): Fields;
}

export interface ComponentFactory<Props, ChildProps> {
  (Component: React.ComponentClass<ChildProps>|React.StatelessComponent<ChildProps>): React.ComponentClass<Props>;
}

export interface EnhancedComponent<Props> extends React.PureComponent<Props> {
  methods: object;
}

interface State {
  [name: string]: {
    value: any,
    error: string,
    dirty: boolean,
  };
}

function isFunc(val: any): boolean {
  return (typeof val === "function");
}

function capitalize(str: string): string {
  return (str.charAt(0).toUpperCase() + str.slice(1));
}

function _format(val: any): any {
  return (val || "");
}

function _validate(): void {}

export function createForm<Props = any, ChildProps = any>(opts: FormOptions<Props, ChildProps>): ComponentFactory<Props, ChildProps> {
  // Cache options and apply defaults
  var ns = (opts.namespace || "form");

  // Return a factory method for generating new components
  return function (Component) {
    return class extends React.Component<Props, State> implements EnhancedComponent<Props> {

      state: State = {};

      methods: object = {};

      constructor(props, context) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this);

        // Get the defined fields
        var fields = opts.fields as any;
        if (isFunc(fields)) {
          fields = fields(props);
        }

        // Create the methods for updating field states
        for (var fieldName in fields) {
          this.setupField(fieldName, fields[fieldName]);
        }
      }

      setupField(name: string, field: FieldOptions): void {

        // Capitalize the name for method names
        const Name = capitalize(name);

        // Get a formatter and validator for the field
        const format = (isFunc(field.format) ? field.format : _format);
        const validate = (isFunc(field.validate) ? field.validate : _validate);

        // Wrap our validation in a catch-all function
        const safeValidate = (value: any): string => {
          // Validate the value
          var error = null;
          try {
            error = validate(value);
          } catch (err) {
            error = err.message;
          }

          return error;
        };

        // Helper function for determining if field is dirty
        const isDirty = (value) => (!initialValue || value != initialValue);

        // Get the default value for the form
        const initialValue = format(field.default);

        // Bind a set method handler for this field
        const set = this.methods[`set${Name}`] = (value) => {
          var error = null;
          var cachedValue = value;

          try {
            // Format the current value for the field
            value = format(value);
          } catch (err) {
            console.error("A field format() method threw an error", err);
            value = cachedValue;
            error = err.message;
          }

          this.setState({
            [name]: { value, error, dirty: isDirty(value) }
          });
        };

        // Bind the onFocus handler for this field
        this.methods[`on${Name}Focus`] = () => {
          // Get the current state of the field
          var state = this.state[name];

          this.setState({
            [name]: { ...state, error: null }
          });
        };

        // Bind the onBlur handler for this field
        this.methods[`on${Name}Blur`] = () => {
          // Get the current state of the field
          var state = this.state[name];

          // Validate the error
          var error = safeValidate(state.value);

          this.setState({
            [name]: { ...state, error, dirty: isDirty(state.value) }
          });
        };

        // Bind the onChange handler for this field
        this.methods[`on${Name}Change`] = (value) => {
          // If value is an event, get the value of the DOM element
          if (value.currentTarget && (typeof value.currentTarget.value === "string")) {
            value = value.currentTarget.value;
          }

          set(value);
        };

        // Set the default state for the field
        this.state[name] = {
          error: validate(initialValue),
          value: initialValue,
          dirty: false,
        };
      }

      componentWillReceiveProps(nextProps: Props) {
        if (isFunc(opts.updateFieldsFromProps)) {
          // this.setState( opts.updateFieldsFromProps(nextProps) );
        }
      }

      handleSubmit(): void {
        if (isFunc(opts.onSubmit)) {
          opts.onSubmit(this.getChildProps());
        }
      }

      getChildProps(): ChildProps {
        var errors = [];
        var showErrors = false;
        var isValid = true;
        for (var key in this.state) {
          if (this.state[key].error) {
            isValid = false;
            if (this.state[key].dirty) {
              errors.push(this.state[key].error);
              showErrors = true;
            }
          }
        }

        return {
          ...this.props as any,
          [ns]: {
            onSubmit: this.handleSubmit,
            errors: (showErrors ? errors : []),
            isValid: isValid,
            ...this.state,
            ...this.methods,
          }
        };
      }

      render() {
        var childProps = this.getChildProps();

        return (
          <Component
            {...childProps}>
            {this.props.children}
          </Component>
        );
      }

    }
  };
}