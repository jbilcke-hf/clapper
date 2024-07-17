import { ChangeEvent, useMemo, useRef } from "react"

import { cn } from "@/lib/utils"

import { Input } from "../ui/input"

import { FormField } from "./FormField"

export function FormFile({
  label,
  className,
  placeholder,
  disabled,
  onChange,
  horizontal,
  accept,
  centered,
 }: {
  label?: string
  className?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (files: File[]) => void
  horizontal?: boolean
  accept?: string
  centered?: boolean
  }) {
  const ref = useRef<HTMLInputElement>(null)

  const handleChange = useMemo(() => (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return
    }
    if (!onChange) {
      return
    }

    onChange(Array.from<File>(event.currentTarget.files || []))
  }, [disabled, onChange])

  return (
    <FormField
      label={
      `${label}:`
      }
      horizontal={horizontal}
      centered={centered}
       >
      <Input
        ref={ref}
        placeholder={`${placeholder || ""}`}
        className={cn(`w-full md:w-60 lg:w-64 xl:w-80 font-light text-base`, className)}
        disabled={disabled}
        onChange={handleChange}
        type="file"
        accept={accept}
      />
    </FormField>
  )
}