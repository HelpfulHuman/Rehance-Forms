import * as React from "react";
import { FieldMap, StringMap } from "./types";

export type FieldStatePartial<T> = {
  value?: T;
  error?: string;
  touched?: boolean;
};

export type FieldState<T = any> = {
  value: T;
  error: string;
  touched: boolean;
  changed: boolean;
}

export interface FormContext {
  register(field: string, error?: string): void;
  unregister(field: string): void;
  getField<T = any>(field: string): FieldState<T>;
  setField<T = any>(field: string, newState: FieldStatePartial<T>): void;
  getValues(): FieldMap;
  setValues(values: FieldMap, replace?: boolean): void;
  getValue<T = any>(field: string, fallack?: T): T;
  setValue(field: string, value: any): void;
  getErrors(): StringMap;
  setErrors(errors: StringMap, replace?: boolean): void;
  getError(field: string): string;
  setError(field: string, message: string): void;
  setTouched(field: string, touched: boolean): void;
  hasChanged(field: string): boolean;
  wasTouched(field: string): boolean;
  onFormUpdate(fn: () => void): () => void;
  onFieldUpdate(fn: (field: string) => void): () => void;
  triggerUpdate(...fields: string[]): void;
  reset(): void;
}

export const {
  Consumer: FormConsumer,
  Provider: FormProvider,
} = React.createContext<FormContext | null>(null);