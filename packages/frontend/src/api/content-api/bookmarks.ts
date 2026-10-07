import type { CreateBookmarkResponse, V1CreateBookmarkBody } from '@/types/api'
import type { TraceHeaders } from '@/types/trace-headers'
import { sendContentApiRequest } from '@/utils/send-content-api'

export type PostBookmarkLookup = { id: string }

export async function getPostBookmarkBySlugContentApi({
  accessToken,
  slug,
  traceHeaders,
}: {
  accessToken: string
  slug: string
  traceHeaders?: TraceHeaders
}): Promise<PostBookmarkLookup | null> {
  const rows = await sendContentApiRequest<Array<{ id: string }>>({
    path: '/v1/members/me/bookmarks',
    method: 'GET',
    authToken: accessToken,
    query: { type: 'post', slug, take: 1 },
    traceHeaders,
  })
  if (!Array.isArray(rows)) {
    throw new Error('content-api invalid bookmarks response')
  }
  const first = rows[0]
  return first?.id ? { id: first.id } : null
}

export async function createBookmarkContentApi(
  body: V1CreateBookmarkBody,
  accessToken: string,
  traceHeaders?: TraceHeaders
): Promise<CreateBookmarkResponse> {
  return sendContentApiRequest<CreateBookmarkResponse>({
    path: '/v1/members/me/bookmarks',
    method: 'POST',
    authToken: accessToken,
    body,
    traceHeaders,
  })
}

export async function deleteBookmarkContentApi(
  id: string | number,
  accessToken: string,
  traceHeaders?: TraceHeaders
): Promise<{ id: string }> {
  if (id === '' || id == null) {
    throw new Error('deleteBookmarkContentApi: id is required')
  }
  return sendContentApiRequest<{ id: string }>({
    path: `/v1/members/me/bookmarks/${encodeURIComponent(String(id))}`,
    method: 'DELETE',
    authToken: accessToken,
    traceHeaders,
  })
}
