function SearchHero() {
  return (
    <div className="w-full">
      <img
        src="/assets/images/search/search-hero-mobile-art.svg"
        alt=""
        className="mx-auto block h-[100px] w-[300px] tablet:hidden"
        loading="lazy"
        aria-hidden="true"
      />
      <img
        src="/assets/images/search/search-hero-tablet-art.svg"
        alt=""
        className="mx-auto hidden h-[148px] w-[444px] tablet:block hd:hidden"
        loading="lazy"
        aria-hidden="true"
      />
      <img
        src="/assets/images/search/search-hero-desktop-art.svg"
        alt=""
        className="mx-auto hidden h-[148px] w-[444px] hd:block"
        loading="lazy"
        aria-hidden="true"
      />
    </div>
  )
}

export default SearchHero
