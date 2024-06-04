import { MdOutlineCheckCircle, MdRadioButtonUnchecked } from "react-icons/md"

import { cn } from "@/lib/utils"

import { FormField } from "./form-field"

export function FormRadio({ label, className, selected, items, horizontal }: {
  label?: string
  className?: string
  selected?: string
  items?: { name: string; label: string; disabled?: boolean }[]
  horizontal?: boolean
}) {
  return (
    <FormField
      label={label}
      className={cn(`flex-row space-x-5`, className)}
      horizontal={horizontal}>
      {items?.map(item => (
        <div key={item.name} className={cn(
          `flex flex-row items-center space-x-2`,
          selected === item.name
            ? `text-gray-200 font-normal`
            : (
              item.disabled ? `text-gray-600 font-normal` :  `text-gray-400 font-normal`
            )
        )}>
          {selected === item.name
            ? <MdOutlineCheckCircle className="text-lg" />
            : <MdRadioButtonUnchecked className="text-lg" />}
          <span>{item.label}</span>
        </div>
      ))}
    </FormField>
  )
}