'use client'

import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceEnum,
} from '@rive-app/react-webgl2'
import { useEffect } from 'react'

const ROOT_VIEW_MODEL_NAME = 'VM_EnlightenSelector'

type QABaodaozaiValue =
  | 'default'
  | 'enlighten-send'
  | 'enlighten-fault'
  | 'enlighten-correct'
  | 'enlighten-ask'

type EnlightenBaodaozaiProps = {
  state: QABaodaozaiValue
}

function EnlightenBaodaozai({ state }: EnlightenBaodaozaiProps) {
  const { RiveComponent, rive } = useRive({
    src: '/baodaozai-db-enlighten.riv',
    stateMachines: 'State Machine',
    autoplay: true,
    artboard: 'Master-Enlighten',
  })

  const rootViewModel = useViewModel(rive, { name: ROOT_VIEW_MODEL_NAME })
  const rootInstance = useViewModelInstance(rootViewModel, {
    rive,
  })

  const { setValue: setEnlighten } = useViewModelInstanceEnum(
    'Enum_Enlighten',
    rootInstance
  )

  const { setValue: setEnlightenSendEnterState } = useViewModelInstanceEnum(
    'vmi_enlighten-send/Enum_EnterState',
    rootInstance
  )

  useEffect(() => {
    async function setState() {
      setEnlighten(state)
      if (state === 'enlighten-send') {
        setEnlightenSendEnterState('enter')
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setEnlightenSendEnterState('exit')
      }
    }
    setState()
  }, [state, setEnlighten, setEnlightenSendEnterState])

  return (
    <div className="h-[120px] w-[300px]">
      <RiveComponent />
    </div>
  )
}

export default EnlightenBaodaozai
