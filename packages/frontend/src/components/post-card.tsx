import dynamic from 'next/dynamic'
import Link from 'next/link'

import { Loading, PostSummary } from '@/components/types'
import { FALLBACK_IMG } from '@/constants'
import { getFormattedDate } from '@/utils'

const ImageWithFallback = dynamic(
  () => import('@/components/image-with-fallback'),
  { ssr: false }
)

export type PostCardProp = {
  className?: string
  post: PostSummary
  isSimple?: boolean
  loading?: Loading
}

export const PostCard = ({
  className,
  post,
  isSimple = false,
  loading = Loading.LAZY,
}: PostCardProp) => {
  return (
    post && (
      <Link
        href={post.url}
        className={`flex h-full w-full flex-col justify-start rounded-2xl bg-transparent pr-1 pl-1 theme-${
          post.theme
        } ${className ?? ''}`}
      >
        <div
          style={{ height: 'calc(100% / 16 * 9)', aspectRatio: '16/9' }}
          className="max-w-full"
        >
          <ImageWithFallback
            style={{ borderRadius: isSimple ? '20px 20px 0 0' : '20px' }}
            className={`h-full w-full overflow-hidden rounded-2xl object-cover align-middle`}
            src={post.image ?? FALLBACK_IMG}
            loading={loading}
          />
        </div>
        <div
          style={{ borderRadius: isSimple ? '0 0 20px 20px' : '' }}
          className={`flex h-full flex-col justify-between pt-5 pb-1 md:pb-5 ${
            isSimple ? 'px-5' : ''
          } bg-white`}
        >
          <div className="flex flex-col justify-start">
            <span
              style={{ color: 'var(--theme-color)', lineHeight: '160%' }}
              className="mb-1 text-left text-base font-medium tracking-wider"
            >
              {post.category}
            </span>
            <span
              style={{
                minHeight: 'auto',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: '2',
                lineHeight: '160%',
                letterSpacing: '0.08em',
              }}
              className="mb-5 overflow-hidden text-left text-xl font-bold text-gray-900 not-italic md:min-h-16"
            >
              {post.title}
            </span>
            {!isSimple && (
              <span
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: '3',
                  lineHeight: '160%',
                }}
                className="mb-5 overflow-hidden text-left text-base font-medium tracking-wider text-gray-900 not-italic"
              >
                {post.desc}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            {post.subSubcategory && (
              <span
                style={{ background: 'var(--theme-color)', lineHeight: '160%' }}
                className="pointer-events-none rounded-3xl px-3 py-1 text-center text-xs font-normal tracking-wider text-white"
              >
                {post.subSubcategory}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {(post.publishedDate && getFormattedDate(post.publishedDate)) ??
                ''}
            </span>
          </div>
        </div>
      </Link>
    )
  )
}

export default PostCard
