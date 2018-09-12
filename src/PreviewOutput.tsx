import * as React from "react";
import { Subscriber } from "./Subscriber";
import { ScopeContext } from "./ScopeContext";

export type PreviewOutputProps = React.HtmlHTMLAttributes<HTMLSpanElement> & {
  name: string;
  format?(value: any): React.ReactNode;
};

export class PreviewOutput extends React.PureComponent<PreviewOutputProps> {

  static defaultProps: Partial<PreviewOutputProps> = {
    format(val: any) { return val; },
  };

  /**
   * Render the content for the preview output.
   */
  public renderContent = (scope: ScopeContext) => {
    const { name, format, ...props } = this.props;
    const field = scope.field(name);

    return <span {...props}>{format!(field.value)}</span>;
  }

  /**
   * Render the component.
   */
  public render() {
    return (
      <Subscriber field={this.props.name}>
        {this.renderContent}
      </Subscriber>
    );
  }

}