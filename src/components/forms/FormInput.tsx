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

export function FormInput<T>(
  {
    label,
    className,
    placeholder,
    value,
    minValue,
    maxValue,
    defaultValue,
    disabled,
    onChange,
    horizontal,
    type,
    centered,
    // ...props
  }: {
    label?: ReactNode
    className?: string
    placeholder?: ReactNode
    value?: T
    minValue?: T
    maxValue?: T
    defaultValue?: T
    disabled?: boolean
    onChange?: (newValue: T) => void
    horizontal?: boolean
    type?: HTMLInputTypeAttribute
    centered?: boolean
  }
  //  & Omit<ComponentProps<typeof Input>, "value" | "defaultValue" | "placeholder" | "type" | "className" | "disabled" | "onChange">
  // & ComponentProps<typeof Input>
) {
  const isNumberInput =
    typeof defaultValue === 'number' || typeof value === 'number'

  const isTextInput =
    typeof defaultValue === 'string' || typeof value === 'number'

  // we try to use the type provided by the user if possible,
  // otherwise we "guess" it
  const inputType: HTMLInputTypeAttribute =
    type || (isNumberInput ? 'number' : isTextInput ? 'text' : 'text')

  const ref = useRef<HTMLInputElement>(null)

  const handleChange = useMemo(
    () => (event: ChangeEvent<HTMLInputElement>) => {
      if (disabled) {
        return
      }
      if (!onChange) {
        return
      }

      const rawStringValue = `${event.currentTarget.value || ''}`

      // this could be refactorer maybe
      if (isNumberInput) {
        const validMinValue: number =
          minValue && isValidNumber(minValue) ? (minValue as number) : 0
        const validMaxValue: number =
          maxValue && isValidNumber(maxValue) ? (maxValue as number) : 1
        const validDefaultValue: number =
          defaultValue && isValidNumber(defaultValue)
            ? (defaultValue as number)
            : 0

        const numericValue = getValidNumber(
          rawStringValue,
          validMinValue,
          validMaxValue,
          validDefaultValue
        )
        onChange(numericValue as T)
      } else {
        onChange(rawStringValue as T)
      }
    },
    [isNumberInput, minValue, maxValue, defaultValue, disabled, onChange]
  )

  return (
    <FormField
      label={<>{label}:</>}
      horizontal={horizontal}
      centered={centered}
    >
      <Input
        ref={ref}
        placeholder={`${placeholder || defaultValue || ''}`}
        className={cn(
          `w-full`,
          `md:w-60 lg:w-64 xl:w-80`,
          `text-base font-light`,
          className
        )}
        disabled={disabled}
        onChange={handleChange}
        // {...props}
        type={inputType}
        value={`${value || defaultValue}`}

        // since we are controlling the element with value=*, we should not use defaultValue=*
        // defaultValue={`${defaultValue || ""}`}
      />
    </FormField>
  )
}
