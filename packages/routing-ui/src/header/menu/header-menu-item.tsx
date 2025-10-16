import { MenuItem } from '../../types'
import { cn } from '../../utils/cn'
import { useHeaderContext } from '../header-context'

type HeaderMenuItemProps = {
  contentClassName?: string
  isExpanded?: boolean
  onExpand?: (label: string | null) => void
} & MenuItem

function HeaderMenuItem({
  label,
  href,
  subItems,
  external,
  showIcon,
  icon,
  isExpanded,
  contentClassName,
  onExpand,
}: HeaderMenuItemProps) {
  const hasSubItems = subItems && subItems.length > 0
  const context = useHeaderContext()
  const closeMenu = context?.closeMenu

  const handleExpand = () => {
    if (hasSubItems) {
      onExpand?.(isExpanded ? null : label)
    }
  }

  const content = (
    <div
      className={cn(
        'group flex w-full items-center justify-between text-neutral-900 transition-colors duration-100 group-hover:text-neutral-900',
        contentClassName
      )}
    >
      <div className="gap-2 flex items-center">
        {showIcon && icon && (
          <div className="w-4 h-4 flex items-center justify-center">{icon}</div>
        )}
        <span
          className={cn(
            'prose-p1-bold',
            isExpanded && 'text-red-400 group-hover:text-red-400'
          )}
        >
          {label}
        </span>
      </div>

      {hasSubItems && (
        <div
          className={cn(
            'w-6 h-6 flex items-center justify-center transition-transform',
            isExpanded && 'rotate-180 text-red-400 group-hover:text-red-400'
          )}
        >
          <svg width="14" height="7" viewBox="0 0 14 7" fill="none">
            <path
              d="M1 1L7 6L13 1"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  )

  if (hasSubItems) {
    return (
      <div className="w-full">
        <button
          onClick={handleExpand}
          className="px-6 tablet:px-8 py-2 flex w-full cursor-pointer items-center justify-between transition-colors duration-200 hover:bg-neutral-black/5 active:bg-neutral-black/10"
        >
          {content}
        </button>
        <div
          className={cn(
            'ease-in-out overflow-hidden transition-all duration-300',
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          {subItems.map((subItem, index) => (
            <a
              key={index}
              href={subItem.href}
              className="px-6 tablet:px-12 py-2 pl-12 prose-p2 font-medium block transition-colors duration-200 hover:bg-neutral-black/5 hover:text-neutral-900 active:bg-neutral-black/10"
              onClick={closeMenu}
            >
              {subItem.label}
            </a>
          ))}
        </div>
      </div>
    )
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={
          'px-6 tablet:px-8 py-2 block transition-colors duration-200 hover:bg-neutral-black/5 active:bg-neutral-black/10'
        }
      >
        {content}
      </a>
    )
  }

  return (
    <a
      href={href}
      className={
        'px-6 tablet:px-8 py-2 block transition-colors duration-200 hover:bg-neutral-black/5 active:bg-neutral-black/10'
      }
      onClick={closeMenu}
    >
      {content}
    </a>
  )
}

export default HeaderMenuItem
