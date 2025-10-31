import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { getCallBaodaozaiIntroContent } from '@/api/call-baodaozai-intro'
import AllSiteBaodaozaiEventTrigger from '@/components/all-site-baodaozai-event-trigger'
import Pagination from '@/components/pagination'
import PostList from '@/components/post-list'
import {
  CATEGORY_IMAGES,
  DEFAULT_THEME_COLOR,
  ERROR_PAGE,
  GENERAL_DESCRIPTION,
  POST_CONTENT_GQL,
  POST_PER_PAGE,
} from '@/constants'
import { getPostSummaries, log, LogLevel, sendGQLRequest } from '@/utils'
import {
  mapCategorySlugToIntroPageType,
  parseCategoryInfoFromPath,
} from '@/utils/category'

import Navigator from '../../_components/category/navigator'

const seoFields = `
  ogTitle
  ogDescription
  ogImage {
    resized {
      medium
    }
  }
`

const query = `
  query GetCategory($categoryWhere: CategoryWhereUniqueInput!, $subcategoryWhere: SubcategoryWhereInput!) {
    category(where: $categoryWhere) {
      ${seoFields}
      subcategories(where: $subcategoryWhere) {
        ${seoFields}
      }
    }
  }
`

export async function generateMetadata({
  params,
}: {
  params: { path: string[] }
}): Promise<Metadata> {
  const categorySlug = params.path?.[0]
  const subcategorySlug = params.path?.[1] ?? ''

  const res = await sendGQLRequest({
    query,
    variables: {
      categoryWhere: {
        slug: categorySlug,
      },
      subcategoryWhere: {
        slug: {
          equals: subcategorySlug,
        },
      },
    },
  })

  const category = res?.data?.data?.category

  if (!category) {
    log(
      LogLevel.INFO,
      `Category metadata not found. URL path is: /${params.path.join('/')}`
    )
    return {}
  }

  const title =
    category?.subcategories?.[0]?.ogTitle ||
    category?.ogTitle ||
    '分類: 少年報導者 The Reporter for Kids'
  const description =
    category?.subcategories?.[0]?.ogDescription ||
    category?.ogDescription ||
    GENERAL_DESCRIPTION

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images:
        category?.subcategories?.[0]?.ogImage?.resized?.medium ??
        category?.ogImage?.resized?.medium,
    },
  }
}

const subcategoriesGQL = `
query($where: CategoryWhereUniqueInput!) {
  category(where: $where) {
    subcategories {
      name
      slug
    }
    themeColor
  }
}
`

const categoryPostsGQL = `
query($where: CategoryWhereUniqueInput!, $take: Int!, $skip: Int!) {
  category(where: $where) {
    relatedPosts(take: $take, skip: $skip) {
      ${POST_CONTENT_GQL}
    }
    relatedPostsCount
  }
}
`

const subcategoryPostsGQL = `
query($where: SubcategoryWhereUniqueInput!, $take: Int!, $skip: Int!) {
  subcategory(where: $where) {
    category {
      slug
    }
    relatedPosts(take: $take, skip: $skip) {
      ${POST_CONTENT_GQL}
    }
    relatedPostsCount
  }
}
`

const subSubcategoryPostsGQL = `
query($where: SubSubcategoryWhereUniqueInput!, $take: Int!, $skip: Int!, $orderBy: [PostOrderByInput!]!) {
  subSubcategory(where: $where) {
    subcategory {
      slug
      category {
        slug
      }
    }
    relatedPosts(take: $take, skip: $skip, orderBy: $orderBy) {
      ${POST_CONTENT_GQL}
    }
    relatedPostsCount
  }
}
`

