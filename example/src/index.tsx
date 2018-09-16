import * as React from "react";
import { render } from "react-dom";
import { InputWithPreview } from "./forms/InputWithPreview";
import { LoginForm } from "./forms/LoginForm";
import { MultiFieldSubscriber } from "./forms/MultiFieldSubscriber";
import { BasicForm } from "./forms/BasicForm";
import { InputWithErrors } from "./forms/InputWithErrors";
import { ValidateOnChange } from "./forms/ValidationOnChange";
import { VariousControls } from "./forms/VariousControls";
import { Scopes } from "Rehance-Forms/example/src/forms/Scopes";
import { EditFormWithScopes } from "Rehance-Forms/example/src/forms/EditFormWithScopes";

render(
  <div>
    <InputWithPreview />
    <MultiFieldSubscriber />
    <InputWithErrors />
    <ValidateOnChange />
    <BasicForm />
    <VariousControls />
    <LoginForm />
    <Scopes />
    <EditFormWithScopes />
  </div>
  , document.getElementById("root")
);