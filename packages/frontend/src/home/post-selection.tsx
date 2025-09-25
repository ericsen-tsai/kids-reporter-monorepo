import Link from 'next/link'

import PostCard from '@/components/post-card'
import { Loading, PostSummary } from '@/components/types'
import { getFormattedDate } from '@/utils'

import styles from './post-selection.module.css'

type PostSelectionProp = {
  latestPosts: PostSummary[]
  featuredPosts: PostSummary[]
}

const PostBrick = ({ post }: { post: PostSummary }) => {
  return (
    post && (
      <Link className={`${styles['post-brick']} flex flex-col`} href={post.url}>
        <div className="flex flex-row items-center justify-between">
          <p
            style={{ lineHeight: '160%', letterSpacing: '.2em' }}
            className="text-left text-sm font-medium text-gray-500"
          >{`${post.category ?? ''}/${post.subSubcategory ?? ''}`}</p>
          <p
            style={{ letterSpacing: '.05em', color: 'var(--paletteColor6)' }}
            className="items-center text-right text-sm font-bold"
          >
            {post.publishedDate ? getFormattedDate(post.publishedDate) : ''}
          </p>
        </div>
        <p
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: '2',
            lineHeight: '160%',
            letterSpacing: '.08em',
          }}
          className="mt-5 overflow-hidden text-left text-lg font-bold text-gray-900"
        >
          {post.title}
        </p>
      </Link>
    )
  )
}

export const PostSelection = (props: PostSelectionProp) => {
  const latestPosts = props?.latestPosts
  const featuredPosts = props?.featuredPosts

  return (
    <div
      style={{ backgroundColor: '#fff9ec' }}
      className="flex w-full flex-col items-center py-5"
    >
      <img
        className="mx-auto my-8 w-full max-w-52"
        src={'/assets/images/selected_news.png'}
        alt="精選文章"
        loading="eager"
      />
      <div className="flex max-w-(--breakpoint-xl) flex-col gap-10 p-6 lg:flex-row">
        <div
          style={{ flexGrow: '8', flexBasis: '25%' }}
          className="flex shrink flex-col justify-between gap-5"
        >
          <div className="flex flex-row items-center justify-between rounded-3xl bg-white pt-2.5 pr-5 pb-3 pl-3.5">
            <span
              style={{ lineHeight: '160%', letterSpacing: '.08em' }}
              className="flex items-center gap-2.5 text-xl font-bold text-gray-900"
            >
              <img src={'/assets/images/home-icon-clock.svg'} loading="eager" />
              最新文章
            </span>
            <Link
              style={{ lineHeight: '160%', letterSpacing: '.08em' }}
              className="flex items-center gap-1 text-lg font-medium text-gray-900"
              href={'/all'}
            >
              更多
              <i className="icon-rpjr-icon-arrow-right" />
            </Link>
          </div>
          <div
            style={{ flex: '1' }}
            className="gap-8 rounded-3xl bg-white px-7 py-5 sm:hidden md:grid md:grid-cols-2 lg:grid lg:grid-cols-1 lg:grid-rows-6"
          >
            {latestPosts?.map((post, index) => {
              return <PostBrick key={`latest-post-${index}`} post={post} />
            })}
          </div>
        </div>
        {featuredPosts?.length > 0 && (
          <div
            style={{ flexGrow: '25', flexBasis: '75%' }}
            className="flex shrink flex-col gap-5 rounded-3xl"
          >
            <div
              style={{ rowGap: '20px' }}
              className="inline-flex flex-wrap justify-between"
            >
              <div className={`${styles['card-child-1']}`}>
                {featuredPosts?.[0] && (
                  <PostCard
                    post={featuredPosts[0]}
                    isSimple={true}
                    loading={Loading.EAGER}
                  />
                )}
              </div>
              <div className={`${styles['card-child-2']}`}>
                {featuredPosts?.[1] && (
                  <PostCard
                    post={featuredPosts[1]}
                    isSimple={true}
                    loading={Loading.EAGER}
                  />
                )}
              </div>
              <div className={`${styles['card-child-rest']}`}>
                {featuredPosts?.[2] && (
                  <PostCard
                    post={featuredPosts[2]}
                    isSimple={true}
                    loading={Loading.EAGER}
                  />
                )}
              </div>
              <div className={`${styles['card-child-rest']}`}>
                {featuredPosts?.[3] && (
                  <PostCard
                    post={featuredPosts[3]}
                    isSimple={true}
                    loading={Loading.EAGER}
                  />
                )}
              </div>
              <div className={`${styles['card-child-rest']}`}>
                {featuredPosts?.[4] && (
                  <PostCard
                    post={featuredPosts[4]}
                    isSimple={true}
                    loading={Loading.EAGER}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostSelection
