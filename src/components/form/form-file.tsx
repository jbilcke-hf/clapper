import { ChangeEvent, useMemo, useRef } from "react"

import { cn } from "@/lib/utils"

import { Input } from "../ui/input"

import { FormField } from "./form-field"

export function FormFile({
  label,
  className,
  placeholder,
  disabled,
  onChange,
  horizontal,
  accept
 }: {
  label?: string
  className?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (files: File[]) => void
  horizontal?: boolean
  accept?: string
  }) {
  const ref = useRef<HTMLInputElement>(null)

  const handleChange = useMemo(() => (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return
    }
    if (!onChange) {
      return
    }

    const files = Array.from(event.currentTarget.files || [])
    onChange(files)
  }, [])

  return (
    <FormField
      label={
      `${label}:`
      }
      horizontal={horizontal}
       >
      <Input
        ref={ref}
        placeholder={`${placeholder || ""}`}
        className={cn(`w-full md:w-52 lg:w-56 xl:w-64 font-normal text-base`, className)}
        disabled={disabled}
        onChange={handleChange}
        type="file"
        accept={accept}
      />
    </FormField>
  )
}