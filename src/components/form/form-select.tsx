
import { cn } from "@/lib/utils"

import { FormField } from "./form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function FormSelect<T>({
  label,
  className,
  selectedItemId,
  selectedItemLabel,
  defaultItemId,
  defaultItemLabel,
  items = [],
  onSelect,
  horizontal,
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
  horizontal?: boolean
}) {
  
  return (
    <FormField
      label={
        typeof defaultItemId !== "undefined" && typeof defaultItemLabel !== "undefined"
          ? `${label} (defaults to ${defaultItemLabel || "N.A."}):`
        : `${label}:`
      }
      className={cn(``, className)}
      horizontal={horizontal}>
      <Select
        onValueChange={(newSelectedItemId: string) => {
          if (!onSelect) {
            return
          }
          const selectedItem = items.find(item => item.id === newSelectedItemId)
          onSelect(selectedItem?.value)
        }}
        defaultValue={selectedItemId}>
        <SelectTrigger className="w-full md:w-52 lg:w-56 xl:w-64 font-light text-base">
          <SelectValue placeholder={selectedItemLabel} />
        </SelectTrigger>
        <SelectContent>
          {items?.map(item =>
            <SelectItem
            key={item.id}
            value={item.id}>{
            item.label
            }</SelectItem>
          )}
        </SelectContent>
      </Select>
    </FormField>
  )
}