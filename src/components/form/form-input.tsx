import { ChangeEvent, HTMLInputTypeAttribute, useMemo, useRef } from "react"

import { cn, getValidNumber, isValidNumber } from "@/lib/utils"

import { Input } from "../ui/input"

import { FormField } from "./form-field"

export function FormInput<T>({
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
  // ...props
 }: {
  label?: string
  className?: string
  placeholder?: string
  value?: T
  minValue?: T
  maxValue?: T
  defaultValue?: T
  disabled?: boolean
  onChange?: (newValue: T) => void
  horizontal?: boolean
  type?: HTMLInputTypeAttribute
 }
 //  & Omit<ComponentProps<typeof Input>, "value" | "defaultValue" | "placeholder" | "type" | "className" | "disabled" | "onChange">
 // & ComponentProps<typeof Input>
 ) {

  const isNumberInput =
    typeof defaultValue === "number"
    || typeof value === "number" 

  const isTextInput =
    typeof defaultValue === "string"
    || typeof value === "number"

  // we try to use the type provided by the user if possible,
  // otherwise we "guess" it
  const inputType: HTMLInputTypeAttribute = type ||
  (
    isNumberInput ? "number" 
    : isTextInput ? "text"
    : "text"
  )

  const ref = useRef<HTMLInputElement>(null)

  const handleChange = useMemo(() => (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return
    }
    if (!onChange) {
      return
    }

    const rawStringValue = `${event.currentTarget.value || ""}`

    // this could be refactorer maybe
    if (isNumberInput) {
      const validMinValue: number = minValue && isValidNumber(minValue) ? (minValue as number) : 0
      const validMaxValue: number = maxValue && isValidNumber(maxValue) ? (maxValue as number) : 1
      const validDefaultValue: number = defaultValue && isValidNumber(defaultValue) ? (defaultValue as number) : 0
      
      const numericValue = getValidNumber(
        rawStringValue,
        validMinValue,
        validMaxValue,
        validDefaultValue,
      ) 
      onChange(numericValue as T)
    } else {
      onChange(rawStringValue as T)
    }
  }, [isNumberInput, isTextInput, minValue, maxValue, defaultValue])

  return (
    <FormField
      label={
      `${label}:`
      }
      horizontal={horizontal}
       >
      <Input
        ref={ref}
        placeholder={`${placeholder || defaultValue || ""}`}
        className={cn(`w-full md:w-52 lg:w-56 xl:w-64 font-light text-base`, className)}
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