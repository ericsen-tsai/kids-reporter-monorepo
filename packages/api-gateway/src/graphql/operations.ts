import {
  answerOperations,
  contentOperations,
  memberOperations,
} from './operations/index.js'
import type { Operation } from './operations/shared.js'

export const operations: Record<string, Operation> = {
  ...contentOperations,
  ...memberOperations,
  ...answerOperations,
}
