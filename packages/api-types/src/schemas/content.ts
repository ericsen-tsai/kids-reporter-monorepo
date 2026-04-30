import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { RestErrorBodySchema } from '../rest.js'

extendZodWithOpenApi(z)

export const registry = new OpenAPIRegistry()

export const PhotoResizedSchema = z
  .object({
    small: z
      .string()
      .default('')
      .openapi({ example: 'https://kids.twreporter.org/resized/abc-800.webp' }),
  })
  .openapi('ResizedPhoto')

export const PostHeroImageSchema = z
  .object({
    resized: PhotoResizedSchema,
  })
  .openapi('PostHeroImage')

export const PostSubSubcategorySchema = z
  .object({
    name: z.string(),
    subcategory: z
      .object({
        name: z.string(),
        category: z
          .object({
            slug: z.string(),
            themeColor: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
      })
      .nullable()
      .optional(),
  })
  .openapi('PostSubSubcategory')

export const PostContentSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    ogDescription: z.string().nullable().optional(),
    heroImage: PostHeroImageSchema.nullable().optional(),
    subSubcategoriesOrdered: z.array(PostSubSubcategorySchema).default([]),
    publishedDate: z.iso.datetime().nullable().optional(),
  })
  .openapi('PostContent')

export type PostContent = z.infer<typeof PostContentSchema>

export const ProjectCardSchema = z
  .object({
    title: z.string().nullable().optional(),
    subtitle: z.string().nullable().optional(),
    slug: z.string(),
    publishedDate: z.iso.datetime().nullable().optional(),
    heroImage: z
      .object({
        resized: z.object({
          small: z.string().default(''),
        }),
      })
      .nullable()
      .optional(),
  })
  .openapi('ProjectCard')

export const SubcategoryItemSchema = z
  .object({
    id: z.union([z.string(), z.number().int()]),
    name: z.string(),
    slug: z.string(),
    category: z.object({ slug: z.string() }).nullable().optional(),
  })
  .openapi('Subcategory')

export const CallBaodaozaiIntroItemSchema = z
  .object({
    id: z.union([z.string(), z.number().int()]),
    page: z.string(),
    content: z.string(),
  })
  .openapi('CallBaodaozaiIntro')

export const EditorPicksSettingItemSchema = z
  .object({
    id: z.union([z.string(), z.number().int()]),
    editorPicksOfPostsOrdered: z.array(PostContentSchema).default([]),
    editorPicksOfTags: z
      .array(z.object({ name: z.string(), slug: z.string() }))
      .default([]),
    popularKeywordsOrdered: z.array(z.object({ name: z.string() })).default([]),
  })
  .openapi('EditorPicksSetting')

export const V1PostsQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(50).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
  orderBy: z.enum(['publishedDate:desc']).optional(),
})

export const V1PostsResponseSchema = z.object({
  posts: z.array(PostContentSchema),
  page: z.object({
    take: z.number().int().min(1).max(50),
    skip: z.number().int().min(0),
  }),
})

registry.registerPath({
  method: 'get',
  path: '/v1/posts',
  description: 'List latest published posts.',
  request: {
    query: V1PostsQuerySchema,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1PostsResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
  },
})

export const V1SubcategoriesResponseSchema = z.array(SubcategoryItemSchema)

registry.registerPath({
  method: 'get',
  path: '/v1/subcategories',
  description: 'All subcategories with parent category slug.',
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1SubcategoriesResponseSchema,
        },
      },
    },
  },
})

export const V1AuthorAvatarPathParamsSchema = z.object({
  slug: z.string().min(1),
})

export const V1AuthorAvatarResponseSchema = z
  .object({
    tiny: z.string(),
  })
  .openapi('AuthorAvatarTiny')

