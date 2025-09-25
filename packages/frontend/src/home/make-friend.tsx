export const MakeFriends = () => {
  return (
    <div
      style={{ backgroundColor: '#fff9ec' }}
      className="mb-16 flex w-screen flex-col items-center"
    >
      <div className="flex max-w-4xl flex-col items-center justify-center gap-10 md:flex-row">
        <div className="flex max-w-lg flex-col items-center pt-8 pr-8 pb-5 pl-8 md:items-start">
          <h3
            style={{ fontFamily: 'SweiMarkerSansCJKtc-Regular,Sans-serif' }}
            className="mb-8 text-center text-2xl md:text-3xl"
          >
            和報導仔交朋友
          </h3>
          <p
            style={{
              color: 'var(--paletteColor4,#232323)',
              lineHeight: '1.6em',
            }}
            className="text-sm font-medium"
          >
            哈囉，我是「報導仔」！
          </p>
          <p
            style={{
              color: 'var(--paletteColor4,#232323)',
              lineHeight: '1.6em',
            }}
            className="text-sm font-medium"
          >
            <br />
            我是《報導者》2022年10月誕生的夥伴，在《少年報導者》擔任管家。天秤座的我重視平等、客觀，個性熱情、觀察力強。有人說我的樣子像大聲公，也有人說我像探照燈。
            <br />
            <br />
            歡迎大家和我交朋友，一起探索世界。有任何想法或觀察請投稿給我，也可以寫信和我分享心得！
          </p>
        </div>
        <img
          className="w-full max-w-44 lg:max-w-80"
          src={'/assets/images/reporter_pic.svg'}
          loading="lazy"
        />
      </div>
    </div>
  )
}

export default MakeFriends
