import * as React from "react";
import { Subscriber } from "./Subscriber";
import { FormContext } from "./Context";

export type PreviewOutputProps = React.HtmlHTMLAttributes<HTMLSpanElement> & {
  name: string;
  format?(value: any): React.ReactNode;
};

export class PreviewOutput extends React.PureComponent<PreviewOutputProps> {

  static defaultProps: Partial<PreviewOutputProps> = {
    format(val: any) { return val; },
  };

  renderContent = (form: FormContext) => {
    const { name, format, ...props } = this.props;
    const value = form.getValue(name);

    return <span {...props}>{format!(value)}</span>;
  }

  render() {
    return (
      <Subscriber name={this.props.name}>
        {this.renderContent}
      </Subscriber>
    );
  }

}