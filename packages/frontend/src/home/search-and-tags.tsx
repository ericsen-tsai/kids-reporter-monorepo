import Tags, { Tag } from '@/components/tags'
import { SEARCH_PLACEHOLDER, Theme } from '@/constants'
import { SearchIcon } from '@/icons'

type SearchAndTagsProp = {
  tags: Tag[]
}

export const SearchAndTags = (props: SearchAndTagsProp) => {
  const tags = props?.tags
  return (
    <div
      className={`mb-16 flex w-full flex-col items-center justify-center pr-8 pl-8 theme-${Theme.YELLOW}`}
    >
      <img
        className="mb-10 w-full max-w-64"
        decoding="async"
        src="/assets/images/search_title.svg"
        loading="lazy"
      />
      <form
        style={{ maxWidth: '50%' }}
        className="relative mb-12 flex h-10 w-full flex-row items-center"
        role="search"
        method="get"
        action="/search"
        aria-haspopup="listbox"
      >
        <input
          className="h-full w-full rounded-full border-2 border-solid bg-white pr-10 pl-3 text-base focus:outline-hidden"
          style={{
            color: 'var(#A3A3A3, var(--color))',
            borderColor: 'var(--theme-color)',
          }}
          type="text"
          placeholder={SEARCH_PLACEHOLDER}
          name="q"
          title="Search for..."
          aria-label="Search for..."
        />
        <button
          className="absolute right-2.5 h-4 w-4 cursor-pointer border-0 bg-transparent"
          type="submit"
          aria-label="搜尋按鈕"
        >
          {SearchIcon}
        </button>
      </form>
      {tags && (
        <div className="max-w-lg">
          <Tags title={'常用關鍵字'} tags={tags} fill={true} />
        </div>
      )}
    </div>
  )
}

export default SearchAndTags
