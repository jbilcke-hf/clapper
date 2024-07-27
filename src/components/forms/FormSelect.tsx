import { cn } from '@/lib/utils'

import { FormField } from './FormField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useTheme } from '@/services'

export function FormSelect<T>({
  label,
  className,
  selectedItemId,
  selectedItemLabel,
  defaultItemId,
  defaultItemLabel,
  items = [],
  onSelect,
  props,
}: {
  label?: string
  className?: string
  selectedItemId?: string
  selectedItemLabel?: string
  defaultItemId?: string
  defaultItemLabel?: string
  items?: {
    id: string
    label: string
    disabled?: boolean
    value: T
  }[]
  onSelect?: (value?: T) => void
  props?: any
}) {
  const theme = useTheme()
  return (
    <FormField
      label={
        typeof defaultItemId !== 'undefined' &&
        typeof defaultItemLabel !== 'undefined'
          ? `${label} (defaults to ${defaultItemLabel || 'N.A.'})`
          : `${label}`
      }
      className={cn(``, className)}
    >
      <Select
        onValueChange={(newSelectedItemId: string) => {
          if (!onSelect) {
            return
          }
          const selectedItem = items.find(
            (item) => item.id === newSelectedItemId
          )
          onSelect(selectedItem?.value)
        }}
        defaultValue={selectedItemId}
        style={{
          borderRadius: theme.formInputRadius || '8px',
        }}
        {...props}
      >
        <SelectTrigger className={cn(`w-full`, `font-mono text-xs font-light`)}>
          <SelectValue placeholder={selectedItemLabel} />
        </SelectTrigger>
        <SelectContent>
          {items?.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}
