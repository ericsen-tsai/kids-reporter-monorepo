'use client'
import './article.css'
import './article.css'

import { GetPostQuery } from '__generated__/operations/post.generated'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import AuthorCard, { Author } from '@/components/author-card'
import Divider from '@/components/divider'
import Tags from '@/components/tags'
import {
  AUTHOR_ROLES_IN_ORDER,
  AuthorRole,
  DEFAULT_AVATAR,
  DEFAULT_THEME_COLOR,
  FontSizeLevel,
} from '@/constants'
import {
  BaodaozaiActionSetter,
  BaodaozaiChoiceQuestion,
  BaodaozaiEventTrigger,
  BaodaozaiQAModal,
  BaodaozaiQuestions,
} from '@/services/call-baodaozai'
import { QAModalEvent } from '@/services/call-baodaozai/components/qa-modal'
import { getPostSummaries } from '@/utils'

import { ArticleContext } from './article-context'
import Brief, { AuthorGroup } from './brief'
import CallToAction from './call-to-action'
import HeroImage from './hero-image'
import ImageModal from './image-modal'
import { IS_LOGIN } from './mock'
import { NewsReading } from './news-reading'
import PostRenderer from './post-renderer'
import PublishedDate from './published-date'
import RelatedPosts from './related-posts'
import { MobileSidebar, Sidebar } from './sidebar'
import StartReadingBaodaozaiEventTrigger from './start-reading-baodaozai-event-trigger'
import SubSubcategory from './subSubcategory'
import Title from './title'

const getPostContents = (post: any) => {
  // Assemble authors for brief
  const authorsJSON = post?.authorsJSON
  const authorsInBrief: AuthorGroup[] = []
  let currentAuthorRole = '',
    currentAuthors: { name: string; link: string }[] = []
  authorsJSON?.forEach((authorJSON: any, index: number) => {
    const author = post?.authors?.find((a: any) => a?.id === authorJSON?.id)
    const authorObj = author
      ? {
          name: author.name,
          link: `/author/${author.slug}`,
        }
      : {
          name: authorJSON.name,
          link: '',
        }
    if (index === 0 || authorJSON.role === authorsJSON[index - 1]?.role) {
      currentAuthorRole = authorJSON.role
      currentAuthors.push(authorObj)
    } else {
      authorsInBrief.push({ title: currentAuthorRole, authors: currentAuthors })
      currentAuthorRole = authorJSON.role
      currentAuthors = [authorObj]
    }

    if (index === authorsJSON?.length - 1) {
      authorsInBrief.push({ title: currentAuthorRole, authors: currentAuthors })
    }
  })

  // Assemble ordered authors for AuthorCard
  type AuthorWithLink = Author & { link: string }
  const authors: AuthorWithLink[] = post?.authors?.map((author: any) => {
    const authorJSON = authorsJSON.find(
      (authorJSON: any) => authorJSON.id === author?.id
    )
    const avatarURL = author?.avatar?.resized?.tiny
    return author && authorJSON
      ? {
          slug: author.slug,
          name: author.name,
          avatar: avatarURL ?? DEFAULT_AVATAR,
          bio: author.bio,
          role: authorJSON.role,
          link:
            authorJSON.type === 'link' ? `/author/${author.slug}` : undefined,
        }
      : undefined
  })

  // Sort authors by AUTHOR_ROLES_IN_ORDER
  const orderedAuthors = authors
    ?.filter((author: AuthorWithLink) => author?.link)
    ?.map((author: AuthorWithLink) => {
      const roles = author?.role?.split('、')
      const priority = AUTHOR_ROLES_IN_ORDER.indexOf(roles?.[0] as AuthorRole)
      return {
        ...author,
        priority: priority === -1 ? AUTHOR_ROLES_IN_ORDER.length : priority,
      }
    })
    ?.sort((a, b) => {
      return a.priority - b.priority
    })

  // Topic related data
  const topic = post?.projects?.[0]

  // Related posts data: related posts or topic's related post
  let relatedPosts: any[] = []
  if (post?.relatedPostsOrdered?.length > 0) {
    relatedPosts = getPostSummaries(post.relatedPostsOrdered)
  } else if (topic?.relatedPosts?.length > 0) {
    relatedPosts = getPostSummaries(topic.relatedPosts)
  }

  // Main project data
  // TODO: project/main project are duplicate data, should be refactored
  const mainTopic = post?.mainProject
  const topicURL = mainTopic?.slug ? `/topic/${mainTopic.slug}` : undefined

  // Subcategory related data
  const subSubcategory = post?.subSubcategoriesOrdered?.[0]
  const subcategory = subSubcategory?.subcategory
  const category = subcategory?.category
  const subSubcategoryURL =
    category?.slug && subcategory?.slug && subSubcategory?.slug
      ? `/category/${category.slug}/${subcategory.slug}/${subSubcategory.slug}`
      : ''
  const theme = category?.themeColor || DEFAULT_THEME_COLOR

  return {
    theme,
    topicURL,
    mainTopic,
    subSubcategory,
    subSubcategoryURL,
    authorsInBrief,
    orderedAuthors,
    relatedPosts,
  }
}

