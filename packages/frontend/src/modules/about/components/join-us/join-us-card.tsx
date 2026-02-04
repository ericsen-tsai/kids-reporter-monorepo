'use client'

import { Button } from '@kids-reporter/routing-ui'
import Image from 'next/image'

import { useFeatureIntroDialogContext } from '@/services/feature-intro/context'

import { Card } from './constants'

type JoinUsCardProps = {
  card: Card
}

function JoinUsCard({ card }: JoinUsCardProps) {
  const { openDialog } = useFeatureIntroDialogContext()

  const handleButtonClick = () => {
    if (card.actionType === 'dialog') {
      openDialog()
    }
  }

  const getButtonContent = () => {
    if (card.actionType === 'dialog') {
      return (
        <Button variant="secondary" size={44} onClick={handleButtonClick}>
          {card.buttonText}
        </Button>
      )
    }

    if (card.actionType === 'mailto') {
      return (
        <Button variant="secondary" size={44} asChild>
          <a href={`mailto:${card.actionValue}`}>{card.buttonText}</a>
        </Button>
      )
    }

    // external link
    return (
      <Button variant="secondary" size={44} asChild>
        <a href={card.actionValue} target="_blank" rel="noopener noreferrer">
          {card.buttonText}
        </a>
      </Button>
    )
  }

  return (
    <div
      id={card.anchorId}
      className="flex h-full flex-col overflow-hidden rounded-3xl bg-neutral-white shadow-custom"
      style={card.anchorId ? { scrollMarginTop: '62px' } : undefined}
    >
      <div className="flex flex-1 flex-col gap-3 p-6 desktop:gap-4 desktop:p-8">
        <h3 className="flex items-center gap-3 prose-p1-bold text-neutral-900 desktop:prose-h6-large">
          <Image
            src={card.icon}
            alt={`${card.title} icon`}
            className="size-8 desktop:size-10"
            width={32}
            height={32}
          />
          {card.title}
        </h3>
        <p className="prose-p1 text-neutral-700">{card.description}</p>
        <div className="mt-auto pt-2">{getButtonContent()}</div>
      </div>
    </div>
  )
}

export default JoinUsCard
