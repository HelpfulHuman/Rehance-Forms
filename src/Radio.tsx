import * as React from "react";
import { bindAsField, WithFieldProps } from "./bindAsField";

export type RenderRadio = (props: RenderRadioProps) => React.ReactNode;

export type RadioProps = {
  className?: string;
  activeClassName?: string;
  disabledClassName?: string;
  disabled?: boolean;
  value: any;
  allowDeselect?: boolean;
  onChange?(value: boolean): void;
  children?: React.ReactNode | RenderRadio;
};

export type RenderRadioProps = {
  value: any;
  groupValue: any;
  selected: boolean;
  disabled: boolean;
  select(): void;
  deselect(): void;
};

export class _Radio extends React.PureComponent<WithFieldProps<RadioProps>> {

  static defaultProps: Partial<RadioProps> = {
    className: "Radio",
    activeClassName: "isActive",
    disabledClassName: "isDisabled",
  };

  private setValue(nextValue: any) {
    if (!this.props.disabled) {
      this.props.form.setValue(this.props.name, this.props.value);
      if (this.props.onChange) {
        this.props.onChange(nextValue);
      }
    }
  }

  private handleSelect = () => {
    this.setValue(this.props.value);
  }

  private handleDeselect = () => {
    this.setValue(null);
  }

  private handleToggle = () => {
    const { field, value } = this.props;

    if (value === field.value) {
      this.handleDeselect();
    } else {
      this.handleSelect();
    }
  }

  private renderRadio({ selected, disabled }: RenderRadioProps) {
    const p = this.props;
    const onClick = (p.allowDeselect ? this.handleToggle : this.handleSelect);

    let classes = p.className;
    if (selected) { classes += " " + p.activeClassName; }
    if (disabled) { classes += " " + p.disabledClassName; }

    return (
      <span className={classes} onClick={onClick}>
        {this.props.children}
      </span>
    );
  }

  render() {
    const { disabled, field, value } = this.props;
    const fieldProps: RenderRadioProps = {
      disabled: !!disabled,
      groupValue: field.value,
      value: field.value,
      selected: value === field.value,
      select: this.handleSelect,
      deselect: this.handleDeselect,
    };

    return (
      typeof this.props.children === "function" ?
        this.props.children(fieldProps) :
        this.renderRadio(fieldProps)
    );
  }

}

export const Radio = bindAsField<RadioProps>(_Radio);