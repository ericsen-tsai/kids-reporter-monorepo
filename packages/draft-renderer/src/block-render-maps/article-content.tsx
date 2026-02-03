import { DefaultDraftBlockRenderMap } from 'draft-js'
import Immutable from 'immutable'
import React from 'react'
import styled from 'styled-components'

import { mediaQuery } from '../utils/media-query'

export const Paragraph = styled.div`
  width: 100%;
  max-width: 512px;
  margin: 0 auto;

  ${mediaQuery.largeOnly} {
    max-width: 584px;
  }

  ${mediaQuery.smallOnly} {
    padding-left: 24px;
    padding-right: 24px;
  }

  > div[data-block='true'] {
    margin-bottom: 60px;
    ${mediaQuery.smallOnly} {
      margin-bottom: 40px;
    }
  }
`

export const Heading = styled.div`
  width: 100%;
  max-width: 512px;
  margin: 0 auto 40px auto;

  ${mediaQuery.smallOnly} {
    margin-bottom: 24px;
  }

  ${mediaQuery.largeOnly} {
    max-width: 584px;
  }

  h2,
  h3,
  h4,
  h5 {
    margin: 0;
  }

  ${mediaQuery.smallOnly} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

export const List = styled.ol`
  width: 100%;
  max-width: 512px;
  margin: 0 auto 60px auto;
  list-style-position: inside;

  > li > div {
    display: inline;
  }

  ${mediaQuery.smallOnly} {
    margin-bottom: 40px;
    padding-left: 24px;
    padding-right: 24px;
  }

  ${mediaQuery.largeOnly} {
    max-width: 584px;
  }

  > li {
    margin-bottom: 6px;
  }
`

export const Atomic = styled.div`
  /* reset browser default styles */
  > figure {
    margin: 0;
  }
`

const _blockRenderMap = Immutable.Map({
  atomic: {
    element: 'figure',
    wrapper: <Atomic />,
  },
  'header-two': {
    element: 'h2',
    wrapper: <Heading />,
  },
  'header-three': {
    element: 'h3',
    wrapper: <Heading />,
  },
  'header-four': {
    element: 'h4',
    wrapper: <Heading />,
  },
  'header-five': {
    element: 'h5',
    wrapper: <Heading />,
  },
  'ordered-list-item': {
    element: 'li',
    wrapper: <List />,
  },
  'unordered-list-item': {
    element: 'li',
    wrapper: <List as="ul" />,
  },
  unstyled: {
    element: 'div',
    wrapper: <Paragraph />,
  },
})

export const blockRenderMap = DefaultDraftBlockRenderMap.merge(_blockRenderMap)
