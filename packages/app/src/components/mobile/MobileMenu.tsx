import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Clapper</SheetTitle>
          <SheetDescription>
            TODO JULIAN: we need a way to display the hierarchical menu on
            mobile
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
