import type {
  GetAuthorMetaQuery,
  GetAuthorPostsQuery,
} from '__generated__/operations/content.generated'
import { emitStructured } from '@kids-reporter/logger'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import CommonCollection from '@/components/common-collection'
import {
  ContentType,
  DEFAULT_AVATAR,
  GENERAL_DESCRIPTION,
  KIDS_URL_ORIGIN,
  POST_PER_PAGE,
} from '@/constants'
import { getPostSummaries } from '@/utils'
import { sendRestGqlRequest } from '@/utils/send-rest-gql'
import { getServerTraceHeaders } from '@/utils/trace-context'

export async function generateMetadata({
  params,
}: {
  params: { slug: any }
}): Promise<Metadata> {
  const slug = params.slug?.[0]

  const authorMetaRes = await sendRestGqlRequest<GetAuthorMetaQuery>({
    operation: 'author-meta',
    method: 'GET',
    variables: {
      where: {
        slug: slug,
      },
    },
  })
  const authorMeta = authorMetaRes?.data?.data?.author
  if (!authorMeta) {
    emitStructured({
      severity: 'WARNING',
      message: `Author meta not found! ${slug}`,
    })
    return {}
  }

  return {
    title: authorMeta.name,
    alternates: {
      canonical: `${KIDS_URL_ORIGIN}/author/${slug}`,
    },
    openGraph: {
      title: authorMeta.name,
      description: authorMeta.bio ?? GENERAL_DESCRIPTION,
      images: authorMeta.image?.resized?.small
        ? [authorMeta.image.resized.small]
        : [],
    },
    other: {
      // Since we can't inject <!-- <PageMap>...</PageMap> --> to <head> section with Next metadata API,
      // so handle google seo with extra <meta> tag here, but be awared there are limitations(maximum 50 tags):
      // https://developers.google.com/custom-search/docs/structured_data?hl=zh-tw#limitations
      contentType: ContentType.AUTHOR,
    },
  }
}

// Author's routing path: /author/[slug]/[page num], ex: /author/yunruchen/1
export default async function Author({ params }: { params: { slug: any } }) {
  const slug = params.slug?.[0]
  const currentPage = !params.slug?.[1] ? 1 : Number(params.slug[1])
  const traceHeaders = getServerTraceHeaders(headers())
  if (params.slug?.length > 2 || !slug || !(currentPage > 0)) {
    emitStructured({
      severity: 'WARNING',
      message: 'Incorrect author routing!',
    })
    notFound()
  }

  const response = await sendRestGqlRequest<GetAuthorPostsQuery>({
    operation: 'author-posts',
    method: 'GET',
    variables: {
      where: {
        slug: slug,
      },
      orderBy: [
        {
          publishedDate: 'desc',
        },
      ],
      take: POST_PER_PAGE,
      skip: (currentPage - 1) * POST_PER_PAGE,
    },
    traceHeaders,
  })
  const author = response?.data?.data?.author
  if (!author) {
    emitStructured({ severity: 'WARNING', message: 'Author not found!' })
    notFound()
  }
  const posts = author.posts ?? []
  const postsCount = author.postsCount ?? 0

  const avatarURL = author.avatar?.resized?.tiny ?? DEFAULT_AVATAR

  const totalPages = Math.ceil(postsCount / POST_PER_PAGE)
  if (currentPage > 1 && currentPage > totalPages) {
    emitStructured({
      severity: 'WARNING',
      message: `Request page(${currentPage}) exceeds total pages(${totalPages})!`,
    })
    notFound()
  }

  const postSummaries = getPostSummaries(posts)

  return (
    <main className="mx-auto flex flex-col items-center justify-center">
      <CommonCollection
        hero={{
          type: 'customized',
          content: (
            <div className="flex w-full flex-col items-center px-6 pt-12 pb-22 tablet:px-8 tablet:pt-16 tablet:pb-44 desktop:px-12 desktop:pt-20 desktop:pb-50 hd:px-0">
              <div className="flex w-full flex-col items-center gap-6 text-center tablet:max-w-[582px] tablet:flex-row tablet:items-start tablet:gap-12 tablet:text-left desktop:max-w-[608px] hd:max-w-[790px]">
                <div className="h-[120px] w-[120px] shrink-0 overflow-hidden tablet:h-[160px] tablet:w-[160px]">
                  <img
                    src={avatarURL}
                    alt={author.name ?? ''}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex w-full flex-col gap-4">
                  <div className="flex w-full flex-col gap-1">
                    <h1 className="prose-h5-small text-neutral-900 desktop:prose-h5-large">
                      {author.name ?? ''}
                    </h1>
                    {author.email != null && author.email !== '' && (
                      <a
                        href={`mailto:${author.email}`}
                        className="prose-p2 text-blue-400 underline decoration-neutral-400 underline-offset-2 desktop:prose-p1"
                      >
                        {author.email}
                      </a>
                    )}
                  </div>
                  {author.bio != null && author.bio !== '' && (
                    <p className="prose-p2 whitespace-pre-wrap text-neutral-900 desktop:prose-p1">
                      {author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ),
        }}
        morePostsMode="pagination"
        totalPages={totalPages}
        currentPage={currentPage}
        routingPrefix={`/author/${slug}`}
        posts={postSummaries}
      />
    </main>
  )
}
