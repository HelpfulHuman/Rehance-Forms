import * as React from "react";
import { Subscriber } from "./Subscriber";
import { ScopeContext } from "./ScopeContext";

export type ErrorOutputProps = React.HtmlHTMLAttributes<HTMLSpanElement> & {
  name: string;
  alwaysShow?: boolean;
};

export class ErrorOutput extends React.PureComponent<ErrorOutputProps> {

  /**
   * Render the content error output content.
   */
  public renderContent = (scope: ScopeContext) => {
    const { name, alwaysShow, ...props } = this.props;
    const field = scope.field(name);

    if (!!field.error && (field.touched || alwaysShow)) {
      return <span {...props}>{field.error}</span>;
    }

    return <React.Fragment />;
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