const Article = ({ post }: { post: NonNullable<GetPostQuery['post']> }) => {
  const {
    theme,
    topicURL,
    mainTopic,
    subSubcategory,
    subSubcategoryURL,
    authorsInBrief,
    orderedAuthors,
    relatedPosts,
  } = getPostContents(post)

  const [fontSize, setFontSize] = useState<FontSizeLevel>(FontSizeLevel.NORMAL)
  const onFontSizeChange = () => {
    setFontSize(
      fontSize === FontSizeLevel.NORMAL
        ? FontSizeLevel.LARGE
        : FontSizeLevel.NORMAL
    )
  }

  const [isImgModalOpen, setIsImgModalOpen] = useState(false)
  const [imgProps, setImgProps] = useState<
    React.ImgHTMLAttributes<HTMLImageElement>
  >({})
  const handleImgModalOpen = (
    imgProps: React.ImgHTMLAttributes<HTMLImageElement>
  ) => {
    setIsImgModalOpen(true)
    setImgProps(imgProps)
    document.body.classList.add('no-scroll')
  }
  const handleImgModalClose = () => {
    setIsImgModalOpen(false)
    setImgProps({})
    document.body.classList.remove('no-scroll')
  }

  const topicBreadCrumb = topicURL && (
    <div className="topic-breadcrumb">
      <Link className="text-sm md:text-base lg:text-lg" href={topicURL}>
        <img src="/assets/images/topic-breadcrumb-icon.svg" loading="lazy" />
        {mainTopic?.title}
      </Link>
    </div>
  )

  const postHeader = post && (
    <div className="hero-section">
      <header className="entry-header">
        <Title
          text={post.title ?? ''}
          subtitle={post.subtitle ?? ''}
          fontSize={fontSize}
        />
        <div className="post-date-category">
          <PublishedDate date={post.publishedDate ?? ''} />
          <SubSubcategory
            text={subSubcategory?.name}
            link={subSubcategoryURL}
          />
        </div>
      </header>
    </div>
  )

  const [isQAModalOpen, setIsQAModalOpen] = useState(false)

  const handleBaodaozaiConfirmation = useCallback(
    ({
      setHide,
      setIsActive,
      setAction,
    }: Parameters<BaodaozaiActionSetter>[0]) => {
      setIsQAModalOpen(true)
      setHide(true)
      setIsActive(false)
      setAction('none')
    },
    []
  )

  const router = useRouter()

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleQAModalSubmit = useCallback(
    (answers: Record<number, string>, events: QAModalEvent) => {
      // TODO: send answers to backend
      setIsQAModalOpen(false)
      events.setHide(false)
      events.setIsActive(true)
      events.setAction('speak')
      events.onDialogPropsChange({
        isOpen: true,
        content: IS_LOGIN
          ? `想知道其他讀者的答案嗎？
      大家送出的思辨題答案都會顯示在這裡喔～`
          : '登入帳號完成閱讀設定，還可以挑戰更多隱藏版的思辨題唷！',
        cancelText: '跳過',
        confirmText: IS_LOGIN ? '完成閱讀設定' : '立即登入',
        confirmAction: () => {
          router.push(IS_LOGIN ? '/idea-hub' : '/login')
        },
      })
      setIsSubmitted(true)
    },
    [router]
  )

  const handleQAModalClose = useCallback(({ setHide }: QAModalEvent) => {
    setIsQAModalOpen(false)
    setHide(false)
  }, [])

  const newsReadingGroupItems = useMemo(() => {
    if (!post?.newsReadingGroup?.items) return []
    return post?.newsReadingGroup.items.map((item) => ({
      name: item.name ?? '',
      embedCode: item.embedCode ?? '',
    }))
  }, [post?.newsReadingGroup?.items])

  const tags = useMemo(() => {
    if (!post?.tagsOrdered) return []
    return post.tagsOrdered.map((tag) => ({
      name: tag.name ?? '',
      slug: tag.slug ?? '',
    }))
  }, [post.tagsOrdered])

  const postQuestions = useMemo<BaodaozaiQuestions | null>(() => {
    // TODO: choose which questions to show
    const choiceQuestions = post.postChoiceQuestions ?? []
    // const essayQuestions = post.postEssayQuestions

    const candidateQuestions = [...choiceQuestions]

    if (candidateQuestions.length < 3) {
      console.error('No enough questions')
      return null
    }

    const questions = candidateQuestions.map<BaodaozaiChoiceQuestion>(
      (question) => ({
        id: question.id,
        title: question.title ?? '',
        options: question.options as BaodaozaiChoiceQuestion['options'],
        reason: question.reason ?? '',
        type: 'choice',
      })
    )

    return [questions[0], questions[1], questions[2]]
  }, [post.postChoiceQuestions])

  return (
    <>
      <div className={`post${theme ? ` theme-${theme}` : ''}`}>
        <ArticleContext.Provider
          value={{
            fontSize,
            onFontSizeChange,
            handleImgModalOpen,
            handleImgModalClose,
          }}
        >
          <Sidebar topicURL={topicURL} />
          <MobileSidebar topicURL={topicURL} />
          {topicBreadCrumb}
          <ImageModal
            isOpen={isImgModalOpen}
            imgProps={imgProps}
            handleImgModalClose={handleImgModalClose}
          />
          <StartReadingBaodaozaiEventTrigger
            isSubmitted={isSubmitted}
            content={post?.opening ?? ''}
          />
          {post?.heroImage && post?.heroCaption && (
            <HeroImage
              image={post?.heroImage}
              caption={post?.heroCaption ?? ''}
              handleImgModalOpen={handleImgModalOpen}
            />
          )}
          {postHeader}
          {post?.newsReadingGroup && (
            <NewsReading items={newsReadingGroupItems} />
          )}

          <BaodaozaiEventTrigger
            id="hide-start-reading"
            dialogState={{
              isOpen: false,
              hideCancelButton: true,
            }}
            baodaozaiState={{
              isActive: false,
              action: 'none',
            }}
            disabled={isSubmitted}
          />
          <Brief content={post?.brief} authors={authorsInBrief} theme={theme} />
          <Divider />
          <div className="relative">
            <PostRenderer post={post} theme={theme} />
            <div className="absolute top-[calc(50%+50vh)]">
              <BaodaozaiEventTrigger
                dialogState={{
                  isOpen: false,
                  content:
                    '你好棒！已經把文章讀完了！接下來讓我問問你幾個和文章有關的問題⋯⋯',
                  hideCancelButton: false,
                  confirmText: '好！出招吧',
                  confirmAction: handleBaodaozaiConfirmation,
                }}
                baodaozaiState={{
                  isActive: false,
                  action: 'none',
                }}
                disabled={isSubmitted}
                id="change-to-ask-questions"
              />
            </div>
          </div>

          {post?.tagsOrdered && <Tags title={'常用關鍵字'} tags={tags} />}
          <BaodaozaiEventTrigger
            dialogState={{
              isOpen: true,
            }}
            baodaozaiState={{
              isActive: true,
              action: 'speak',
            }}
            disabled={isSubmitted}
            id="show-ask-questions"
          />
          <AuthorCard title="誰幫我們完成這篇文章" authors={orderedAuthors} />
        </ArticleContext.Provider>
      </div>
      <CallToAction />
      <RelatedPosts posts={relatedPosts ?? []} sliderTheme={theme} />
      {postQuestions && (
        <BaodaozaiQAModal
          questions={postQuestions}
          onClose={handleQAModalClose}
          onSubmit={handleQAModalSubmit}
          isOpen={isQAModalOpen}
        />
      )}
    </>
  )
}

export default Article
