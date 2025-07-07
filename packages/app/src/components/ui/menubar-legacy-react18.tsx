'use client'

import * as React from 'react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import {
  Check,
  ChevronRight,
  Circle,
  Menu,
  X,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'

import { cn } from '@/lib/utils/cn'
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
      'rounded-md p-2 hover:bg-neutral-100 md:hidden dark:hover:bg-neutral-800',
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
      'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-neutral-900',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      className
    )}
    {...props}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
      <div className="flex items-center border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
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
    <div className="border-b border-neutral-200 dark:border-neutral-700">
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

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, children, ...props }, ref) => {
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
          return <hr className="my-2 border-gray-200 dark:border-gray-700" />
        }
      }
      return child
    })
  }

  return (
    <MenubarPrimitive.Root
      ref={ref}
      className={cn('relative', className)}
      {...props}
    >
      {!isMd && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
      {!isMd && (
        <div
          className={cn(
            'fixed inset-0 z-50 transform overflow-y-auto bg-white transition-transform duration-300 ease-in-out dark:bg-neutral-900',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-700">
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
        <div className="flex h-full items-center space-x-0 border border-none border-neutral-100/50 bg-white/50 p-1 shadow-none dark:border-none dark:border-neutral-950/50 dark:bg-neutral-950/50">
          {children}
        </div>
      )}
    </MenubarPrimitive.Root>
  )
})
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex cursor-default items-center rounded-xs px-1.5 py-1.5 text-xs font-normal outline-hidden select-none focus:bg-neutral-100 focus:text-neutral-900 data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900 lg:px-2 lg:text-sm dark:text-neutral-400 dark:focus:bg-neutral-800 dark:focus:text-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-300',
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default items-center rounded-xs px-2 py-1.5 text-sm outline-hidden select-none focus:bg-neutral-100 focus:text-neutral-900 data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-200 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-200',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-900 shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default items-center rounded-xs px-2 py-1.5 text-sm outline-hidden select-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-45 dark:focus:bg-neutral-800 dark:focus:text-neutral-200',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default items-center rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-45 dark:focus:bg-neutral-800 dark:focus:text-neutral-200',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default items-center rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-45 dark:focus:bg-neutral-800 dark:focus:text-neutral-200',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn(
      '-mx-1 my-1 h-px bg-neutral-100 dark:bg-neutral-800',
      className
    )}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'text-neutral-2000 ml-auto text-xs tracking-widest dark:text-neutral-400',
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = 'MenubarShortcut'

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
