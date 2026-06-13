import { Select } from '@mantine/core';
import { Option } from '@/features/rxsoft/types';

type SelectFieldProps = {
  value: Option | null;
  options: Option[];
  onChange: (option: Option | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  onBlur?: () => void;
  onFocus?: () => void;
};

export function SelectField({
  value,
  options,
  onChange,
  placeholder,
  label,
  className,
  disabled,
  error,
}: SelectFieldProps) {
  return (
    <Select
      label={label}
      value={value?.value as string}
      onChange={(value, option) => {
        onChange(option);
      }}
      data={options}
      placeholder={placeholder}
      disabled={disabled}
      clearable={true}
      searchable={false}
      error={error}
    />
  );
}
