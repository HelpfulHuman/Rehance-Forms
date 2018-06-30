import * as React from "react";
import { FormProvider, FormContext, FieldStatePartial } from "./Context";
import { EventEmitter } from "events";
import { FieldState } from "./Context";
import { FieldMap, StringMap, BoolMap } from "./types";

const EVENT_FORM_UPDATE = "form";
const EVENT_FIELD_UPDATE = "field_change";

export type RenderProp = (context: FormContext) => React.ReactNode;

export type FormOutput = {
  values: FieldMap;
  errors: StringMap;
};

export type FormProps = {
  initialValues?: FieldMap;
  onSubmit?(output: FormOutput, form: FormContext): void;
  children?: JSX.Element | JSX.Element[] | RenderProp;
};

export type FormState = {
  values: FieldMap;
  errors: StringMap;
  touched: BoolMap;
};

export class Form extends React.Component<FormProps> {

  static defaultProps: Partial<FormProps> = {
    initialValues: {},
  };

  private registered: string[] = [];
  private values: FieldMap;
  private errors: StringMap;
  private touched: BoolMap;
  private events: EventEmitter;
  private api: FormContext;

  constructor(props: FormProps, context: any) {
    super(props, context);

    this.values = { ...props.initialValues };
    this.errors = {};
    this.touched = {};
    this.events = new EventEmitter();
    this.api = {
      register: this.register,
      unregister: this.unregister,
      reset: this.reset,
      getField: this.getField,
      setField: this.setField,
      getValues: this.getValues,
      setValues: this.setValues,
      getValue: this.getValue,
      setValue: this.setValue,
      getErrors: this.getErrors,
      setErrors: this.setErrors,
      hasErrors: this.hasErrors,
      getError: this.getError,
      setError: this.setError,
      setTouched: this.setTouched,
      hasChanged: this.hasChanged,
      wasTouched: this.wasTouched,
      onFormUpdate: this.onFormUpdate,
      onFieldUpdate: this.onFieldUpdate,
      triggerFormUpdate: this.triggerFormUpdate,
      triggerFieldUpdate: this.triggerFieldUpdate,
    };
  }

  /**
   * Determine the base state for a field.
   */
  register = (field: string, error?: string) => {
    if (this.registered.indexOf(field) === -1) {
      this.registered.push(field);
    }

    this.values[field] = this.values[field] || null;
    this.errors[field] = error || "";
  }

  /**
   * Clear all values related to a field.
   */
  unregister = (field: string) => {
    const idx = this.registered.indexOf(field);
    if (idx !== -1) {
      this.registered.splice(idx, 1);
    }

    delete this.values[field];
    delete this.errors[field];
    delete this.touched[field];
    this.triggerFieldUpdate(field);
  }

  /**
   * Returns true if there are no errors in the error map.
   */
  // private isValid = () => {
  //   for (let key in this.errors) {
  //     let val = this.errors[key];
  //     // bail at the first error we find that isn't empty
  //     if (!!val && val.length > 0) {
  //       return false;
  //     }
  //   }

  //   return true;
  // }

  /**
   * Resets all form values back to their initial states.
   */
  private reset = () => {
    this.values = this.props.initialValues!;
    this.errors = {};
    this.touched = {};
    this.triggerFormUpdate();
  }

  /**
   * Returns the complete state for a specific field.
   */
  private getField = (field: string): FieldState<any> => {
    return {
      value: this.getValue(field),
      error: this.getError(field),
      touched: this.wasTouched(field),
      changed: this.hasChanged(field),
    };
  }

  /**
   * Update all values related to a specific field at once.
   */
  private setField = (field: string, nextState: FieldStatePartial<any>) => {
    this.values[field] = ("value" in nextState ? nextState.value : this.getValue(field));
    this.errors[field] = ("error" in nextState ? nextState.error : this.getError(field))!;
    this.touched[field] = ("touched" in nextState ? nextState.touched : this.wasTouched(field))!;
    this.triggerFieldUpdate(field);
  }

  /**
   * Returns all of the form's values.
   */
  private getValues = () => {
    return this.values;
  }

  /**
   * Set the field value states for the form.
   */
  private setValues = (values: FieldMap, replace: boolean = false) => {
    this.values = replace ? values : { ...this.values, ...values };
    this.triggerFormUpdate();
  }

  /**
   * Returns the value of a single field or the given fallback (if any).
   */
  private getValue = (field: string, fallback?: any) => {
    if (this.values[field] !== undefined) {
      return this.values[field];
    }

    return (fallback || null);
  }

  /**
   * Set the value of a specific field.
   */
  private setValue = (field: string, value: any) => {
    this.values[field] = value;
    this.triggerFieldUpdate(field);
  }

  /**
   * Returns all error messages for the form.
   */
  private getErrors(): StringMap {
    return this.errors;
  }

  /**
   * Returns true if any field has an error.
   */
  private hasErrors = () => {
    for (let key in this.errors) {
      if (!!this.errors[key]) {
        return true;
      }
    }

    return false;
  }

  /**
   * Set the error state of all fields.
   */
  private setErrors = (errors: StringMap, replace: boolean = false) => {
    this.errors = replace ? errors : { ...this.errors, ...errors };
    this.triggerFormUpdate();
  }

  /**
   * Returns the error of a single field or `null` if none is found.
   */
  private getError = (field: string) => {
    return (this.errors[field] || "");
  }

  /**
   * Set the error state of a single field.
   */
  private setError = (field: string, message: string) => {
    this.errors[field] = message;
    this.triggerFieldUpdate(field);
  }

  /**
   * Set the touch state for a specific field.
   */
  private setTouched = (field: string, touched: boolean) => {
    this.touched[field] = touched;
    this.triggerFieldUpdate(field);
  }

  /**
   * Returns true if a specific field has been altered from its original state.
   */
  private hasChanged = (field: string) => {
    return (this.props.initialValues![field] !== this.values[field]);
  }

  /**
   * Returns true if the given field was interacted with in any way.
   */
  private wasTouched = (field: string) => {
    return (!!this.touched[field]);
  }

  /**
   * Invoke the onSubmit prop with the current form values when submitted.
   */
  private handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit({
        values: this.values,
        errors: this.errors,
      }, this.api);
    }
  }

  /**
   * Susbcribe to updates that affect the entire form.
   */
  private onFormUpdate = (fn: () => void) => {
    this.events.on(EVENT_FORM_UPDATE, fn);
    return () => {
      this.events.removeListener(EVENT_FORM_UPDATE, fn);
    };
  }

  /**
   * Subscribe to updates on a specific field, such as edits to the field's
   * value or changes with its validation state.
   */
  private onFieldUpdate = (fn: (field: string) => void) => {
    this.events.on(EVENT_FIELD_UPDATE, fn);
    return () => {
      this.events.removeListener(EVENT_FIELD_UPDATE, fn);
    };
  }

  /**
   * Trigger an update for a specific field or the whole form.
   */
  private triggerFormUpdate = () => {
    this.events.emit(EVENT_FORM_UPDATE);
  }

  /**
   * Trigger an update for a specific field or the whole form.
   */
  private triggerFieldUpdate = (...fields: string[]) => {
    for (let field of fields) {
      this.events.emit(EVENT_FIELD_UPDATE, field);
    }
  }

  render() {
    return (
      <form noValidate onSubmit={this.handleSubmit}>
        <FormProvider value={this.api}>
          {
            typeof this.props.children === "function" ?
              this.props.children(this.api) :
              this.props.children
          }
        </FormProvider>
      </form>
    );
  }

}