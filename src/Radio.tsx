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

class _Radio extends React.Component<WithFieldProps<RadioProps>> {

  static defaultProps: Partial<RadioProps> = {
    className: "Radio",
    activeClassName: "isActive",
    disabledClassName: "isDisabled",
  };

  /**
   * Update the value across the radio field.
   */
  private setValue(value: any) {
    if (!this.props.disabled) {
      this.props.field.update({ value });
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }

  /**
   * Sets the value of the radio field to the value provided via props.
   */
  private handleSelect = () => {
    this.setValue(this.props.value);
  }

  /**
   * Nullifies the radio field value.
   */
  private handleDeselect = () => {
    this.setValue(null);
  }

  /**
   * Toggle the radio state between the set prop value and a null state.
   */
  private handleToggle = () => {
    const { field, value } = this.props;

    if (value === field.value) {
      this.handleDeselect();
    } else {
      this.handleSelect();
    }
  }

  /**
   * Render the default radio component.
   */
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

  /**
   * Render the radio component.
   */
  render() {
    const { disabled, field, value } = this.props;
    const fieldProps: RenderRadioProps = {
      disabled: !!disabled,
      groupValue: field.value,
      value: value,
      selected: value === field.value,
      select: this.handleSelect,
      deselect: this.handleDeselect,
    };

    return (
      typeof this.props.children === "function" ?
        (this.props.children as any)(fieldProps) :
        this.renderRadio(fieldProps)
    );
  }

}

export const Radio = bindAsField<RadioProps>(_Radio);