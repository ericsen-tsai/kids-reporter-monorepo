'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { cn } from '@/utils/cn'
import Button from '@/components/button'
import { BaodaozaiAction, BaodaozaiQuestions } from '../../types'
import { getModalStepsFromQuestions, ModalStep } from './utils'
import Image from 'next/image'
import { CallBaodaozaiProps, useCallBaodaozaiContext } from '../../context'

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
  }, [handleNext, handlePass, questions, onSubmit, answers, handleSubmit])

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
      handleReset
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
        <div className="p-6 flex flex-col items-start w-full mb-4 tablet:mb-0">
          <h2 className="prose-h6-large text-neutral-900 mb-3">
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
          <div className="p-6 w-full flex flex-col pb-10 tablet:pb-6">
            <div className="w-full mb-6">
              <h2 className="prose-h6-large text-neutral-900">
                {currentModalStep.title}
              </h2>
            </div>

            <div className="w-full flex flex-col gap-4 mb-6">
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
                    'w-full px-5 py-4 text-left rounded-2xl border-2 transition-all bg-white cursor-pointer',
                    answers[currentModalStep.questionIndex] === option.content
                      ? 'border-neutral-600'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100'
                  )}
                >
                  <span className={'text-neutral-900 prose-p1'}>
                    {index + 1}. {option.content}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      case 'essay':
        return (
          <div className="p-6 w-full flex flex-col h-full pb-10 tablet:pb-6">
            <div className="w-full mb-6">
              <h2 className="prose-h6-large mb-3 text-neutral-900">
                {currentModalStep.title}
              </h2>
              <p className="prose-p1 text-neutral-700">
                tips: {currentModalStep.tips}
              </p>
            </div>

            <textarea
              className={cn(
                'w-full h-72 flex-1 px-5 py-4 border-2 rounded-2xl resize-none focus:outline-none transition-all prose-p1 bg-white text-neutral-900',
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
          <div className="flex flex-col h-full bg-neutral-100">
            <div className="flex flex-col bg-neutral-white">
              <div className="w-full mb-6 px-6 pt-6">
                <h2 className="prose-h6-large text-neutral-900 text-center">
                  {answers[currentModalStep.questionIndex] ===
                  currentModalStep.correctAnswerContent
                    ? '答對了～'
                    : '再接再厲'}
                </h2>
              </div>

              <div className="w-full mb-6 flex justify-center px-6">
                <div className="w-[300px] h-[120px] flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center">
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
                <p className="prose-p1 text-neutral-700 mb-4">正確解答：</p>
                <div className="w-full p-4 bg-white border-2 border-neutral-200 rounded-2xl">
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
          <div className="flex flex-col h-full bg-neutral-100 w-full">
            <div className="flex flex-col bg-neutral-white">
              <div className="w-full mb-6 px-6 pt-6">
                <h2 className="prose-h6-large text-neutral-900 text-center">
                  已送出
                </h2>
              </div>

              <div className="w-full mb-6 flex justify-center px-6">
                <div className="w-[300px] h-[120px] flex items-center justify-center">
                  {/* Placeholder for result image - would be replaced with actual image component */}
                  <div className="w-full h-full flex items-center justify-center">
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
                <p className="prose-p1 text-neutral-700 mb-4">你的回答：</p>
                <div className="w-full p-4 bg-white border-2 border-neutral-200 rounded-2xl">
                  <span className="prose-p1-bold text-neutral-900 text-wrap break-words">
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
        <div className="w-full flex gap-4">
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
          <div className="w-full flex gap-4">
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
          <div className="absolute left-[37.5px] -z-1 -top-18 tablet:z-4 tablet:left-0 tablet:-top-12 pointer-events-none">
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
    <div className="fixed inset-0 z-1002 flex items-end tablet:items-center justify-center scrollbar-thin">
      <div className="absolute inset-0 bg-neutral-600/50 z-0" />
      <div
        className={cn(
          'relative z-1 w-full h-[calc(100vh-156px)] tablet:w-120 tablet:h-144 flex flex-col rounded-t-[30px] tablet:rounded-[30px] shadow-[0px_2px_16px_0px_rgba(0,0,0,0.15)]',
          isLeaving && 'h-auto tablet:h-auto'
        )}
      >
        <div className="px-6 py-5 tablet:px-6 tablet:py-5 border-b-2 border-neutral-200 relative flex flex-col items-center bg-neutral-white rounded-t-[30px] tablet:rounded-t-[30px]">
          <span className="prose-h6-large text-neutral-900">
            {renderModalTitle}
          </span>
          {!isLeaving && (
            <button
              onClick={handleShowLeaving}
              className="w-8 h-8 flex items-center justify-center transition-colors text-neutral-600 hover:text-neutral-800 cursor-pointer absolute right-6 top-5"
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
            'flex-1 flex flex-col bg-neutral-white tablet:rounded-b-[30px] overflow-hidden'
          }
        >
          <div className="flex flex-col items-center overflow-y-auto flex-1">
            {renderModalContent}
          </div>
          <div
            className={cn(
              'w-full px-6 pb-6 flex flex-col justify-end',
              (isLeaving ||
                currentModalStep?.type === 'choice-result' ||
                currentModalStep?.type === 'essay-result') &&
                'bg-neutral-100'
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
