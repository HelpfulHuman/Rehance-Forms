import * as React from "react";
import { render } from "react-dom";
import { InputWithPreview } from "./forms/InputWithPreview";
import { LoginForm } from "./forms/LoginForm";
import { MultiFieldSubscriber } from "./forms/MultiFieldSubscriber";
import { BasicForm } from "./forms/BasicForm";
import { InputWithErrors } from "./forms/InputWithErrors";
import { ValidateOnChange } from "./forms/ValidationOnChange";

render(
  <div>
    <InputWithPreview />
    <MultiFieldSubscriber />
    <InputWithErrors />
    <ValidateOnChange />
    <BasicForm />
    <LoginForm />
  </div>
  , document.getElementById("root")
);