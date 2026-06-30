import type { ReactNode } from 'react';

interface SegmentedControlProps<T extends string> {
  value: T;
  options: { value: T; label: string; icon?: ReactNode }[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ value, options, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="segmented" role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? 'selected' : ''}
          onClick={() => onChange(option.value)}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

interface ToggleButtonProps {
  label: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
  danger?: boolean;
}

export function ToggleButton({ label, checked = false, onChange, danger = false }: ToggleButtonProps) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? 'on' : ''} ${danger ? 'danger' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span>{label}</span>
      <strong>{checked ? '是' : '否'}</strong>
    </button>
  );
}

interface NumberFieldProps {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export function NumberField({ label, value, onChange, min, max, step = 1, suffix }: NumberFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-with-suffix">
        <input
          inputMode="decimal"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
        />
        {suffix && <small>{suffix}</small>}
      </div>
    </label>
  );
}
