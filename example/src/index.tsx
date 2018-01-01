import * as React from "react";
import {render} from "react-dom";
import {createForm, withYup} from "./stateside";
import * as yup from "yup";

function renderError(error, i) {
  return (
    <li key={i}>{error}</li>
  );
}

function FormLayout({ form }) {
  return (
    <div>
      <div>
        <input type="email" {...form.email} />
        <span>{form.email.error}</span>
      </div>
      <div>
        <input type="password" {...form.password} />
        <span>{form.password.error}</span>
      </div>
      <button disabled={!form.isValid} onClick={form.onSubmit}>Submit</button>
    </div>
  );
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

// interface FormFields {
//   email: string;
//   password: string;
// }

const Form = createForm<any, any>({
  fields: {
    email: "",
    password: "",
  },
  validate: withYup(schema),
  onSubmit(fields, props) {
    props.setResult(fields);
  },
})(FormLayout);

class App extends React.Component {
  state = { result: null };

  constructor(props, context) {
    super(props, context);
    this.setResult = this.setResult.bind(this);
  }

  setResult(result: any): void {
    this.setState({ result });
  }

  render() {
    var result = this.state.result;
    var sentMessage;

    if (result !== null) {
      sentMessage = `Sent: ${JSON.stringify(result)}`;
    }

    return (
      <div>
        {sentMessage}
        <Form setResult={this.setResult} />
      </div>
    );
  }
}

render(
  <App />
  , document.getElementById("root")
);