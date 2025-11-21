import { MemberUpdateInput } from '__generated__/types'
import errors from '@twreporter/errors'
import { useCallback, useEffect, useRef } from 'react'

import { useUpdateMemberProfileMutation } from '@/api-utils/react-query/hooks/member'
import { BAODAOZAI_DEFAULT_ESSAY_QUESTION_COUNT } from '@/constants/baodaozai-question-count'
import useDebounceValue from '@/hooks/use-debounce-value'
import { MemberProfile } from '@/services/auth/auth-store'
import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'
import { log, LogLevel } from '@/utils'

function useOptimisticUpdateMemberReadingSettings() {
  const {
    member,
    tokens,
    setAuth,
    hydrated: isFetchedMember,
    fetchMember,
  } = useHydratedAuthStore()

  const isInitialMountRef = useRef(true)
  const previousHydratedValuesRef = useRef<{
    showBaodaozai: boolean | undefined
    essayQuestionCount: number | undefined
  } | null>(null)

  const debouncedShowBaodaozai = useDebounceValue<boolean | undefined>(
    member?.showBaodaozai,
    1000
  )

  const debouncedEssayQuestionCount = useDebounceValue<number | undefined>(
    member?.essayQuestionCount ?? BAODAOZAI_DEFAULT_ESSAY_QUESTION_COUNT,
    1000
  )

  const updateMemberProfileDataRef = useRef<MemberProfile | null>(null)

  const { mutateAsync: updateMemberProfile, ...rest } =
    useUpdateMemberProfileMutation({
      accessToken: tokens?.accessToken ?? '',
      memberId: member?.id ?? '',
      options: {
        onSuccess: (memberData) => {
          if (memberData) {
            previousHydratedValuesRef.current = {
              showBaodaozai: memberData.showBaodaozai,
              essayQuestionCount: memberData.essayQuestionCount,
            }
          }
        },
      },
    })

  const optimisticUpdateMemberReadingSettings = useCallback(
    async (
      data: Pick<MemberUpdateInput, 'showBaodaozai' | 'essayQuestionCount'>
    ) => {
      const memberId = member?.id
      if (!memberId) {
        return
      }
      updateMemberProfileDataRef.current = { ...member }

      setAuth({
        member: {
          ...member,
          id: memberId,
          ...(data.showBaodaozai !== undefined
            ? { showBaodaozai: data.showBaodaozai }
            : {}),
          ...(data.essayQuestionCount !== undefined
            ? { essayQuestionCount: data.essayQuestionCount }
            : {}),
        },
      })
    },
    [member, setAuth]
  )

  const handleUpdateMemberReadingSettings = useCallback(
    async (
      data: Pick<MemberUpdateInput, 'showBaodaozai' | 'essayQuestionCount'>
    ) => {
      try {
        await updateMemberProfile({ data })
        await fetchMember()
      } catch (_error) {
        if (updateMemberProfileDataRef.current) {
          setAuth({
            member: updateMemberProfileDataRef.current,
          })
        }
        const err = errors.helpers.wrap(
          _error,
          'HandleUpdateMemberReadingSettingsError',
          'Error to handle update member reading settings'
        )

        const msg = errors.helpers.printAll(err, {
          withStack: true,
          withPayload: true,
        })
        log(LogLevel.ERROR, msg)
      }
    },
    [fetchMember, updateMemberProfile, setAuth]
  )

  // Store initial values after hydration and update after successful mutations
  useEffect(() => {
    if (!isFetchedMember) {
      return
    }

    // Store initial values on first hydration
    if (previousHydratedValuesRef.current === null) {
      previousHydratedValuesRef.current = {
        showBaodaozai: member?.showBaodaozai,
        essayQuestionCount: member?.essayQuestionCount,
      }
    }
  }, [isFetchedMember, member])

  useEffect(() => {
    if (!isFetchedMember) {
      return
    }

    // Skip on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      return
    }

    // Skip if initial hydrated values haven't been set yet
    if (previousHydratedValuesRef.current === null) {
      return
    }

    // Skip if debounced values match initial hydrated values (no actual change)
    const initialValues = previousHydratedValuesRef.current
    const hasShowBaodaozaiChanged =
      debouncedShowBaodaozai !== initialValues.showBaodaozai
    const hasEssayQuestionCountChanged =
      debouncedEssayQuestionCount !== initialValues.essayQuestionCount

    if (!hasShowBaodaozaiChanged && !hasEssayQuestionCountChanged) {
      return
    }

    handleUpdateMemberReadingSettings({
      showBaodaozai: debouncedShowBaodaozai,
      essayQuestionCount: debouncedEssayQuestionCount,
    })
  }, [
    debouncedShowBaodaozai,
    debouncedEssayQuestionCount,
    handleUpdateMemberReadingSettings,
    isFetchedMember,
  ])

  return {
    optimisticUpdateMemberReadingSettings,
    ...rest,
  }
}

export default useOptimisticUpdateMemberReadingSettings
