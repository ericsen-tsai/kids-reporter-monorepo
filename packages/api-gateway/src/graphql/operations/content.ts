import {
  ensureArray,
  ensureRecord,
  Operation,
  parseVars,
  postContentFragment,
  toInt,
} from './shared.js'

export const operations: Record<string, Operation> = {
  'latest-posts': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetLatestPosts',
    document: `
      ${postContentFragment}
      query GetLatestPosts($orderBy: [PostOrderByInput!]!, $take: Int) {
        posts(orderBy: $orderBy, take: $take) {
          ...PostContent
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      const take = toInt(input.take)
      const orderBy = Array.isArray(input.orderBy)
        ? input.orderBy
        : [{ publishedDate: 'desc' }]
      return { orderBy, take }
    },
  },
  'editor-picks-settings': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetEditorPicksSettings',
    document: `
      ${postContentFragment}
      query GetEditorPicksSettings($take: Int) {
        editorPicksSettings(take: $take) {
          id
          editorPicksOfPostsOrdered {
            ...PostContent
          }
          editorPicksOfTags { name slug }
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { take: toInt(input.take) }
    },
  },
  'call-baodaozai-intro': {
    method: 'GET',
    cacheTtl: 300,
    auth: 'public',
    operationName: 'GetCallBaodaozaiIntro',
    document: `
      query GetCallBaodaozaiIntro($where: CallBaodaozaiIntroWhereUniqueInput!) {
        callBaodaozaiIntro(where: $where) {
          id
          page
          content
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      const where = ensureRecord(input.where, 'Missing where')
      const page = where.page
      if (typeof page !== 'string') {
        throw new Error('Missing where.page')
      }
      return { where: { page } }
    },
  },
  'category-posts': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetCategoryPosts',
    document: `
      ${postContentFragment}
      query GetCategoryPosts(
        $where: CategoryWhereUniqueInput!
        $take: Int
        $skip: Int
      ) {
        category(where: $where) {
          relatedPosts(take: $take, skip: $skip) {
            ...PostContent
          }
          relatedPostsCount
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return {
        where: ensureRecord(input.where, 'Missing where'),
        take: toInt(input.take),
        skip: toInt(input.skip),
      }
    },
  },
  'category-metadata': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetCategoryMetadata',
    document: `
      query GetCategoryMetadata(
        $categoryWhere: CategoryWhereUniqueInput!
        $subcategoryWhere: SubcategoryWhereInput!
      ) {
        category(where: $categoryWhere) {
          ogTitle
          ogDescription
          ogImage { resized { medium } }
          subcategories(where: $subcategoryWhere) {
            ogTitle
            ogDescription
            ogImage { resized { medium } }
          }
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return {
        categoryWhere: ensureRecord(
          input.categoryWhere,
          'Missing categoryWhere'
        ),
        subcategoryWhere: ensureRecord(
          input.subcategoryWhere,
          'Missing subcategoryWhere'
        ),
      }
    },
  },
  'category-subcategories-and-theme-color': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetCategorySubcategoriesAndThemeColor',
    document: `
      query GetCategorySubcategoriesAndThemeColor(
        $where: CategoryWhereUniqueInput!
      ) {
        category(where: $where) {
          subcategories { name slug }
          themeColor
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'subcategory-posts': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetSubcategoryPosts',
    document: `
      ${postContentFragment}
      query GetSubcategoryPosts(
        $where: SubcategoryWhereUniqueInput!
        $take: Int
        $skip: Int
      ) {
        subcategory(where: $where) {
          relatedPosts(take: $take, skip: $skip) {
            ...PostContent
          }
          relatedPostsCount
          category { slug }
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return {
        where: ensureRecord(input.where, 'Missing where'),
        take: toInt(input.take),
        skip: toInt(input.skip),
      }
    },
  },
  'sub-subcategory-posts': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetSubSubcategoryPosts',
    document: `
      ${postContentFragment}
      query GetSubSubcategoryPosts(
        $where: SubSubcategoryWhereUniqueInput!
        $take: Int
        $skip: Int
        $orderBy: [PostOrderByInput!]!
      ) {
        subSubcategory(where: $where) {
          relatedPosts(take: $take, skip: $skip, orderBy: $orderBy) {
            ...PostContent
          }
          relatedPostsCount
          subcategory {
            slug
            category { slug }
          }
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return {
        where: ensureRecord(input.where, 'Missing where'),
        take: toInt(input.take),
        skip: toInt(input.skip),
        orderBy: ensureArray(input.orderBy, 'Missing orderBy'),
      }
    },
  },
  'topic-projects': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetTopicProjects',
    document: `
      query GetTopicProjects($orderBy: [ProjectOrderByInput!]!, $take: Int) {
        projects(orderBy: $orderBy, take: $take) {
          title
          subtitle
          slug
          heroImage { resized { small } }
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return {
        orderBy: ensureArray(input.orderBy, 'Missing orderBy'),
        take: toInt(input.take),
      }
    },
  },
  'post-detail': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetPost',
    document: `
      ${postContentFragment}
      query GetPost(
        $where: PostWhereUniqueInput!
        $orderBy: [NewsReadingGroupItemOrderByInput!]!
        $take: Int
        $relatedPostsWhere: PostWhereInput!
        $postEssayQuestionsTake: Int
        $postChoiceQuestionsTake: Int
      ) {
        post(where: $where) {
          opening
          title
          showBaodaozai
          newsReadingGroup { items(orderBy: $orderBy) { name embedCode } }
          brief
          content
          publishedDate
          heroImage {
            imageFile { width height }
            resized { small medium large }
          }
          heroCaption
          authors {
            avatar { resized { tiny } }
            bio
            id
            name
            slug
          }
          authorsJSON
          tagsOrdered { name slug }
          TWReporterRelatedPostsJSON
          relatedPostsOrdered {
            title
            slug
            publishedDate
            heroImage { resized { small medium large } }
            ogDescription
            subSubcategoriesOrdered {
              name
              slug
              subcategory {
                name
                slug
                category { name slug themeColor }
              }
            }
          }
          subtitle
          subSubcategoriesOrdered {
            name
            slug
            subcategory {
              name
              slug
              category { name slug themeColor }
            }
          }
          mainProject { title slug }
          projects {
            title
            slug
            relatedPosts(take: $take, where: $relatedPostsWhere) {
              ...PostContent
            }
          }
          postEssayQuestions(take: $postEssayQuestionsTake) {
            id
            title
            hint
          }
          postChoiceQuestions(take: $postChoiceQuestionsTake) {
            id
            title
            options
            reason
          }
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return {
        where: ensureRecord(input.where, 'Missing where'),
        orderBy: ensureArray(input.orderBy, 'Missing orderBy'),
        take: toInt(input.take),
        relatedPostsWhere: ensureRecord(
          input.relatedPostsWhere,
          'Missing relatedPostsWhere'
        ),
        postEssayQuestionsTake: toInt(input.postEssayQuestionsTake),
        postChoiceQuestionsTake: toInt(input.postChoiceQuestionsTake),
      }
    },
  },
  'post-meta': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetPostMeta',
    document: `
      query GetPostMeta($where: PostWhereUniqueInput!) {
        post(where: $where) {
          publishedDate
          ogDescription
          ogTitle
          ogImage { resized { small } }
          subSubcategoriesOrdered {
            name
            slug
            subcategory {
              name
              slug
              category { name slug themeColor }
            }
          }
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
}
