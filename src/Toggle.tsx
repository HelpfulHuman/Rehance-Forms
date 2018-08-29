import * as React from "react";
import { bindAsField, WithFieldProps } from "./bindAsField";

export type ToggleProps = {
  className?: string;
  activeClassName?: string;
  disabledClassName?: string;
  disabled?: boolean;
  onToggle?(value: boolean): void;
  children?(props: RenderToggleProps): React.ReactNode;
};

export type RenderToggleProps = {
  value: boolean;
  disabled: boolean;
  toggle(): void;
  onToggle(): void;
};

export class _Toggle extends React.PureComponent<WithFieldProps<ToggleProps>> {

  static defaultProps: Partial<ToggleProps> = {
    className: "Toggle",
    activeClassName: "isActive",
    disabledClassName: "isDisabled",
  };

  private handleToggle = () => {
    if (!this.props.disabled) {
      const nextValue = !this.props.field.value;
      this.props.form.setValue(this.props.name, nextValue);
      if (this.props.onToggle) {
        this.props.onToggle(nextValue);
      }
    }
  }

  private renderToggle({ value, disabled }: RenderToggleProps) {
    const p = this.props;

    let classes = p.className;
    if (!!value) { classes += " " + p.activeClassName; }
    if (disabled) { classes += " " + p.disabledClassName; }

    return (
      <span className={classes} onClick={this.handleToggle} />
    );
  }

  render() {
    const field: RenderToggleProps = {
      disabled: !!this.props.disabled,
      value: !!this.props.field.value,
      toggle: this.handleToggle,
      onToggle: this.handleToggle,
    };

    return (
      typeof this.props.children === "function" ?
        this.props.children(field) :
        this.renderToggle(field)
    );
  }

}

export const Toggle = bindAsField<ToggleProps>(_Toggle);