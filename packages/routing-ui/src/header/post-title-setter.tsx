'use client'

import { useEffect } from 'react'
import { useHeaderContext } from './header-context'

type PostTitleSetterProps = {
  postTitle?: string
}

function PostTitleSetter({ postTitle }: PostTitleSetterProps) {
  const context = useHeaderContext()
  const setPostTitle = context?.setPostTitle
  useEffect(() => {
    setPostTitle?.(postTitle)
    return () => setPostTitle?.(undefined)
  }, [postTitle, setPostTitle])

  return null
}

export default PostTitleSetter
