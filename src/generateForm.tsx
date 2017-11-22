import * as React from 'react';

export interface FormInput {
  defaultValue: string,
  component: React.Component,
}

export interface FormFields {
  fields: Array<FormInput>
}

export function generateForm(formFields : FormFields) {
  
}