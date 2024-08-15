import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  ReactNode,
  useMemo,
  useRef,
} from 'react'

import { cn, getValidNumber, isValidNumber } from '@/lib/utils'

import { Input } from '../ui/input'

import { FormField } from './FormField'
import { useTheme } from '@/services'
import { Slider } from '../ui/slider'

type SliderProps = React.ComponentProps<typeof Slider>

export function FormSlider<T>(
  {
    label,
    className,
    value,
    minValue,
    maxValue,
    defaultValue,
    disabled,
    onChange,
    ...props
  }: {
    label?: ReactNode
    className?: string
    value?: number
    minValue?: number
    maxValue?: number
    defaultValue?: number
    disabled?: boolean
    onChange?: (newValue: number) => void
    props?: SliderProps
  }
  //  & Omit<ComponentProps<typeof Input>, "value" | "defaultValue" | "placeholder" | "type" | "className" | "disabled" | "onChange">
  // & ComponentProps<typeof Input>
) {
  const theme = useTheme()
  const isNumberInput =
    typeof defaultValue === 'number' || typeof value === 'number'

  const ref = useRef<HTMLInputElement>(null)

  return (
    <FormField label={label} className="flex flex-col space-y-1.5">
      <Slider
        ref={ref}
        className={cn(`w-full`, `font-mono text-xs font-light`, className)}
        disabled={disabled}
        onValueChange={(range) => {
          const value = range[0]
          onChange?.(value)
        }}
        defaultValue={[defaultValue || 0]}
        value={[value || 0]}
        min={minValue}
        max={maxValue}
        step={0.01}
        {...props}
      />
      <div className="flex w-full flex-row items-end justify-between text-xs">
        {typeof minValue === 'number' && <div>{minValue}</div>}
        {typeof maxValue === 'number' && <div>{maxValue}</div>}
      </div>
    </FormField>
  )
}
