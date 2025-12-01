import { mockPostsWithAnswers } from './mock'
import PostAnswerCard from './post-answer-card'
import PostAnswerCardSkeleton from './post-answer-card-skeleton'

function AllAnswers() {
  // TODO: Replace with actual data from API
  const posts = mockPostsWithAnswers.posts
  const isLoading = false

  return (
    <div className="mt-10 mb-14 flex w-[calc(100%+48px)] flex-col gap-8 tablet:mb-16 tablet:w-[calc(100%+64px)] desktop:mt-18 desktop:mb-24 desktop:w-[calc(100%+96px)] hd:mt-24 hd:mb-30 hd:w-[calc(100%+112px)]">
      <div className="flex items-center gap-3 pl-6 tablet:pl-8 desktop:pl-12 hd:pl-14">
        <div className="h-8 w-1.5 rounded-md bg-blue-400" />
        <h3 className="prose-h3-small font-swei text-neutral-900 desktop:prose-h3-large">
          所有回答
        </h3>
      </div>
      <div className="flex scrollbar-thin snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 tablet:scroll-px-8 tablet:px-8 desktop:scroll-px-12 desktop:px-12 hd:scroll-px-14 hd:px-14">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex-shrink-0 snap-start">
                <PostAnswerCardSkeleton />
              </div>
            ))}
          </>
        ) : (
          <>
            {posts.map((post) => (
              <div key={post.id} className="flex-shrink-0 snap-start">
                <PostAnswerCard post={post} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default AllAnswers
