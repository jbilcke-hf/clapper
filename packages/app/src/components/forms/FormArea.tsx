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
import { Textarea } from '../ui/textarea'
import { MdError } from 'react-icons/md'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function FormArea<T>(
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
    type,
    rows = 4,
    error,
    ...props
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
    type?: HTMLInputTypeAttribute
    rows?: number
    props?: any
    error?: string | null
  }
  //  & Omit<ComponentProps<typeof Input>, "value" | "defaultValue" | "placeholder" | "type" | "className" | "disabled" | "onChange">
  // & ComponentProps<typeof Input>
) {
  const theme = useTheme()

  const ref = useRef<HTMLTextAreaElement>(null)

  const handleChange = useMemo(
    () => (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (disabled) {
        return
      }
      if (!onChange) {
        return
      }

      const rawStringValue = `${event.currentTarget.value || ''}`

      onChange(rawStringValue as T)
    },
    [disabled, onChange]
  )

  return (
    <FormField label={label} className="relative flex flex-col items-start">
      <Textarea
        ref={ref}
        placeholder={`${placeholder || defaultValue || ''}`}
        className={cn(
          `w-full`,
          `font-mono text-xs font-light`,
          {
            'border-red-500 dark:border-red-800': error,
          },
          className
        )}
        disabled={disabled}
        onChange={handleChange}
        rows={rows}
        // {...props}
        value={`${value || defaultValue}`}
        // since we are controlling the element with value=*, we should not use defaultValue=*
        // defaultValue={`${defaultValue || ""}`}

        style={{
          borderRadius: theme.formInputRadius || '8px',
        }}
        {...props}
      />
      {error && (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="absolute top-0 right-0 m-2 h-4 w-4">
              <MdError color="red" className="h-full w-full" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs font-bold text-red-500">{error}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </FormField>
  )
}
