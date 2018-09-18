import * as React from "react";
import { FieldMap } from "./types";
import { FieldContext } from "./FieldContext";
import { WithFormScopeProps } from "./helpers";
import { FormEventSignal, FormEvent } from "./EventBus";
import { ScopeContext } from "./ScopeContext";

export interface Formatter {
  (value: any, output: boolean): any;
}

export type GetClassName = (field: FieldContext) => string;

export type FieldProps<ElementType> = {
  name: string;
  className?: string | GetClassName;
  validateOnChange?: boolean;
  format?: Formatter;
  validate?(field: string, values: FieldMap): string | null;
  onFocus?(ev: React.FocusEvent<ElementType>, scope: ScopeContext): void;
  onChange?(ev: React.ChangeEvent<ElementType>, scope: ScopeContext): void;
  onBlur?(ev: React.FocusEvent<ElementType>, scope: ScopeContext): void;
};

export abstract class HTMLFieldComponent<Props extends FieldProps<ElementType>, ElementType extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, State = {}>
  extends React.PureComponent<WithFormScopeProps<Props>, State> {

  private unsubscribe: Function;
  protected field: FieldContext;
  protected element: ElementType;

  constructor(props: WithFormScopeProps<Props>, context: any) {
    super(props, context);

    if (!props.formScope) {
      console.error("You have tried to add a form element outside of a form scope!  Wrap this element in a <Form> component.");
    }

    // this is to make sure we don't break inheritance
    this.bindRef = this.bindRef.bind(this);
    this.handleScopeEvent = this.handleScopeEvent.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateSelf = this.validateSelf.bind(this);
  }

  /**
   * Inform the scope that this field exists and subscribe to scope events.
   */
  public componentWillMount() {
    this.field = this.props.formScope.field(this.props.name);
    this.props.formScope.broadcast(FormEventSignal.FieldCreated, this.props.name);
    this.unsubscribe = this.props.formScope.listen(this.handleScopeEvent);
  }

  /**
   * Unsubscribe from scope events and clear the field context.
   */
  public componentWillUnmount() {
    this.unsubscribe();
    this.props.formScope.clearChild(this.props.name);
    this.props.formScope.broadcast(FormEventSignal.FieldDestroyed, this.props.name);
  }

  /**
   * Returns the formatted value for the field.
   */
  protected get value(): string {
    return this.format(this.field.value, false);
  }

  /**
   * Generates and return the class names for the element.
   */
  protected get classes(): string {
    const { className } = this.props;

    if (typeof className !== "function") {
      return className as string;
    }

    return className(this.field);
  }

  /**
   * Format input using a given formatter prop.
   */
  protected format(value: any, output: boolean): any {
    return (
      this.props.format ?
        this.props.format(value, output) :
        value
    );
  }

  /**
   * Trigger an update for this field.
   */
  protected triggerUpdate = () => {
    this.props.formScope.broadcast(FormEventSignal.FieldUpdate, this.props.name);
  }

  /**
   * Bind the element reference for the field.
   */
  protected bindRef(el: ElementType) {
    const firstBind = !this.element;
    this.element = el;

    // we trigger validation on first bind because element is not available
    // before this to check validation state
    if (firstBind) {
      this.field.error = this.validateSelf();
      this.triggerUpdate();
    }
  }

  /**
   * Process incoming scope events.
   */
  protected handleScopeEvent = (ev: FormEvent) => {
    if (
      (!ev.field || ev.field === this.props.name) &&
      ev.scope === this.props.formScope
    ) {
      this.forceUpdate();
    }
  }

  /**
   * Handle focus events for this field.
   */
  protected handleFocus(ev: React.FocusEvent<ElementType>) {
    if (this.props.onFocus) {
      this.props.onFocus(ev, this.props.formScope);
    }
  }

  /**
   * Handle blur events for this field.
   */
  protected handleBlur(ev: React.FocusEvent<ElementType>) {
    this.field.error = this.validateSelf();
    this.field.touched = true;
    this.triggerUpdate();

    if (this.props.onBlur) {
      this.props.onBlur(ev, this.props.formScope);
    }
  }

  /**
   * Handle change events for this field.
   */
  protected handleChange(ev: React.ChangeEvent<ElementType>) {
    const value = this.format(ev.target.value, true);

    if (this.props.validateOnChange) {
      this.field.error = this.validateSelf();
    }
    this.field.value = value;
    this.triggerUpdate();

    if (this.props.onChange) {
      this.props.onChange(ev, this.props.formScope);
    }
  }

  /**
   * Validates the field and return either the error message or null.
   */
  protected validateSelf() {
    const element: any = this.element;
    const { name, validate, formScope } = this.props;
    const result = (
      !!validate ?
        validate(name, formScope.value) :
        element.validationMessage
    );

    return result || null;
  }

}