registry.registerPath({
  method: 'get',
  path: '/v1/authors/by-slug/{slug}/avatar',
  description:
    'Author avatar tiny image URL by slug. `tiny` is empty when the author or avatar is missing.',
  request: {
    params: V1AuthorAvatarPathParamsSchema,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1AuthorAvatarResponseSchema,
        },
      },
    },
  },
})

export const V1PopularKeywordsResponseSchema = z.array(
  z.object({ name: z.string() })
)

registry.registerPath({
  method: 'get',
  path: '/v1/popular-keywords',
  description: 'Popular keywords from editor picks ordering.',
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1PopularKeywordsResponseSchema,
        },
      },
    },
  },
})

export const V1CallBaodaozaiIntroPathParamsSchema = z.object({
  page: z.enum([
    'home',
    'all',
    'topics',
    'news',
    'storytelling',
    'campus',
    'listeningNews',
    'classroom',
  ]),
})

export const V1CallBaodaozaiIntroResponseSchema = CallBaodaozaiIntroItemSchema

registry.registerPath({
  method: 'get',
  path: '/v1/call-baodaozai-intros/{page}',
  description: 'Get Call Baodaozai intro content by page.',
  request: {
    params: V1CallBaodaozaiIntroPathParamsSchema,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1CallBaodaozaiIntroResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
  },
})

export const V1TopicProjectsQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(50).optional().default(12),
  orderBy: z.enum(['publishedDate:desc']).optional(),
})

export const V1TopicProjectsResponseSchema = z.object({
  projects: z.array(ProjectCardSchema),
  page: z.object({
    take: z.number().int().min(1).max(50),
  }),
})

export const V1ProjectsListQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(50).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
  orderBy: z.enum(['publishedDate:desc']).optional(),
  includeRelatedPosts: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => v === 'true'),
})

export const ProjectHeroMediumSchema = z
  .object({
    resized: z.object({
      medium: z.string().default('').openapi({
        example: 'https://kids.twreporter.org/resized/abc-1200.webp',
      }),
    }),
  })
  .openapi('ProjectHeroMedium')

export const V1ProjectListItemSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    ogDescription: z.string().nullable().optional(),
    publishedDate: z.iso.datetime().nullable().optional(),
    heroImage: ProjectHeroMediumSchema.nullable().optional(),
    relatedPostsOrdered: z.array(PostContentSchema).optional(),
  })
  .openapi('ProjectListItem')

export const V1ProjectsListResponseSchema = z.object({
  projects: z.array(V1ProjectListItemSchema),
  projectsCount: z.number().int().min(0),
})

registry.registerPath({
  method: 'get',
  path: '/v1/projects',
  description:
    'List published projects with optional related post cards (matches GetProjects).',
  request: {
    query: V1ProjectsListQuerySchema,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1ProjectsListResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/v1/projects/topics',
  description: 'List topic projects.',
  request: {
    query: V1TopicProjectsQuerySchema,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1TopicProjectsResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
  },
})

export const V1EditorPicksSettingsQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(20).optional().default(5),
})

export const V1EditorPicksSettingsResponseSchema = z.array(
  EditorPicksSettingItemSchema
)

registry.registerPath({
  method: 'get',
  path: '/v1/editor-picks-settings',
  description: 'Editor picks configuration rows.',
  request: {
    query: V1EditorPicksSettingsQuerySchema,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1EditorPicksSettingsResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
  },
})

export const V1MemberAvatarSchema = z
  .object({
    id: z.string(),
    fileUrl: z.string(),
  })
  .openapi('MemberAvatar')

export const V1MemberProfileSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    nickname: z.string(),
    contactEmail: z.string(),
    twreporter_user_id: z.string(),
    showBaodaozai: z.boolean(),
    essayQuestionCount: z.number().int().nullable().optional(),
    avatar: V1MemberAvatarSchema.nullable().optional(),
    createdAt: z.iso.datetime().nullable().optional(),
  })
  .openapi('MemberProfile')

export const V1MemberProfileResponseSchema = V1MemberProfileSchema

