// TODO: remove this file
import { BaodaozaiQuestions } from '@/services/call-baodaozai/types'

export const IS_LOGIN = false

export const QUESTIONS: BaodaozaiQuestions = [
  {
    type: 'choice',
    title: '方振宇在羽球比賽中最看重的不是比賽結果，而是什麼？',
    reason:
      '對方振宇來說，球還沒落地前要不停地追，只要還有一絲希望，就不能放棄，這是他與羽球的約定。對方振宇來說，球還沒落地前要不停地追，只要還有一絲希望，就不能放棄，這是他與羽球的約定。對方振宇來說，球還沒落地前要不停地追，只要還有一絲希望，就不能放棄，這是他與羽球的約定。對方振宇來說，球還沒落地前要不停地追，只要還有一絲希望，就不能放棄，這是他與羽球的約定。',
    options: [
      { content: '是否能和所有選手比賽', isCorrectAnswer: false },
      { content: '是否能用盡全力取勝', isCorrectAnswer: true },
      { content: '是否能贏得最多的獎牌', isCorrectAnswer: false },
    ],
  },
  {
    type: 'essay',
    title:
      '方振宇為什麼選擇了去體育班？如果你是方振宇，你會選擇去體育班還是繼續讀書？為什麼？',
    hint: '方振宇選擇了體育班因為他喜歡羽球，想成為一名優秀的羽球選手。你可以想想你自己喜歡什麼活動，是參加體育班還是繼續讀書更符合你的興趣和夢想？根據你的興趣和喜好作出選擇',
  },
  {
    type: 'essay',
    title: '請描述你對運動精神的看法',
    hint: '請從個人經驗或觀察中舉例說明',
  },
]
