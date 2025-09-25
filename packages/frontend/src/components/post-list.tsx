import './post-list.module.css'

import PostCard from '@/components/post-card'
import { PostSummary } from '@/components/types'

export const PostList = ({ posts }: { posts: PostSummary[] }) => {
  return (
    <>
      {posts?.length > 0 ? (
        <div className="grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            return (
              post && <PostCard key={`author-post-card-${index}`} post={post} />
            )
          })}
        </div>
      ) : (
        <h1>沒有文章</h1>
      )}
    </>
  )
}

export default PostList