export const V1MemberProfilePatchBodySchema = z
  .object({
    name: z.string().optional(),
    nickname: z.string().optional(),
    contactEmail: z.string().optional(),
    showBaodaozai: z.boolean().optional(),
    essayQuestionCount: z.number().int().min(0).max(3).optional(),
  })
  .strict()
  .openapi('MemberProfilePatch')

/** Successful `POST /auth/access-token` response JSON. */
export const V1AccessTokenResponseSchema = z.object({
  accessToken: z.string(),
  twreporterUserId: z.string(),
  expiresAt: z.number(),
})

/** GET `/v1/members/me/posts-with-answers` query string. */
export const V1MemberPostsWithAnswersQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(50).optional().default(5),
  cursor: z.string().optional(),
})

registry.registerPath({
  method: 'get',
  path: '/v1/members/me',
  description: 'Authenticated member profile (Bearer JWT).',
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1MemberProfileResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
    404: {
      description: 'Member not found',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/v1/members/me',
  description: 'Update authenticated member profile (Bearer JWT).',
  request: {
    body: {
      content: {
        'application/json': {
          schema: V1MemberProfilePatchBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1MemberProfileResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
    404: {
      description: 'Member not found',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
  },
})

export const V1PostBySlugPathParamsSchema = z.object({
  slug: z.string().min(1),
})

export const V1PostBySlugQuerySchema = z.object({
  /** JSON string matching `GetPostQueryVariables` (excluding `where`, taken from path slug). */
  variables: z.string().optional(),
})

export const V1PostDetailEnvelopeSchema = z
  .object({
    post: z.unknown().nullable(),
  })
  .openapi('V1PostDetailEnvelope')

export const V1PostMetaEnvelopeSchema = z
  .object({
    post: z.unknown().nullable(),
  })
  .openapi('V1PostMetaEnvelope')

export const V1PostEssayQuestionsEnvelopeSchema = z
  .object({
    post: z.unknown().nullable(),
  })
  .openapi('V1PostEssayQuestionsEnvelope')

export const V1PostsEssayAnswersWithLikesQueryStringSchema = z.object({
  /** JSON string matching `GetPostsEssayAnswersWithLikesQueryVariables`. */
  variables: z.string().min(1),
})

export const V1PostsEssayAnswersWithLikesEnvelopeSchema = z
  .object({
    posts: z.array(z.unknown()),
  })
  .openapi('V1PostsEssayAnswersWithLikesEnvelope')

registry.registerPath({
  method: 'get',
  path: '/v1/posts/by-slug/{slug}',
  description:
    'Single post article payload (matches GraphQL `GetPost`). Optional `variables` query holds JSON for orderBy, take, relatedPostsWhere, postEssayQuestionsTake, postChoiceQuestionsTake.',
  request: {
    params: V1PostBySlugPathParamsSchema,
    query: V1PostBySlugQuerySchema,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1PostDetailEnvelopeSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/v1/posts/by-slug/{slug}/meta',
  description:
    'Post SEO / Open Graph metadata (matches GraphQL `GetPostMeta`).',
  request: {
    params: V1PostBySlugPathParamsSchema,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1PostMetaEnvelopeSchema,
        },
      },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/v1/posts/by-slug/{slug}/essay-questions',
  description:
    'Post card plus essay questions (matches GraphQL `GetPostEssayQuestions`).',
  request: {
    params: V1PostBySlugPathParamsSchema,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1PostEssayQuestionsEnvelopeSchema,
        },
      },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/v1/posts/essay-answers-with-likes',
  description:
    'Paged posts with nested essay answers and member avatars (matches GraphQL `GetPostsEssayAnswersWithLikes`).',
  request: {
    query: V1PostsEssayAnswersWithLikesQueryStringSchema,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: V1PostsEssayAnswersWithLikesEnvelopeSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: RestErrorBodySchema,
        },
      },
    },
  },
})
