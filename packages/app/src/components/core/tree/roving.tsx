// adapted from joshuawootonn/react-components-from-scratch
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
  FocusEvent,
  MouseEvent,
  KeyboardEvent,
  ComponentPropsWithoutRef,
  ElementType,
  MutableRefObject,
} from 'react'
import isHotkey from 'is-hotkey'
import { RovingTabindexItem } from './types'

function focusFirst(candidates: HTMLElement[]) {
  const previousFocus = document.activeElement
  while (document.activeElement === previousFocus && candidates.length > 0) {
    candidates.shift()?.focus()
  }
}

const RovingTabindexContext = createContext<{
  currentRovingTabindexValue: string | null
  setFocusableId: (id: string) => void
  onShiftTab: () => void
  getOrderedItems: () => RovingTabindexItem[]
  elements: MutableRefObject<Map<string, HTMLElement>>
}>({
  currentRovingTabindexValue: null,
  setFocusableId: () => {},
  onShiftTab: () => {},
  getOrderedItems: () => [],
  elements: { current: new Map<string, HTMLElement>() },
})

const NODE_SELECTOR = 'data-roving-tabindex-node'
const ROOT_SELECTOR = 'data-roving-tabindex-root'
export const NOT_FOCUSABLE_SELECTOR = 'data-roving-tabindex-not-focusable'

type RovingTabindexRootBaseProps<T> = {
  children: ReactNode | ReactNode[]
  active: string | null
  as?: T
}

type RovingTabindexRootProps<T extends ElementType> =
  RovingTabindexRootBaseProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof RovingTabindexRootBaseProps<T>>

export function RovingTabindexRoot<T extends ElementType>({
  children,
  active,
  as,
  ...props
}: RovingTabindexRootProps<T>) {
  const Component = as || 'div'
  const [isShiftTabbing, setIsShiftTabbing] = useState(false)
  const [currentRovingTabindexValue, setCurrentRovingTabindexValue] = useState<
    string | null
  >(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const elements = useRef<Map<string, HTMLElement>>(new Map())

  const getOrderedItems = useCallback(() => {
    if (!rootRef.current) return []
    const domElements = Array.from(
      rootRef.current.querySelectorAll(
        `:where([${NODE_SELECTOR}=true]):not(:where([${NOT_FOCUSABLE_SELECTOR}=true] *))`
      )
    )

    return Array.from(elements.current)
      .sort((a, b) => domElements.indexOf(a[1]) - domElements.indexOf(b[1]))
      .map(([id, element]) => ({ id, element }))
  }, [])

  return (
    <RovingTabindexContext.Provider
      value={{
        setFocusableId: function (id: string) {
          setCurrentRovingTabindexValue(id)
        },
        onShiftTab: function () {
          setIsShiftTabbing(true)
        },
        currentRovingTabindexValue,
        getOrderedItems,
        elements,
      }}
    >
      <Component
        {...{ [ROOT_SELECTOR]: true }}
        tabIndex={isShiftTabbing ? -1 : 0}
        onFocus={(e: any) => {
          if (e.target !== e.currentTarget) return
          if (isShiftTabbing) return
          const orderedItems = getOrderedItems()
          if (orderedItems.length === 0) return

          const candidates = [
            elements.current.get(currentRovingTabindexValue ?? ''),
            elements.current.get(active ?? ''),
            ...orderedItems.map((i) => i.element),
          ].filter((element): element is HTMLElement => element != null)

          focusFirst(candidates)
        }}
        onBlur={() => setIsShiftTabbing(false)}
        ref={rootRef as any}
        {...(props as any)}
      >
        {children}
      </Component>
    </RovingTabindexContext.Provider>
  )
}

export function getNextFocusableId(
  orderedItems: RovingTabindexItem[],
  id: string
): RovingTabindexItem | undefined {
  const currIndex = orderedItems.findIndex((item) => item.id === id)
  return orderedItems.at(currIndex === orderedItems.length ? 0 : currIndex + 1)
}

export function getParentFocusableId(
  orderedItems: RovingTabindexItem[],
  id: string
): RovingTabindexItem | undefined {
  const currentElement = orderedItems.find((item) => item.id === id)?.element

  if (currentElement == null) return

  let possibleParent = currentElement.parentElement

  while (
    possibleParent != null &&
    possibleParent.getAttribute(NODE_SELECTOR) == null &&
    possibleParent.getAttribute(ROOT_SELECTOR) == null
  ) {
    possibleParent = possibleParent?.parentElement ?? null
  }

  return orderedItems.find((item) => item.element === possibleParent)
}

export function getPrevFocusableId(
  orderedItems: RovingTabindexItem[],
  id: string
): RovingTabindexItem | undefined {
  const currIndex = orderedItems.findIndex((item) => item.id === id)
  return orderedItems.at(currIndex === 0 ? -1 : currIndex - 1)
}

export function getFirstFocusableId(
  orderedItems: RovingTabindexItem[]
): RovingTabindexItem | undefined {
  return orderedItems.at(0)
}

export function getLastFocusableId(
  orderedItems: RovingTabindexItem[]
): RovingTabindexItem | undefined {
  return orderedItems.at(-1)
}

function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length])
}

export function getNextFocusableIdByTypeahead(
  items: RovingTabindexItem[],
  originalId: string,
  keyPressed: string
) {
  const index = items.findIndex(({ id }) => id === originalId)
  const wrappedItems = wrapArray(items, index)
  let typeaheadMatchIndex: RovingTabindexItem | undefined

  for (
    let index = 0;
    index < wrappedItems.length - 1 && typeaheadMatchIndex == null;
    index++
  ) {
    const nextItem = wrappedItems.at(index + 1)

    if (
      nextItem?.element?.textContent?.charAt(0).toLowerCase() ===
      keyPressed.charAt(0).toLowerCase()
    ) {
      typeaheadMatchIndex = nextItem
    }
  }

  return typeaheadMatchIndex
}

export function useRovingTabindex(id: string) {
  const {
    currentRovingTabindexValue,
    setFocusableId,
    onShiftTab,
    getOrderedItems,
    elements,
  } = useContext(RovingTabindexContext)

  return {
    getOrderedItems,
    isFocusable: currentRovingTabindexValue === id,
    getRovingProps: <T extends ElementType>(
      props?: ComponentPropsWithoutRef<T>
    ) => ({
      ...props,
      ref: (element: HTMLElement | null) => {
        if (element) {
          elements.current.set(id, element)
        } else {
          elements.current.delete(id)
        }
      },
      onMouseDown: (e: MouseEvent) => {
        props?.onMouseDown?.(e)
        if (e.target !== e.currentTarget) return
        setFocusableId(id)
      },
      onKeyDown: (e: KeyboardEvent) => {
        props?.onKeyDown?.(e)
        if (e.target !== e.currentTarget) return
        if (isHotkey('shift+tab', e)) {
          onShiftTab()
          return
        }
      },
      onFocus: (e: FocusEvent) => {
        props?.onFocus?.(e)
        if (e.target !== e.currentTarget) return
        setFocusableId(id)
      },
      [NODE_SELECTOR]: true,
      tabIndex: currentRovingTabindexValue === id ? 0 : -1,
    }),
  }
}
