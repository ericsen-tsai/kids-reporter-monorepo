'use client'

import { Button, cn } from '@kids-reporter/routing-ui'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { CallBaodaozaiProps, useCallBaodaozaiContext } from '../../context'
import { BaodaozaiAction, BaodaozaiQuestions } from '../../types'
import { getModalStepsFromQuestions, ModalStep } from './utils'

export type QAModalEvent = {
  setHide: (hide: boolean) => void
  setIsActive: (isActive: boolean) => void
  setAction: (action: BaodaozaiAction) => void
  onDialogPropsChange: (
    dialogProps: Partial<CallBaodaozaiProps['dialogWithActionProps']>
  ) => void
}

type QAModalProps = {
  questions: BaodaozaiQuestions
  onClose: ({
    setHide,
    setIsActive,
    setAction,
    onDialogPropsChange,
  }: QAModalEvent) => void
  onSubmit: (answers: Record<number, string>, events: QAModalEvent) => void
  isOpen: boolean
}

function QAModal({ questions, onClose, onSubmit, isOpen }: QAModalProps) {
  const [currentModalStepIndex, setCurrentModalStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isLeaving, setIsLeaving] = useState(false)

  const {
    baodaozaiProps: { setHide, setIsActive, setAction },
    onDialogPropsChange,
  } = useCallBaodaozaiContext()

  const handleNext = useCallback(() => {
    setCurrentModalStepIndex(currentModalStepIndex + 1)
  }, [currentModalStepIndex])

  const handlePass = useCallback(() => {
    setCurrentModalStepIndex(currentModalStepIndex + 2)
  }, [currentModalStepIndex])

  const handleShowLeaving = useCallback(() => {
    setIsLeaving(true)
  }, [])

  const handleCancelLeaving = useCallback(() => {
    setIsLeaving(false)
  }, [])

  const events = useMemo(
    () => ({ setHide, setIsActive, setAction, onDialogPropsChange }),
    [setHide, setIsActive, setAction, onDialogPropsChange]
  )

  const handleConfirmLeaving = useCallback(() => {
    setIsLeaving(false)
    onClose(events)
  }, [onClose, events])

  const handleSubmit = useCallback(() => {
    onSubmit(answers, events)
  }, [onSubmit, answers, events])

  const modalSteps = useMemo(() => {
    return getModalStepsFromQuestions({
      questions,
      onNext: handleNext,
      onPass: handlePass,
      onSubmit: handleSubmit,
    })
  }, [handleNext, handlePass, questions, handleSubmit])

  const handleAnswerChange = useCallback(
    (questionIndex: number, answer: string) => {
      setAnswers((prev) => ({ ...prev, [questionIndex]: answer }))
    },
    []
  )

  const handleReset = useCallback(() => {
    setAnswers({})
    setCurrentModalStepIndex(0)
    setIsLeaving(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll')
    } else {
      handleReset()
      document.body.classList.remove('no-scroll')
    }
    return () => {
      handleReset()
      document.body.classList.remove('no-scroll')
    }
  }, [isOpen, handleReset])

  const currentModalStep = useMemo<ModalStep | null>(() => {
    return modalSteps[currentModalStepIndex] ?? null
  }, [currentModalStepIndex, modalSteps])

  const isLastQuestion = useMemo(() => {
    if (!currentModalStep) return false
    return currentModalStep.questionIndex === questions.length - 1
  }, [currentModalStep, questions.length])

  const currentAnswer = useMemo(() => {
    if (!currentModalStep) return null
    return answers[currentModalStep?.questionIndex ?? 0]
  }, [answers, currentModalStep])

  const renderModalTitle = useMemo(() => {
    if (isLeaving) {
      return '再想一下'
    }
    if (!currentModalStep) return null
    if (
      currentModalStep?.type === 'choice-result' ||
      currentModalStep?.type === 'essay-result'
    ) {
      return '作答結果'
    }
    return `${currentModalStep?.questionIndex + 1}/${questions.length}`
  }, [currentModalStep, questions.length, isLeaving])

  const renderModalContent = useMemo(() => {
    if (isLeaving) {
      return (
        <div className="mb-5 flex w-full flex-col items-start p-6 tablet:mb-0">
          <h2 className="prose-h6-large mb-3 text-neutral-900">
            確定要放棄作答嗎？
          </h2>
          <p className="prose-p1 text-neutral-700">
            你可以隨時呼叫報導仔，重新挑戰！
          </p>
        </div>
      )
    }
    if (!currentModalStep) return null

    switch (currentModalStep?.type) {
      case 'choice':
        return (
          <div className="flex w-full flex-col p-6 pb-10 tablet:pb-6">
            <div className="mb-6 w-full">
              <h2 className="prose-h6-large text-neutral-900">
                {currentModalStep.title}
              </h2>
            </div>

            <div className="mb-6 flex w-full flex-col gap-4">
              {currentModalStep.options.map((option, index) => (
                <button
                  key={option.content}
                  onClick={() =>
                    handleAnswerChange(
                      currentModalStep.questionIndex,
                      option.content
                    )
                  }
                  className={cn(
                    'w-full cursor-pointer rounded-2xl border-2 bg-white px-5 py-4 text-left transition-all',
                    answers[currentModalStep.questionIndex] === option.content
                      ? 'border-neutral-600'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100'
                  )}
                >
                  <span className={'prose-p1 text-neutral-900'}>
                    {index + 1}. {option.content}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      case 'essay':
        return (
          <div className="flex h-full w-full flex-col p-6 pb-10 tablet:pb-6">
            <div className="mb-6 w-full">
              <h2 className="prose-h6-large mb-3 text-neutral-900">
                {currentModalStep.title}
              </h2>
              <p className="prose-p1 text-neutral-700">
                tips: {currentModalStep.tips}
              </p>
            </div>

            <textarea
              className={cn(
                'prose-p1 h-72 w-full flex-1 resize-none rounded-2xl border-2 bg-white px-5 py-4 text-neutral-900 transition-all focus:outline-none',
                (answers[currentModalStep.questionIndex] || '').trim()
                  ? 'border-neutral-600'
                  : 'border-neutral-200 hover:border-neutral-600 focus:border-neutral-600'
              )}
              placeholder="請輸入答案"
              value={answers[currentModalStep.questionIndex] || ''}
              onChange={(e) =>
                handleAnswerChange(
                  currentModalStep.questionIndex,
                  e.target.value
                )
              }
            />
          </div>
        )
      case 'choice-result':
        return (
          <div className="flex h-full flex-col bg-neutral-100">
            <div className="flex flex-col bg-neutral-white">
              <div className="mb-6 w-full px-6 pt-6">
                <h2 className="prose-h6-large text-center text-neutral-900">
                  {answers[currentModalStep.questionIndex] ===
                  currentModalStep.correctAnswerContent
                    ? '答對了～'
                    : '再接再厲'}
                </h2>
              </div>

              <div className="mb-6 flex w-full justify-center px-6">
                <div className="flex h-[120px] w-[300px] items-center justify-center">
                  <div className="flex h-full w-full items-center justify-center">
                    {answers[currentModalStep.questionIndex] ===
                    currentModalStep.correctAnswerContent ? (
                      <Image
                        src="/assets/images/baodaozai/correct_answer.svg"
                        alt="Correct Answer"
                        width={300}
                        height={120}
                      />
                    ) : (
                      <Image
                        src="/assets/images/baodaozai/incorrect_answer.svg"
                        alt="Incorrect Answer"
                        width={300}
                        height={120}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Section */}
            <div className="w-full bg-neutral-100 p-6 pb-10 tablet:pb-6">
              <div className="mb-4">
                <p className="prose-p1 mb-4 text-neutral-700">正確解答：</p>
                <div className="w-full rounded-2xl border-2 border-neutral-200 bg-white p-4">
                  <span className="prose-p1-bold text-neutral-900">
                    {currentModalStep.correctAnswerIndex + 1}.{' '}
                    {currentModalStep.correctAnswerContent}
                  </span>
                </div>
              </div>
              <p className="prose-p1 text-neutral-700">
                {currentModalStep.reason}
              </p>
            </div>
          </div>
        )
      case 'essay-result':
        return (
          <div className="flex h-full w-full flex-col bg-neutral-100">
            <div className="flex flex-col bg-neutral-white">
              <div className="mb-6 w-full px-6 pt-6">
                <h2 className="prose-h6-large text-center text-neutral-900">
                  已送出
                </h2>
              </div>

              <div className="mb-6 flex w-full justify-center px-6">
                <div className="flex h-[120px] w-[300px] items-center justify-center">
                  {/* Placeholder for result image - would be replaced with actual image component */}
                  <div className="flex h-full w-full items-center justify-center">
                    <Image
                      src="/assets/images/baodaozai/send.svg"
                      alt="Correct Answer"
                      width={300}
                      height={120}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-neutral-100 p-6 pb-10 tablet:pb-6">
              <div className="mb-4">
                <p className="prose-p1 mb-4 text-neutral-700">你的回答：</p>
                <div className="w-full rounded-2xl border-2 border-neutral-200 bg-white p-4">
                  <span className="prose-p1-bold text-wrap break-words text-neutral-900">
                    {currentAnswer}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }, [answers, currentAnswer, currentModalStep, handleAnswerChange, isLeaving])

  const renderModalButtons = useMemo(() => {
    if (isLeaving) {
      return (
        <div className="flex w-full gap-4">
          <Button
            onClick={handleCancelLeaving}
            variant="secondary"
            size={36}
            className="flex-1"
          >
            返回
          </Button>
          <Button
            onClick={handleConfirmLeaving}
            variant="primary"
            size={36}
            className="flex-1"
          >
            確定
          </Button>
        </div>
      )
    }
    if (!currentModalStep) return null
    switch (currentModalStep.type) {
      case 'choice':
        return (
          <Button
            onClick={currentModalStep.onNext}
            disabled={!currentAnswer}
            variant="primary"
            size={36}
            className="w-full"
          >
            確定
          </Button>
        )
      case 'essay':
        return (
          <div className="flex w-full gap-4">
            <Button
              onClick={currentModalStep.onPass}
              variant="secondary"
              size={36}
              className="flex-1"
            >
              跳過
            </Button>
            <Button
              onClick={currentModalStep.onNext}
              disabled={!(currentAnswer || '').trim()}
              variant="primary"
              size={36}
              className="flex-1"
            >
              送出答案
            </Button>
          </div>
        )
      case 'choice-result':
        return (
          <Button
            onClick={currentModalStep.onNext}
            variant="primary"
            size={36}
            className="w-full"
          >
            {isLastQuestion ? '完成作答' : '下一題'}
          </Button>
        )
      case 'essay-result':
        return (
          <Button
            onClick={currentModalStep.onNext}
            variant="primary"
            size={36}
            className="w-full"
          >
            {isLastQuestion ? '完成作答' : '下一題'}
          </Button>
        )
      default:
        return null
    }
  }, [
    currentModalStep,
    isLastQuestion,
    currentAnswer,
    isLeaving,
    handleCancelLeaving,
    handleConfirmLeaving,
  ])

  const renderBaodaozai = useMemo(() => {
    if (isLeaving) return null
    if (!currentModalStep) return null
    switch (currentModalStep.type) {
      case 'choice':
      case 'essay':
        return (
          <div className="pointer-events-none absolute -top-18 left-[37.5px] -z-1 tablet:-top-12 tablet:left-0 tablet:z-4">
            <Image
              src="/assets/images/baodaozai/answering_mobile.svg"
              alt="Baodaozai"
              width={300}
              height={120}
              className="tablet:hidden"
            />
            <Image
              src="/assets/images/baodaozai/answering.svg"
              alt="Baodaozai"
              width={200}
              height={120}
              className="hidden tablet:block"
            />
          </div>
        )
      case 'choice-result':
      case 'essay-result':
        return null
      default:
        return null
    }
  }, [currentModalStep, isLeaving])

  if (!isOpen) return null

  return (
    <div className="scrollbar-thin fixed inset-0 z-1002 flex items-end justify-center tablet:items-center">
      <div className="absolute inset-0 z-0 bg-neutral-black/20" />
      <div
        className={cn(
          'relative z-1 flex h-[calc(100vh-80px)] w-full flex-col rounded-t-[30px] shadow-[0px_2px_16px_0px_rgba(0,0,0,0.15)] tablet:h-144 tablet:w-120 tablet:rounded-[30px]',
          isLeaving && 'h-auto tablet:h-auto'
        )}
      >
        <div className="relative flex flex-col items-center rounded-t-[30px] border-b-2 border-neutral-200 bg-neutral-white px-6 py-5 tablet:rounded-t-[30px] tablet:px-6 tablet:py-5">
          <span className="prose-h6-large text-neutral-900">
            {renderModalTitle}
          </span>
          {!isLeaving && (
            <button
              onClick={handleShowLeaving}
              className="absolute top-5 right-6 flex h-8 w-8 cursor-pointer items-center justify-center text-neutral-600 transition-colors hover:text-neutral-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M6.80748 6.80748C7.4909 6.12407 8.59894 6.12407 9.28236 6.80748L15.9999 13.525L22.7174 6.80748C23.4008 6.12407 24.5088 6.12407 25.1923 6.80748C25.8757 7.4909 25.8757 8.59894 25.1923 9.28236L18.4747 15.9999L25.1923 22.7174C25.8757 23.4008 25.8757 24.5088 25.1923 25.1923C24.5088 25.8757 23.4008 25.8757 22.7174 25.1923L15.9999 18.4747L9.28236 25.1923C8.59894 25.8757 7.4909 25.8757 6.80748 25.1923C6.12407 24.5088 6.12407 23.4008 6.80748 22.7174L13.525 15.9999L6.80748 9.28236C6.12407 8.59894 6.12407 7.4909 6.80748 6.80748Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
          {renderBaodaozai}
        </div>

        <div
          className={
            'flex flex-1 flex-col overflow-hidden bg-neutral-white tablet:rounded-b-[30px]'
          }
        >
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            {renderModalContent}
          </div>
          <div
            className={cn(
              'flex w-full flex-col justify-end px-6 pt-5 pb-6 tablet:pt-6',
              (currentModalStep?.type === 'choice-result' ||
                currentModalStep?.type === 'essay-result') &&
                'bg-neutral-100',
              isLeaving && 'pt-0 tablet:pt-0'
            )}
          >
            {renderModalButtons}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QAModal
