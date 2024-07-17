import { ChangeEvent, useMemo } from "react"

import { cn } from "@/lib/utils"

import { Input } from "../ui/input"

import { FormField } from "./FormField"

export function FormDir({
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
        placeholder={`${placeholder || ""}`}
        className={cn(`w-full md:w-52 lg:w-56 xl:w-64 font-light text-base`, className)}
        disabled={disabled}
        onChange={handleChange}
        type="file"
        {...{directory: ""} as any} // saw it in stack overflow, but the type isn't recognized here.. hmm
        webkitdirectory=""
        accept={accept}
      />
    </FormField>
  )
}