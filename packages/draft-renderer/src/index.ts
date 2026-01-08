import blockRenderMaps from './block-render-maps/index'
import { atomicBlockRenderer } from './block-renderer-fn'
import { blockRenderers } from './block-renderers'
import { customStyleFn } from './custom-style-fn'
import {
  ArticleBodyDraftRenderer,
  ArticleIntroductionDraftRenderer,
  DraftRenderer,
  ProjectContentDraftRenderer,
} from './draft-renderer'
import { annotationDecorator, linkDecorator } from './entity-decorators'
import { ENTITY, findEntitiesByType } from './utils/entity'

const blockRenderMap = blockRenderMaps.content

export {
  annotationDecorator,
  ArticleBodyDraftRenderer,
  ArticleIntroductionDraftRenderer,
  atomicBlockRenderer,
  blockRenderers,
  blockRenderMap,
  customStyleFn,
  DraftRenderer,
  ENTITY,
  findEntitiesByType,
  linkDecorator,
  ProjectContentDraftRenderer,
}

export default {
  ArticleBodyDraftRenderer,
  ArticleIntroductionDraftRenderer,
  DraftRenderer,
  ProjectContentDraftRenderer,
  atomicBlockRenderer,
  blockRenderMap: blockRenderMaps.content,
  blockRenderers,
  customStyleFn,
  annotationDecorator,
  linkDecorator,
  ENTITY,
  findEntitiesByType,
}
