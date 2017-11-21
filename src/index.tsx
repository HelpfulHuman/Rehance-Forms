import * as React from "react";

export interface FormOptions<Fields, Props> {
  fields: Fields | {(props: Props): Fields};
  onSubmit?(fields: Fields, props: Props): void;
  updateFieldsFromProps?(Props): Fields;
}

export interface ComponentFactory<Fields, Props, ChildProps> {
  (Component: React.ComponentClass<ChildProps>|React.StatelessComponent<ChildProps>): React.ComponentClass<Props>;
}

export interface EnhancedComponent<Fields, Props> extends React.ComponentClass<Props> {
  methods: object;
}

function capitalize(str: string): string {
  return (str.charAt(0).toUpperCase() + str.slice(1));
}

export function createForm<Fields = any, Props = any, ChildProps = any>(opts: FormOptions<Fields, Props>): ComponentFactory<Fields, Props, ChildProps> {
  return function (Component) {
    return class extends React.Component<Props> implements EnhancedComponent<Fields, Props> {

      state: object = {};

      fieldNames: string[] = [];

      methods: object = {};

      props: Props;

      setState: {(val: any): void};

      constructor(props, context) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this);

        // Get the defined fields
        var fields = opts.fields;
        if (typeof fields === "function") {
          fields = fields(props);
        }

        // Create the methods for updating field states
        for (var field in fields as any) {
          this.fieldNames.push(field);
          this.state[field] = opts.fields[field];
          this.bindChangeHandler(field);
        }
      }

      bindChangeHandler(fieldName: string) {
        var methodName = "on" + capitalize(fieldName) + "Change";
        this.methods[methodName] = (val) => {
          // If we're dealing with a raw Element event, then grab the value from the element
          // automagically, otherwise we'll take what's given.
          if (val.currentTarget && val.currentTarget.value) {
            val = val.currentTarget.value;
          }

          // Update the component's field state
          this.setState({ [fieldName]: val });
        };
      }

      componentWillReceiveProps(nextProps: Props) {
        if (typeof opts.updateFieldsFromProps === "function") {
          this.setState( opts.updateFieldsFromProps(nextProps) );
        }
      }

      handleSubmit(): void {
        if (typeof opts.onSubmit === "function") {
          opts.onSubmit(this.state as any, this.props);
        }
      }

      render() {
        var { children, ...props } = this.props as any;
        return (
          <Component
            onSubmit={this.handleSubmit}
            {...this.methods}
            {...this.state}
            {...props}>
            {children}
          </Component>
        );
      }

    }
  };
}