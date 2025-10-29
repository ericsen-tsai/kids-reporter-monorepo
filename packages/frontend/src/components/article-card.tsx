import dynamic from 'next/dynamic'
import Link from 'next/link'

import { FALLBACK_IMG } from '@/constants'
import { ExternalLinkIcon } from '@/icons'
import { getFormattedDate } from '@/utils'

import { PostSummary } from './types'

const ImageWithFallback = dynamic(
  () => import('@/components/image-with-fallback'),
  { ssr: false }
)

type ArticleCardProp = {
  article: PostSummary
  showOverImageCover?: boolean
}

function ArticleCard({ article, showOverImageCover = false }: ArticleCardProp) {
  const hasCategoryOrSubcategory = article.subSubcategory ?? article.category

  return (
    <Link href={article.url} className="group block">
      <div className="flex gap-4">
        <div className="h-22 w-22 flex-shrink-0 desktop:h-[90px] desktop:w-40">
          <div className="relative h-full w-full overflow-hidden rounded-[12px]">
            <ImageWithFallback
              src={article.image ?? FALLBACK_IMG}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-120"
            />
            {showOverImageCover && (
              <div className="absolute inset-0 flex items-center justify-center gap-[6.5px] bg-black/50 opacity-0 group-hover:opacity-100">
                <span className="prose-p1-bold hidden text-white desktop:block">
                  前往報導者
                </span>
                <ExternalLinkIcon />
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            {hasCategoryOrSubcategory && (
              <span className="prose-p3-bold inline-flex items-center rounded-full bg-neutral-200 px-3 py-1 text-neutral-900">
                {article.subSubcategory ?? article.category}
              </span>
            )}

            <span className="prose-p2 text-neutral-500">
              {getFormattedDate(article.publishedDate)}
            </span>
          </div>

          <h3 className="prose-p1-bold desktop:prose-h6-large line-clamp-2 font-bold text-neutral-900 transition-colors duration-200 group-hover:text-red-400">
            {article.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export default ArticleCard
