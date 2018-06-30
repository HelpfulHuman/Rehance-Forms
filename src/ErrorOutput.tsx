import * as React from "react";
import { Subscriber } from "./Subscriber";
import { FormContext } from "./Context";

export type ErrorOutputProps = React.HtmlHTMLAttributes<HTMLSpanElement> & {
  name: string;
  alwaysShow?: boolean;
};

export class ErrorOutput extends React.PureComponent<ErrorOutputProps> {

  renderContent = (form: FormContext) => {
    const { name, alwaysShow, ...props } = this.props;
    const error = form.getError(name);

    if (!!error && (form.wasTouched(name) || alwaysShow)) {
      return <span {...props}>{error}</span>;
    }

    return <React.Fragment />;
  }

  render() {
    return (
      <Subscriber name={this.props.name}>
        {this.renderContent}
      </Subscriber>
    );
  }

}