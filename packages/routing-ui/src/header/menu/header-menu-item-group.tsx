import { useEffect, useState } from 'react'
import { MenuItem } from '../../types'
import HeaderMenuItem from './header-menu-item'

function MenuItemGroup({
  isMenuOpen,
  menuItems,
}: {
  isMenuOpen: boolean
  menuItems: MenuItem[]
}) {
  const [currentExpandedItem, setCurrentExpandedItem] = useState<string | null>(
    null
  )

  const handleClick = (label: string | null) => {
    setCurrentExpandedItem(label)
  }

  useEffect(() => {
    if (!isMenuOpen) {
      setCurrentExpandedItem(null)
    }
  }, [isMenuOpen])

  return menuItems.map((item) => (
    <HeaderMenuItem
      key={item.label}
      {...item}
      isExpanded={currentExpandedItem === item.label}
      onExpand={handleClick}
    />
  ))
}

export default MenuItemGroup
