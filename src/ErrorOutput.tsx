import * as React from "react";
import { Subscriber } from "./Subscriber";
import { FormContext } from "./Context";

export type ErrorOutputProps = React.HtmlHTMLAttributes<HTMLSpanElement> & {
  name: string;
};

export class ErrorOutput extends React.PureComponent<ErrorOutputProps> {

  renderContent = (form: FormContext) => {
    const { name, ...props } = this.props;
    const error = form.getError(name);

    if (!error || !form.wasTouched(name)) {
      return <React.Fragment />;
    }

    return <span {...props}>{error}</span>;
  }

  render() {
    return (
      <Subscriber name={this.props.name}>
        {this.renderContent}
      </Subscriber>
    );
  }

}