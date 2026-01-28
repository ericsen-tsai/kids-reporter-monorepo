import { notFound, permanentRedirect } from 'next/navigation'

import { getPostMeta } from '@/api/post'

async function PostPage({ params }: { params: { postSlug: string } }) {
  const { postSlug } = params
  const post = await getPostMeta({
    where: { slug: postSlug },
  })

  if (!post) {
    notFound()
  }

  permanentRedirect(`/article/${postSlug}`)
}

export default PostPage
