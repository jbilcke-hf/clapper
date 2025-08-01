'use client'

import * as React from 'react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import {
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
  Menu,
  X,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useBreakpoints } from '@/lib/hooks/useBreakpoints'

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

// Add new components for mobile menu
const MobileMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'hover:bg-accent dark:hover:bg-accent rounded-md p-2 md:hidden',
      className
    )}
    {...props}
  >
    <Menu className="h-6 w-6" />
  </button>
))
MobileMenuTrigger.displayName = 'MobileMenuTrigger'

const MobileMenuDrawer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean
    onClose: () => void
  }
>(({ className, isOpen, onClose, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-background fixed inset-y-0 left-0 z-50 w-64 transform shadow-lg transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      className
    )}
    {...props}
  >
    <button
      onClick={onClose}
      className="hover:bg-accent absolute top-4 right-4 rounded-md p-2"
    >
      <X className="h-6 w-6" />
    </button>
    <div className="h-full overflow-y-auto p-4">{children}</div>
  </div>
))
MobileMenuDrawer.displayName = 'MobileMenuDrawer'

interface MobileMenuProps {
  items: React.ReactNode
  onBack?: () => void
  title?: string
}

const MobileMenu: React.FC<MobileMenuProps> = ({ items, onBack, title }) => (
  <div className="flex h-full w-full flex-col">
    {(onBack || title) && (
      <div className="border-border flex items-center border-b px-4 py-3">
        {onBack && (
          <button onClick={onBack} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
      </div>
    )}
    <div className="flex-1 overflow-y-auto">{items}</div>
  </div>
)

MobileMenu.displayName = 'MobileMenu'

const MobileMenuItem: React.FC<{
  label: React.ReactNode
  children?: React.ReactNode
  onClick?: () => void
}> = ({ label, children, onClick }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClick = () => {
    if (children) {
      setIsOpen(!isOpen)
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <div className="border-border border-b">
      <button
        onClick={handleClick}
        className="flex w-full items-center justify-between px-4 py-3 text-base font-medium"
      >
        {label}
        {children &&
          (isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          ))}
      </button>
      {children && (
        <div className={cn('pl-6', isOpen ? 'block' : 'hidden')}>
          {children}
        </div>
      )}
    </div>
  )
}

function Menubar({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { isMd } = useBreakpoints()

  const renderMobileMenuItems = (
    items: React.ReactNode,
    depth = 0
  ): React.ReactNode => {
    return React.Children.map(items, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === MenubarMenu) {
          const trigger = (child.props as any).children.find(
            (c: React.ReactElement) => c.type === MenubarTrigger
          )
          const content = (child.props as any).children.find(
            (c: React.ReactElement) => c.type === MenubarContent
          )

          return (
            <MobileMenuItem label={(trigger.props as any).children}>
              {renderMobileMenuItems(
                (content.props as any).children,
                depth + 1
              )}
            </MobileMenuItem>
          )
        } else if (child.type === MenubarItem) {
          return (
            <MobileMenuItem
              label={(child.props as any).children}
              onClick={() => {
                if ((child.props as any).onClick) {
                  ;(child.props as any).onClick()
                }
                setIsMobileMenuOpen(false)
              }}
            />
          )
        } else if (child.type === MenubarSub) {
          const subTrigger = (child.props as any).children.find(
            (c: React.ReactElement) => c.type === MenubarSubTrigger
          )
          const subContent = (child.props as any).children.find(
            (c: React.ReactElement) => c.type === MenubarSubContent
          )
          return (
            <MobileMenuItem label={(subTrigger.props as any).children}>
              {renderMobileMenuItems(
                (subContent.props as any).children,
                depth + 1
              )}
            </MobileMenuItem>
          )
        } else if (child.type === MenubarSeparator) {
          return <hr className="border-border my-2" />
        }
      }
      return child
    })
  }

  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn('relative', className)}
      {...props}
    >
      {!isMd && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="hover:bg-accent rounded-md p-2"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
      {!isMd && (
        <div
          className={cn(
            'bg-background fixed inset-0 z-50 transform overflow-y-auto transition-transform duration-300 ease-in-out',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-border flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderMobileMenuItems(children)}
            </div>
          </div>
        </div>
      )}
      {isMd && (
        <div className="bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs">
          {children}
        </div>
      )}
    </MenubarPrimitive.Root>
  )
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none',
        className
      )}
      {...props}
    />
  )
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md',
          className
        )}
        {...props}
      />
    </MenubarPortal>
  )
}

function MenubarItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
