import { mockPostsWithAnswers } from './mock'
import PostAnswerCard from './post-answer-card'
import PostAnswerCardSkeleton from './post-answer-card-skeleton'

function AllAnswers() {
  // TODO: Replace with actual data from API
  const posts = mockPostsWithAnswers.posts
  const isLoading = false

  return (
    <div className="mt-10 mb-14 flex w-[calc(100%+48px)] flex-col gap-8 tablet:mb-16 tablet:w-[calc(100%+64px)] desktop:mt-18 desktop:mb-24 desktop:w-[calc(100%+96px)] hd:mt-24 hd:mb-30 hd:w-screen">
      <div className="flex items-center gap-3 pl-6 tablet:pl-8 desktop:pl-12 hd:pl-[calc(50vw-600px+64px)]">
        <div className="h-8 w-1.5 rounded-md bg-blue-400" />
        <h3 className="prose-h3-small font-swei text-neutral-900 desktop:prose-h3-large">
          所有回答
        </h3>
      </div>
      <div className="flex scrollbar-thin snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 tablet:scroll-px-8 tablet:px-8 desktop:scroll-px-12 desktop:px-12 hd:scroll-pr-14 hd:scroll-pl-[calc(50vw-600px+64px)] hd:pr-14 hd:pl-[calc(50vw-600px+64px)]">
        {isLoading && (
          <>
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex-shrink-0 snap-start">
                <PostAnswerCardSkeleton />
              </div>
            ))}
          </>
        )}
        {!isLoading &&
          posts.length > 0 &&
          posts.map((post) => (
            <div key={post.id} className="flex-shrink-0 snap-start">
              <PostAnswerCard post={post} />
            </div>
          ))}
        {!isLoading && posts.length === 0 && (
          <div className="flex w-full items-center justify-center py-12 text-center">
            <p className="prose-p1 text-neutral-500">尚無回答</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllAnswers
