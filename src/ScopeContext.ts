import * as React from "react";
import { EventBus, EventBusSubscriber, FormEventSignal } from "./EventBus";
import { randomRange } from "./utils";
import { FieldMap, IScopeChild } from "./types";
import { FieldContext } from "./FieldContext";

export type ScopeChild =
  | ListScopeContext
  | FieldContext
  | ScopeContext;

export const {
  Consumer: FormScopeConsumer,
  Provider: FormScopeProvider,
} = React.createContext<ScopeContext | null>(null);

export abstract class BaseContext implements IScopeChild {

  protected _parent: null | BaseContext;
  protected _events: EventBus;
  protected _id: string;

  constructor(parentScope: null | BaseContext = null) {
    this._parent = parentScope;
    const id = randomRange(100000000, 999999999);
    if (parentScope) {
      this._events = parentScope._events;
      this._id = `${parentScope.id}.${id}`;
    } else {
      this._events = new EventBus();
      this._id = `${id}`;
    }
  }

  /**
   * Returns the top level or root scope of the hierarchy that this scope belongs to.
   * Essentially, this will return the form scope.
   */
  public get root(): BaseContext {
    let scope: BaseContext = this;
    while (scope.parent) {
      scope = scope.parent;
    }
    return scope;
  }

  /**
   * Returns the parent scope of this scope or null if no parent scope exists and this
   * is the top level scope.
   */
  public get parent(): null | BaseContext {
    return this._parent;
  }


  /**
   * Returns the event bus that this scope is using.  If this scope is nested inside
   * of another scope, it will use the parent scope's event bus (all the way up the
   * scope tree to the root scope).
   */
  public get events(): EventBus {
    return this._events;
  }

  /**
   * Returns the ID for the scope.  The scope ID is a combination of its own internal
   * ID and the IDs of its parents.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Returns true if the scope is the parent (or ancestor) of the given scope.
   */
  public isAncestorOf(scope: BaseContext): boolean {
    return scope.id.indexOf(this._id) === 0;
  }

  /**
   * Returns true if the scope is the child (or descendent) of the given scope.
   */
  public isDescendentOf(scope: BaseContext): boolean {
    return scope.isAncestorOf(this);
  }

  /**
   * Subscribe to all events occurring within the hierarchy that this scope belongs to.
   */
  public listen(sub: EventBusSubscriber): Function {
    return this._events.listen(sub);
  }

  /**
   * Triggers an update that will be broadcasted to all scopes within the hierarchy that
   * this scope belongs to.
   */
  public broadcast(signal: FormEventSignal, field?: string): void {
    this._events.trigger({ scope: this, signal, field });
  }

  /**
   * Submits the form that the scope belongs to.
   */
  public submit() {
    this.broadcast(FormEventSignal.SubmitForm);
  }

  abstract readonly value: any;
  abstract readonly valid: boolean;
  abstract readonly changed: boolean;
  abstract reset(): void;
  abstract clear(): void;

}

export class ScopeContext extends BaseContext implements IScopeChild {

  protected _initialValues: FieldMap;
  protected _children: {
    [key: string]: ScopeChild;
  };

  constructor(initialValues: FieldMap = {}, parentScope: null | ScopeContext = null) {
    super(parentScope);
    this._initialValues = initialValues;
  }

  /**
   * Returns the initial values for the scope.
   */
  public get initialValues(): FieldMap {
    return this._initialValues;
  }

  /**
   * Returns a child scope or field of this scope.  Returns null if a
   * valid child cannot be found.
   */
  public getChild(name: string): ScopeChild | null {
    return this._children[name] || null;
  }

  /**
   * Register a child scope or field to this scope.
   */
  public setChild(name: string, child: ScopeChild) {
    this._children[name] = child;
  }

  /**
   * Unregister a child scope or field from this scope.
   */
  public clearChild(name: string) {
    delete this._children[name];
  }

  /**
   * Builds and returns a map of key/value pairs with the data managed by this
   * scope, and the child scopes.
   */
  public get value() {
    let values: FieldMap = {};
    for (let key in this._children) {
      values[key] = this._children[key].value;
    }
    return values;
  }

  /**
   * Returns an existing field or creates a new field context is one does not
   * exist.  The field is automatically added as a child to the scope.
   */
  public field(name: string): FieldContext {
    if (!this._children[name]) {
      let initialValue = this.initialValues[name] || null;
      this._children[name] = new FieldContext(initialValue);
    }

    if (this._children[name]! instanceof FieldContext) {
      console.warn(`"${name} is not a FieldContext type child of scope! Returning an empty FieldContext object instead.`);
      return new FieldContext(this.initialValues[name] || null);
    }

    return this._children[name] as FieldContext;
  }

  /**
   * Returns true if none of the fields in the current scope have an error.
   */
  public get valid(): boolean {
    for (let key in this._children) {
      if (!this._children[key].valid) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns true if any of the fields have in the current scope have changed.
   */
  public get changed(): boolean {
    for (let key in this._children) {
      if (this._children[key].changed) {
        return true;
      }
    }

    return false;
  }

  /**
   * Resets the values of the all fields and scopes with in the current scope
   * back to their initial values.
   */
  public reset() {
    for (let key in this._children) {
      this._children[key].reset();
    }
  }

  /**
   * Clears the values of all fields and scopes within the current scope.
   */
  public clear() {
    for (let key in this._children) {
      this._children[key].clear();
    }
  }

}


function getChildScopeValue(scope: ScopeContext) {
  return scope.value;
}

export class ListScopeContext extends BaseContext {

  protected _children: ScopeContext[] = [];
  protected _initialValues: FieldMap[];

  constructor(initialValues: FieldMap[] = [], parentScope: null | BaseContext = null) {
    super(parentScope);
    this._initialValues = initialValues;
  }

  /**
   * Returns the initial values for the list scope.
   */
  public get initialValues() {
    return this._initialValues;
  }

  /**
   * Adds a new child context to the list scope.
   */
  public addChildScope(scope: ScopeContext) {
    this._children.push(scope);
  }

  /**
   * Removes a child context from the list scope via reference.
   */
  public clearChildScope(scope: ScopeContext) {
    this._children.filter(child => child !== scope);
  }

  /**
   * Splices a specific child by index.
   */
  public spliceChildScopes(index: number) {
    this._children.splice(index, 1);
  }

  /**
   * Builds and returns an array with the data managed by this scope,
   * and the child scopes.
   */
  public get value() {
    return this._children.map(getChildScopeValue);
  }

  /**
   * Returns true if none of the fields in the current scope have an error.
   */
  public get valid(): boolean {
    for (let child of this._children) {
      if (!child.valid) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns true if any of the fields have in the current scope have changed.
   */
  public get changed(): boolean {
    for (let child of this._children) {
      if (child.changed) {
        return true;
      }
    }

    return false;
  }

  /**
   * Resets the values of the all fields and scopes with in the current scope
   * back to their initial values.
   */
  public reset() {
    for (let child of this._children) {
      child.reset();
    }
  }

  /**
   * Clears the values of all fields and scopes within the current scope.
   */
  public clear() {
    for (let child of this._children) {
      child.clear();
    }
  }

}