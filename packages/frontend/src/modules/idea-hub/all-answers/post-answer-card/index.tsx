import Image from 'next/image'
import Link from 'next/link'

import { FALLBACK_IMG } from '@/constants'
import { ArticleShortcutIconLarge } from '@/icons'

import { PostWithTwoTopLikesAnswersPerQuestionReturnType } from '../../types'
import QuestionAnswerCard from './question-answer-card'

type PostAnswerCardProps = {
  post: PostWithTwoTopLikesAnswersPerQuestionReturnType['posts'][number]
}

function PostAnswerCard({ post }: PostAnswerCardProps) {
  const heroImageUrl = post.heroImage?.resized?.medium || FALLBACK_IMG
  const firstCategory = post.subSubcategoriesOrdered?.[0]?.name || ''

  return (
    <div className="relative flex w-[300px] flex-col overflow-hidden rounded-2xl bg-neutral-100 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.12)] tablet:w-[336px] desktop:w-[400px] hd:w-[440px]">
      {/* Hero Image with Overlay */}
      <div className="absolute h-50 w-full tablet:h-60">
        <Image
          src={heroImageUrl}
          alt={post.title || '文章圖片'}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 300px, (max-width: 1024px) 336px, (max-width: 1280px) 400px, 440px"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute bottom-0 z-10 h-12 w-full tablet:h-14"
          style={{
            background:
              'linear-gradient(0deg, #F8F8F8 0%, rgba(248, 248, 248, 0.00) 100%)',
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 z-0 bg-black/30 backdrop-blur-[4px]" />
      </div>
      {/* Article Meta Overlay */}
      <div className="z-10 flex flex-col gap-3 px-5 py-4">
        <div className="flex justify-between">
          <div className="flex items-center px-1">
            <div className="rounded-[30px] bg-red-400 px-3 py-[3px]">
              <span className="prose-p2-medium text-white">
                {firstCategory}
              </span>
            </div>
          </div>

          <Link
            href={post.slug ? `/article/${post.slug}` : ''}
            className="flex size-10 items-center justify-center gap-1 rounded-full bg-neutral-white/30 text-neutral-white hover:text-red-400 active:text-red-500"
          >
            <ArticleShortcutIconLarge />
          </Link>
        </div>

        {/* Title */}
        <h3
          className="line-clamp-3 px-1 prose-p1-bold text-white"
          style={{
            textShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.6)',
          }}
        >
          {post.title ?? ''}
        </h3>
      </div>

      {/* Questions Section */}
      <div className="z-10 flex flex-col gap-4 px-4 pb-4">
        {post.postEssayQuestions.map((question) => (
          <QuestionAnswerCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  )
}

export default PostAnswerCard
