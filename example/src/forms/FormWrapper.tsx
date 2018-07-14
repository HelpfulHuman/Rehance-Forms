import * as React from "react";

export type FormWrapperProps = {
  title: string;
  result?: any;
  children: React.ReactNode;
};

export function FormWrapper({ title, result, children }: FormWrapperProps) {
  return (
    <div className="FormWrapper">
      <header>
        {title}
      </header>
      {result && <section>
        <h4>Result:</h4>
        <pre>{JSON.stringify(result)}</pre>
      </section>}
      <section>
        {children}
      </section>
    </div>
  );
}