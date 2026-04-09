import type {
  GetTagMetaQuery,
  GetTagPostsQuery,
} from '__generated__/operations/content.generated'
import { emitStructured } from '@kids-reporter/logger'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import CommonCollection from '@/components/common-collection'
import {
  ContentType,
  GENERAL_DESCRIPTION,
  KIDS_URL_ORIGIN,
  OG_SUFFIX,
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

  const tagOGRes = await sendRestGqlRequest<GetTagMetaQuery>({
    operation: 'tag-meta',
    method: 'GET',
    variables: {
      where: {
        slug: slug,
      },
    },
  })
  const tagMeta = tagOGRes?.data?.data?.tag
  if (!tagMeta) {
    emitStructured({
      severity: 'WARNING',
      message: `Tag meta not found! ${slug}`,
    })
  }

  return {
    title: `${tagMeta?.ogTitle ? tagMeta.ogTitle + ' - ' : ''}${OG_SUFFIX}`,
    alternates: {
      canonical: `${KIDS_URL_ORIGIN}/tag/${slug}`,
    },
    openGraph: {
      title: tagMeta?.ogTitle ?? OG_SUFFIX,
      description: tagMeta?.ogDescription ?? GENERAL_DESCRIPTION,
      images: tagMeta?.ogImage?.resized?.small
        ? [tagMeta.ogImage.resized.small]
        : [],
    },
    other: {
      // Since we can't inject <!-- <PageMap>...</PageMap> --> to <head> section with Next metadata API,
      // so handle google seo with extra <meta> tag here, but be awared there are limitations(maximum 50 tags):
      // https://developers.google.com/custom-search/docs/structured_data?hl=zh-tw#limitations
      contentType: ContentType.TAG,
    },
  }
}

// Tag's routing path: /tag/[slug]/[page num], ex: /tag/life/1
export default async function Tag({ params }: { params: { slug: any } }) {
  const slug = params.slug?.[0]
  const currentPage = !params.slug?.[1] ? 1 : Number(params.slug[1])
  const traceHeaders = getServerTraceHeaders(headers())
  if (params.slug?.length > 2 || !slug || !(currentPage > 0)) {
    emitStructured({ severity: 'WARNING', message: 'Incorrect tag routing!' })
    notFound()
  }

  const response = await sendRestGqlRequest<GetTagPostsQuery>({
    operation: 'tag-posts',
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

  const tag = response?.data?.data?.tag
  if (!tag) {
    emitStructured({ severity: 'WARNING', message: 'Tag not found!' })
    notFound()
  }
  const posts = tag.posts ?? []
  const postsCount = tag.postsCount ?? 0

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
            <div className="flex h-[360px] w-full items-start justify-center hd:mb-10">
              <h1 className="mt-24 px-6 text-center prose-h1-small font-swei! text-neutral-900 desktop:prose-h1-large">
                {`#${tag.name}`}
              </h1>
            </div>
          ),
        }}
        morePostsMode="pagination"
        totalPages={totalPages}
        currentPage={currentPage}
        routingPrefix={`/tag/${slug}`}
        posts={postSummaries}
      />
    </main>
  )
}
