import {
  ContentBlock,
  ContentState,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
  RawDraftContentState,
} from 'draft-js'
import React from 'react'
import styled, { css } from 'styled-components'

import blockRenderMaps from '../block-render-maps/index'
import { ImageInInfoBox } from '../block-renderers/image-block'
import { ImageLinkInInfoBox } from '../block-renderers/image-link'
import { decorator } from '../entity-decorators/index'
import { mediaQuery } from '../utils/media-query'

enum InfoBoxTypeEnum {
  newsChargeStation = 'news-charge-station',
  headerBorder = 'header-border',
  boxBorder = 'box-border',
}

type InfoBoxBlockProps = {
  className?: string
  data: {
    type: InfoBoxTypeEnum
    rawContentState: RawDraftContentState
    showBaodaozai?: boolean
  }
}

const containerStyles = css`
  border-radius: 30px;
  position: relative;

  ${mediaQuery.smallOnly} {
    padding: 24px;
  }

  ${mediaQuery.mediumOnly} {
    padding: 36px;
  }

  ${mediaQuery.desktopAbove} {
    padding: 48px;
  }
`

const NewsChargeStationContainer = styled.div<{ $showBaodaozai?: boolean }>`
  ${containerStyles}
  ${mediaQuery.smallOnly} {
    padding-top: 56px;
  }

  ${mediaQuery.mediumOnly} {
    padding-top: 72px;
  }

  ${mediaQuery.desktopAbove} {
    padding-top: 84px;
  }
  background-color: #fff9ec;

  &::before {
    content: '';
    width: 300px;
    height: 80px;
    background-image: url(https://www.unpkg.com/@kids-reporter/draft-renderer/public/images/info-box-news-charge-station.svg);
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
  }
`

const ClearFloat = styled.div`
  clear: both;
`

function NewsChargeStation({ children }: { children: React.ReactNode }) {
  return <NewsChargeStationContainer>{children}</NewsChargeStationContainer>
}

const HeaderBorderLogoContainer = styled.div`
  display: flex;
  justify-content: end;
  ${mediaQuery.smallOnly} {
    padding-top: 20px;
  }
  ${mediaQuery.mediumAbove} {
    padding-top: 32px;
  }
`

const HeaderBorderLogo = styled.img`
  width: 120px;
  height: 100px;
`

const HeaderBorderContainer = styled.div`
  background-color: #e9f8ff;
  ${containerStyles}
`

function HeaderBorder({
  children,
  showBaodaozai,
}: {
  children: React.ReactNode
  showBaodaozai?: boolean
}) {
  return (
    <HeaderBorderContainer>
      {children}
      {showBaodaozai && (
        <HeaderBorderLogoContainer>
          <HeaderBorderLogo src="https://www.unpkg.com/@kids-reporter/draft-renderer/public/images/info-box-blocksy-child-1-yellow.png" />
        </HeaderBorderLogoContainer>
      )}
    </HeaderBorderContainer>
  )
}

const BoxBorderContainer = styled.div`
  ${containerStyles}
  overflow: hidden;
  background-color: #f8f8f8;
  ${mediaQuery.smallOnly} {
    padding-bottom: 64px;
  }
`

const BoxBorderLogo = styled.img`
  width: 88px;
  height: 64px;
  position: absolute;
  bottom: 0;
  right: 0;
`

function BoxBorder({
  children,
  showBaodaozai,
}: {
  children: React.ReactNode
  showBaodaozai?: boolean
}) {
  return (
    <BoxBorderContainer>
      {children}
      {showBaodaozai && (
        <BoxBorderLogo src="https://www.unpkg.com/@kids-reporter/draft-renderer/public/images/info-box-blocksy-child-2-blue.png" />
      )}
    </BoxBorderContainer>
  )
}

const ArticleBodyContainer = styled.div`
  max-width: 700px;
  margin: 60px auto;

  ${mediaQuery.smallOnly} {
    width: 100%;
  }
`

const EditorContainer = styled.div`
  position: relative;
`

function covertFromRawWithoutUnstyledTrailingBlocks(
  rawContentState: RawDraftContentState
) {
  const contentState = convertFromRaw(rawContentState)
  const blocks = contentState.getBlocksAsArray()
  const lastBlock = blocks[blocks.length - 1]
  if (lastBlock.getText().trim() !== '') {
    return contentState
  }
  const newBlocks = blocks.slice(0, -1)
  const newRawContentState = convertToRaw(
    ContentState.createFromBlockArray(newBlocks)
  )
  return covertFromRawWithoutUnstyledTrailingBlocks(newRawContentState)
}

export function InfoBoxInArticleBody({ className, data }: InfoBoxBlockProps) {
  const { type, rawContentState, showBaodaozai = true } = data
  const contentState =
    covertFromRawWithoutUnstyledTrailingBlocks(rawContentState)
  const editorState = EditorState.createWithContent(contentState, decorator)
  let Component
  let blockRenderMap = blockRenderMaps.infoBox.default
  switch (type) {
    case InfoBoxTypeEnum.headerBorder: {
      Component = HeaderBorder
      blockRenderMap = blockRenderMaps.infoBox.headerBorder
      break
    }
    case InfoBoxTypeEnum.boxBorder: {
      Component = BoxBorder
      break
    }
    case InfoBoxTypeEnum.newsChargeStation:
    default: {
      Component = NewsChargeStation
      break
    }
  }
  return (
    <ArticleBodyContainer className={className}>
      <Component showBaodaozai={showBaodaozai}>
        <EditorContainer>
          <Editor
            blockRenderMap={blockRenderMap}
            blockRendererFn={blockRendererFn}
            editorState={editorState}
            readOnly
            onChange={() => {}}
          />
          <ClearFloat />
        </EditorContainer>
      </Component>
    </ArticleBodyContainer>
  )
}

function AtomicBlock(props: {
  contentState: ContentState
  block: ContentBlock
}) {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))

  const entityType = entity.getType()
  const entityData = entity.getData()

  switch (entityType) {
    case 'IMAGE':
      return ImageInInfoBox({ data: entityData })
    case 'IMAGE_LINK':
      return ImageLinkInInfoBox({ data: entityData })
  }
  return null
}

function blockRendererFn(block: ContentBlock) {
  if (block.getType() === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
    }
  }

  return null
}
