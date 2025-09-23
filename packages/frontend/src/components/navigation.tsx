'use client'
import Link from 'next/link'
import { MENU_ITEMS } from '@/constants'
import { useState } from 'react'

export const Navigation = (props: { onClick?: () => void }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const handleMouseEnter = (label: string) => {
    setExpandedItem(label)
  }

  const handleMouseLeave = () => {
    setExpandedItem(null)
  }

  return (
    <nav aria-label="頁首選單">
      <ul role="menubar" className="flex items-center">
        {MENU_ITEMS.map((item, index) => {
          const hasSubItems = item.subItems && item.subItems.length > 0
          const isExpanded = expandedItem === item.label

          return (
            <li
              key={`header-nav-item-${index}`}
              className="relative"
              onMouseEnter={() => hasSubItems && handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                onClick={() => {
                  props.onClick?.()
                }}
                role="menuitem"
                className="px-4 py-2 prose-p2 text-neutral-900 font-medium hover:text-red-400 transition-colors"
              >
                {item.label}
              </Link>

              {hasSubItems && isExpanded && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-sm z-50 min-w-48">
                  <ul className="py-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={`sub-item-${subIndex}`}>
                        <Link
                          href={subItem.href}
                          onClick={() => {
                            props.onClick?.()
                          }}
                          className="block px-4 py-2 prose-p2 text-neutral-700 hover:bg-gray-50 hover:text-red-400 transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navigation
