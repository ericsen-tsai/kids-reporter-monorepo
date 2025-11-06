import { Header, SearchIcon } from '@kids-reporter/routing-ui'

import AuthHeaderLoggedInSetter from '@/components/auth-header-logged-in-setter'
import {
  ADDITIONAL_MENU_ITEMS,
  DONATE_URL,
  MENU_ITEMS,
  SEARCH_PLACEHOLDER,
  SOCIAL_MEDIA_ITEMS,
  SUBSCRIBE_URL,
} from '@/constants'

function NotFound() {
  return (
    <>
      <Header
        menuItems={MENU_ITEMS}
        additionalMenuItems={ADDITIONAL_MENU_ITEMS}
        socialMediaHrefs={SOCIAL_MEDIA_ITEMS.map((item) => item.href)}
        searchPlaceholder={SEARCH_PLACEHOLDER}
        subscribeUrl={SUBSCRIBE_URL}
        donateUrl={DONATE_URL}
      />
      <AuthHeaderLoggedInSetter />
      <div
        style={{ width: '95vw' }}
        className="mb-16 flex flex-col items-center justify-center"
      >
        <img
          className="w-full max-w-72 md:max-w-md lg:max-w-xl"
          src="/assets/images/404.png"
          alt="Not found"
          loading="lazy"
        />
        <div className="flex flex-col items-center justify-center gap-2.5">
          <h1 className="text-3xl font-bold md:text-4xl">
            很抱歉，找不到符合條件的頁面。
          </h1>
          <div
            style={{
              fontFamily: 'var(--fontFamily)',
              color: 'var(--paletteColor3)',
            }}
            className="text-base font-medium"
          >
            看起來在這個位置找不到東西。也許可以試著找其他的？
          </div>
        </div>
        <form
          role="search"
          method="get"
          className="relative mt-6 mb-12 flex h-10 w-full max-w-sm flex-row items-center"
          action="/search"
          aria-haspopup="listbox"
          data-live-results="thumbs"
        >
          <input
            className="h-full w-full rounded-full border-2 border-solid bg-white pr-10 pl-3 text-base focus:outline-hidden"
            style={{
              color: 'var(#A3A3A3, var(--color))',
              borderColor: 'var(--paletteColor1)',
            }}
            type="text"
            placeholder="搜尋"
            name="q"
            title="Search for..."
            aria-label="Search for..."
          />
          <button
            type="submit"
            className="absolute right-2.5 h-4 w-4 cursor-pointer border-0 bg-transparent"
            aria-label="搜尋按鈕"
          >
            <SearchIcon />
          </button>
        </form>
      </div>
    </>
  )
}

export default NotFound
