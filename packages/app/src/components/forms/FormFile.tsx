import { ChangeEvent, useMemo, useRef } from 'react'

import { cn } from '@/lib/utils'

import { Input } from '../ui/input'

import { FormField } from './FormField'

export function FormFile({
  label,
  className,
  placeholder,
  disabled,
  onChange,
  accept,
}: {
  label?: string
  className?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (files: File[]) => void
  accept?: string
}) {
  const ref = useRef<HTMLInputElement>(null)

  const handleChange = useMemo(
    () => (event: ChangeEvent<HTMLInputElement>) => {
      if (disabled) {
        return
      }
      if (!onChange) {
        return
      }

      onChange(Array.from<File>(event.currentTarget.files || []))
    },
    [disabled, onChange]
  )

  return (
    <FormField label={label}>
      <Input
        ref={ref}
        placeholder={`${placeholder || ''}`}
        className={cn(`w-full`, `font-mono text-xs font-light`, className)}
        disabled={disabled}
        onChange={handleChange}
        type="file"
        accept={accept}
      />
    </FormField>
  )
}
