'use client'
import 'react-loading-skeleton/dist/skeleton.css'

import { ArticleBodyDraftRenderer } from '@kids-reporter/draft-renderer'
import { cn } from '@kids-reporter/routing-ui'
import { RawDraftContentState } from 'draft-js'

import { FontSizeLevel, STICKY_HEADER_HEIGHT } from '@/constants'

import {
  ARTICLE_FONT_SIZE_CLASSNAMES,
  ARTICLE_FONT_SIZE_CLASSNAMES_LARGE,
} from '../constants'
import { useArticleContext } from '../context'

function trimFinalEmptyBlocks(raw: RawDraftContentState): RawDraftContentState {
  const { blocks, entityMap } = raw
  if (blocks.length === 0) return raw

  let end = blocks.length
  while (
    end > 0 &&
    blocks[end - 1].type === 'unstyled' &&
    blocks[end - 1].text.trim() === ''
  ) {
    end--
  }
  if (end === blocks.length) return raw

  return { blocks: blocks.slice(0, end), entityMap }
}

type PostProp = {
  content: RawDraftContentState
}

function PostRenderer({ content }: PostProp) {
  const { onImageModalOpen, fontSize } = useArticleContext()
  return (
    <div
      className={cn(
        'prose-article text-neutral-900',
        ...ARTICLE_FONT_SIZE_CLASSNAMES,
        fontSize === FontSizeLevel.LARGE && [
          ...ARTICLE_FONT_SIZE_CLASSNAMES_LARGE,
        ]
      )}
    >
      <ArticleBodyDraftRenderer
        rawContentState={trimFinalEmptyBlocks(content)}
        onImageModalOpen={onImageModalOpen}
        initiallyScrollTo={
          typeof window !== 'undefined' ? window.location.hash : undefined
        }
        offsetTop={STICKY_HEADER_HEIGHT}
      />
    </div>
  )
}

export default PostRenderer
