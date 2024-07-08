// adapted from joshuawootonn/react-components-from-scratch
import React from "react"
import { AnimatePresence, motion, MotionConfig } from "framer-motion"

import { cn } from "@/lib/utils"

import { Folder, File, Arrow } from "./icons"
import { useTreeNode } from "./useTreeNode"
import { Root } from "./root"
import { TreeNodeType } from "./types"

export function Node<S,T>({ node, showArrows, indentLeaves }: {
  node: TreeNodeType<S,T>

  // show the little arrows on the left
  showArrows?: boolean

  // indent leaves (but it takes more space)
  indentLeaves?: boolean
}) {
  const {
    isOpen,
    isFocusable,
    isSelected,
    isExpanded,
    getTreeNodeProps,
    treeGroupProps,
  } = useTreeNode(node.id, {
    selectionType: 'distinct',
    isFolder: Boolean(node.children?.length),
    isExpanded: Boolean(node.isExpanded),
    data: node,
  })

  const IconComponent = node.icon!

  return (
    <li
      {...getTreeNodeProps({
        className: cn(
          'relative cursor-pointer select-none flex flex-col focus:outline-none group',
        )
      })}
    >
      <MotionConfig
        transition={{
          ease: [0.164, 0.84, 0.43, 1],
          duration: 0.25,
        }}
      >
        <div
          className={cn(
            'group flex flex-row items-center border-[1.5px] border-transparent space-x-2',
            isFocusable &&
              'group-focus:border-gray-900/0 focus-within:border-transparent',
            /*
              isSelected 
              ? 'bg-gray-700/100 text-gray-200'
              : 'bg-transparent text-gray-400 hover:text-gray-200',
            */
           
             "hover:bg-gray-700/20 text-gray-300 hover:text-gray-200 fill-gray-300 hover:fill-gray-200",
            
            node.className,
          )}
        >
          {node.children?.length ? (
            <>
              {showArrows ? <Arrow
                className="h-4 w-4 flex-shrink-0"
                open={isOpen}
              /> : null}
              <div className="flex flex-col items-center justify-center h-5 w-5 flex-shrink-0">
                {node.icon
                  ? <div className="flex flex-col items-center justify-center w-full h-full scale-125">
                      <IconComponent />
                    </div>
                  : <Folder
                  open={isOpen}
                  className="w-full h-full"
                />}
              </div>
            </>
          ) : (
            <div
              className={cn(
                `flex flex-col items-center justify-center h-5 w-5 flex-shrink-0`,
                showArrows ? "ml-6" : ""
                )}>
              {node.icon
                ? <div className="flex flex-col items-center justify-center w-full h-full scale-110 mt-0.5">
                    <IconComponent />
                  </div>
                : <File className="w-full h-full" />}
            </div>
          )}
          <span
            className={cn(
              `font-sans font-light text-base`,
              `text-ellipsis whitespace-nowrap overflow-hidden`,
              `flex-grow`,
              node.className,
            )}>
            {node.label}{
              // Array.isArray(node.children) ? `(${node.children.length ? node.children.length : "empty"})` : ""
            }
          </span>
        </div>

        <AnimatePresence initial={false}>
          {node.children?.length && isOpen && (
            <motion.ul
              key={node.id + 'ul'}
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  height: {
                    duration: 0.25,
                  },
                  opacity: {
                    duration: 0.2,
                    delay: 0.05,
                  },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    duration: 0.25,
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              }}
              {...treeGroupProps}
              className={cn(
                'pl-3'
              )}
            >
              <motion.svg
                viewBox="0 0 3 60"
                fill="none"
                preserveAspectRatio="none"
                width={2}
                xmlns="http://www.w3.org/2000/svg"

                // if you want to display vertical lines, tweak the stroke-gray-900/100 
                className="absolute top-[31px] h-[calc(100%-30px)] bottom-0 left-3.5 transform -translate-x-1/2 stroke-gray-900/100 z-[-1]"
                key={node.id + 'line'}
                stroke="currentColor"
              >
                <motion.line
                  strokeLinecap="round"
                  x1="1"
                  x2="1"
                  y1="1"
                  y2="59"
                  strokeWidth={2}
                />
              </motion.svg>
              {node.children.map(node => (
                <Node
                  key={node.id}
                  node={node}
                  showArrows={showArrows}
                  indentLeaves={indentLeaves}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </MotionConfig>
    </li>
  )
}

export const Tree = { Root, Node }