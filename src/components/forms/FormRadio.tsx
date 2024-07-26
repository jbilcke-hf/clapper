import { MdOutlineCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md'

import { cn } from '@/lib/utils'

import { FormField } from './FormField'

export function FormRadio({
  label,
  className,
  selected,
  items,
}: {
  label?: string
  className?: string
  selected?: string
  items?: { name: string; label: string; disabled?: boolean }[]
}) {
  return (
    <FormField label={label} className={cn(``, className)}>
      {items?.map((item) => (
        <div
          key={item.name}
          className={cn(
            `flex flex-row items-center space-x-2`,
            selected === item.name
              ? `font-light text-neutral-200`
              : item.disabled
                ? `font-light text-neutral-600`
                : `font-light text-neutral-400`
          )}
        >
          {selected === item.name ? (
            <MdOutlineCheckCircle className="text-lg" />
          ) : (
            <MdRadioButtonUnchecked className="text-lg" />
          )}
          <span>{item.label}</span>
        </div>
      ))}
    </FormField>
  )
}
