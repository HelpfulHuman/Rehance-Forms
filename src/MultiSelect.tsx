import * as React from "react";
import { bindAsField, WithFieldProps } from "./bindAsField";

export type RenderMultiSelect = (props: RenderMultiSelectProps) => React.ReactNode;

export type MultiSelectProps = {
  className?: string;
  activeClassName?: string;
  disabledClassName?: string;
  disabled?: boolean;
  value: any;
  onChange?(value: boolean): void;
  children?: React.ReactNode | RenderMultiSelect;
  deselectOthers?: boolean;
  deselectIfSelected?: any[];
  disallowDeselect?: boolean;
};

export type RenderMultiSelectProps = {
  value: any;
  groupValue: any;
  selected: boolean;
  disabled: boolean;
  toggle(): void;
};

export class _MultiSelect extends React.Component<WithFieldProps<MultiSelectProps>> {

  static defaultProps: Partial<MultiSelectProps> = {
    className: "MultiSelect",
    activeClassName: "isActive",
    disabledClassName: "isDisabled",
    deselectIfSelected: [],
  };

  /**
   * Always returns the value for the field as an array.  Logs a warning if the original
   * value is set and not an array.
   */
  private getFieldValues(): any[] {
    let { field, name } = this.props;

    if (Array.isArray(field.value)) {
      return field.value.slice(0);
    }

    if (field.value) {
      console.warn(`MultiSelect values are intended to be arrays, check the value provided to ${name} to ensure that it's an array.`);
      return [field.value];
    }

    return [];
  }

  /**
   * Toggle the MultiSelect state between the set prop value and a null state.
   */
  private handleToggle = () => {
    const { field, value, disabled, deselectOthers: uncheckOthers, disallowDeselect } = this.props;
    let values = this.getFieldValues();

    if (disabled) { return; }

    if (uncheckOthers) {
      field.update({ value: [] });
      return;
    }

    const idx = values.indexOf(value);
    if (idx !== -1) {

      if (disallowDeselect) { return; }

      values.splice(idx, 1);
      field.update({ value: values });

    } else {

      values = (uncheckOthers ? [value] : values.concat(value));
      field.update({ value: values });

    }
  }

  /**
   * Render the default MultiSelect component.
   */
  private renderMultiSelect({ selected, disabled }: RenderMultiSelectProps) {
    const p = this.props;

    let classes = p.className;
    if (selected) { classes += " " + p.activeClassName; }
    if (disabled) { classes += " " + p.disabledClassName; }

    return (
      <span className={classes} onClick={this.handleToggle}>
        {this.props.children}
      </span>
    );
  }

  /**
   * Render the MultiSelect component.
   */
  render() {
    const { disabled, field, value } = this.props;
    const fieldProps: RenderMultiSelectProps = {
      disabled: !!disabled,
      groupValue: field.value,
      value: value,
      selected: value === field.value,
      toggle: this.handleToggle,
    };

    return (
      typeof this.props.children === "function" ?
        (this.props.children as any)(fieldProps) :
        this.renderMultiSelect(fieldProps)
    );
  }

}

export const MultiSelect = bindAsField<MultiSelectProps>(_MultiSelect);