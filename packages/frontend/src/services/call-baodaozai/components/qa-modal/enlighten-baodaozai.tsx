'use client'

import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceEnum,
} from '@rive-app/react-webgl2'
import { useEffect } from 'react'

import envVars from '@/environment-variables'

import {
  ARTBOARD_ENLIGHTEN_NAME,
  STATE_MACHINE_NAME,
} from '../../context/constants'
import { QaBaodaozaiState } from '../../types'
const ROOT_VIEW_MODEL_NAME = 'VM_EnlightenSelector'

type EnlightenBaodaozaiProps = {
  state: QaBaodaozaiState
}

function EnlightenBaodaozai({ state }: EnlightenBaodaozaiProps) {
  const { RiveComponent, rive } = useRive({
    src: envVars.baodaozaiEnlightenRiveFilePath,
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    artboard: ARTBOARD_ENLIGHTEN_NAME,
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
