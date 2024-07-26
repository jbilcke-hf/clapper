import { MdOutlineCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md'

import { cn } from '@/lib/utils'

import { FormField } from './FormField'
import { Switch } from '../ui/switch'

export function FormSwitch({
  label,
  className,
  checked,
  onCheckedChange,
}: {
  label?: string
  className?: string
  checked?: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <FormField label={label} className={cn(``, className)}>
      <Switch
        checked={checked}
        onCheckedChange={(checked) => {
          onCheckedChange(!checked)
        }}
      />
    </FormField>
  )
}
