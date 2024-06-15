import { MdOutlineCheckCircle, MdRadioButtonUnchecked } from "react-icons/md"

import { cn } from "@/lib/utils"

import { FormField } from "./FormField"
import { Switch } from "../ui/switch"

export function FormSwitch({ label, className, checked, onCheckedChange, horizontal }: {
  label?: string
  className?: string
  checked?: boolean
  onCheckedChange: (checked: boolean) => void
  horizontal?: boolean
}) {
  return (
    <FormField
      label={label}
      className={cn(`flex-row space-x-5`, className)}
      horizontal={horizontal}>
      <Switch
        checked={checked}
        onCheckedChange={(checked) => {
          console.log("onCheckedChange: " + checked)
          onCheckedChange(!checked)
        }}
      />
    </FormField>
  )
}