export default async function Category({
  params,
}: {
  params: { path: string[] | undefined }
}) {
  const path = params.path
  if (!path || !Array.isArray(path) || path.length === 0) {
    log(LogLevel.WARNING, `Incorrect category path! ${path}`)
    notFound()
  }

  // Category page routing scenarios:   ex: /category/path[0]/path[1]/path[2]...
  // -------------------------------------------------------------------------------
  // length = 1(category)               ex: /category/news
  // length = 2(subcategory)            ex: /category/news/times
  // length = 3(subSubcategory)         ex: /category/news/times/medical-news
  // length = 3(category, page N)       ex: /category/news/page/2
  // length = 4(subcategory, page N)    ex: /category/news/times/page/2
  // length = 5(subSubcategory, page N) ex: /category/news/times/medical-news/page/2
  const {
    category,
    subcategory,
    subSubcategory,
    currentPage = 1,
    isNotFound,
  } = parseCategoryInfoFromPath(path)

  if (isNotFound || !category) {
    log(LogLevel.WARNING, `Category not found! ${path}`)
    notFound()
  }

  const imageURL = CATEGORY_IMAGES[category]
  const pageEnum = mapCategorySlugToIntroPageType(category)

  const introContent = pageEnum
    ? await getCallBaodaozaiIntroContent({ where: { page: pageEnum } })
    : undefined

  // Fetch subcategories for navigation
  const navigationItems = []
  const subcategoriesRes = await sendGQLRequest({
    query: subcategoriesGQL,
    variables: {
      where: {
        slug: category,
      },
    },
  })
  const categoryData = subcategoriesRes?.data?.data?.category
  if (!categoryData) {
    log(LogLevel.WARNING, 'Incorrect category!')
    notFound()
  }
  const theme = categoryData.themeColor || DEFAULT_THEME_COLOR
  const subcategories = categoryData.subcategories?.map((sub: any) => {
    return (
      sub && {
        name: sub.name,
        path: `/category/${category}/${sub.slug}`,
      }
    )
  })

  navigationItems.push({ name: '所有文章', path: `/category/${category}` })
  if (Array.isArray(subcategories) && subcategories.length > 0) {
    navigationItems.push(...subcategories)
  }

  // Fetch related posts of subSubcategory/subcategory/category
  let query, slug
  if (subSubcategory) {
    query = subSubcategoryPostsGQL
    slug = subSubcategory
  } else if (subcategory) {
    query = subcategoryPostsGQL
    slug = subcategory
  } else {
    query = categoryPostsGQL
    slug = category
  }
  const commonVars = {
    where: {
      slug: slug,
    },
    take: POST_PER_PAGE,
    skip: (currentPage - 1) * POST_PER_PAGE,
  }
  const postsRes = await sendGQLRequest({
    query: query,
    variables: subSubcategory
      ? {
          ...commonVars,
          orderBy: [
            {
              publishedDate: 'desc',
            },
          ],
        }
      : commonVars,
  })
  if (!postsRes) {
    log(LogLevel.WARNING, `Empty related posts!`)
    redirect(ERROR_PAGE)
  }

  let targetCategory
  if (subSubcategory) {
    targetCategory = postsRes?.data?.data?.subSubcategory
    if (
      subcategory !== targetCategory?.subcategory?.slug ||
      category !== targetCategory?.subcategory?.category?.slug
    ) {
      log(
        LogLevel.WARNING,
        `Parent category mismatch! subSubcategory=${subSubcategory}, subcategory=${targetCategory?.subcategory?.slug}/${subcategory}, category=${targetCategory?.subcategory?.category?.slug}/${category}`
      )
      redirect(ERROR_PAGE)
    }
  } else if (subcategory) {
    targetCategory = postsRes?.data?.data?.subcategory
    if (category !== targetCategory?.category?.slug) {
      log(
        LogLevel.WARNING,
        `Parent category mismatch! subcategory=${subcategory}, category=${targetCategory?.category?.slug}/${category}`
      )
      redirect(ERROR_PAGE)
    }
  } else {
    targetCategory = postsRes?.data?.data?.category
  }

  if (!targetCategory) {
    log(LogLevel.WARNING, 'Fetch targetCategory failed!')
    notFound()
  }

  const posts = getPostSummaries(targetCategory.relatedPosts)
  const postsCount = targetCategory.relatedPostsCount

  const totalPages = Math.ceil(postsCount / POST_PER_PAGE)
  if (totalPages > 0 && currentPage > totalPages) {
    log(
      LogLevel.WARNING,
      `Incorrect page! currentPage=${currentPage}, totalPages=${totalPages}`
    )
    notFound()
  }

  let routingPrefix
  if (subSubcategory) {
    routingPrefix = `/category/${category}/${subcategory}/${subSubcategory}/page`
  } else if (subcategory) {
    routingPrefix = `/category/${category}/${subcategory}/page`
  } else {
    routingPrefix = `/category/${category}/page`
  }

  return (
    <main
      style={{ width: '95vw' }}
      className="mb-10 flex flex-col items-center justify-center"
    >
      <div
        className={`flex w-full flex-col items-center justify-center gap-10 theme-${theme}`}
      >
        <img className="w-full max-w-xl" src={imageURL} loading="lazy" />
        {pageEnum && (
          <>
            <AllSiteBaodaozaiEventTrigger
              id="show-intro"
              content={introContent}
            />
            <div className="relative">
              <div className="absolute top-[150vh]">
                <AllSiteBaodaozaiEventTrigger id="hide-intro" />
              </div>
            </div>
          </>
        )}
        <div className="flex flex-row flex-wrap justify-center gap-2.5">
          {navigationItems?.map(
            (item, index) =>
              item && (
                <Navigator
                  key={`category-navigation-${index}`}
                  name={item.name}
                  path={item.path}
                  active={
                    item.path ===
                    `/category/${category}${
                      subcategory ? `/${subcategory}` : ''
                    }`
                  }
                />
              )
          )}
        </div>
        <PostList posts={posts} />
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            routingPrefix={routingPrefix}
          />
        )}
      </div>
    </main>
  )
}
