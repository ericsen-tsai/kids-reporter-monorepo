import { PostQuestionAnswers } from '../types'

export const MOCK_POST_QUESTION_ANSWERS: PostQuestionAnswers = [
  // Post 1: 放棄「南二中」追尋帕運夢，羽球選手方振宇用「右手」挑戰世界巔峰
  {
    title: '放棄「南二中」追尋帕運夢，羽球選手方振宇用「右手」挑戰世界巔峰',
    href: '/article/1',
    lastAnsweredTime: '2024-01-15T10:30:00Z',
    answers: [
      {
        __typename: 'PostChoiceAnswer',
        id: '1',
        choiceIndex: 2,
        correct: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        compositeKey: 'member-1-question-1',
        question: {
          __typename: 'PostChoiceQuestion',
          id: 'q1',
          title: '方振宇參加了哪一屆帕運？',
          options: [
            { content: '2016年里約帕運', isCorrectAnswer: false },
            { content: '2020年東京帕運', isCorrectAnswer: false },
            { content: '2021年東京帕運', isCorrectAnswer: true },
          ],
          reason: '方振宇參加了2021年東京帕運',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      },
      {
        __typename: 'PostEssayAnswer',
        id: '2',
        content:
          '我覺得他有自己的想法，選擇體育班應該是經過考慮的。如果是我，可能會想想自己的興趣再決定。',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T14:20:00Z',
        compositeKey: 'member-1-question-2',
        likesCount: 100,
        question: {
          __typename: 'PostEssayQuestion',
          id: 'q2',
          title:
            '方振宇為什麼選擇了去體育班？如果你是方振宇，你會選擇去體育班還是繼續讀書？為什麼？',
          hint: '請從個人經驗或觀察中舉例說明',
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-14T14:20:00Z',
        },
      },
      {
        __typename: 'PostChoiceAnswer',
        id: '4',
        choiceIndex: 0,
        correct: false,
        createdAt: '2024-01-12T16:45:00Z',
        updatedAt: '2024-01-12T16:45:00Z',
        compositeKey: 'member-1-question-4',
        question: {
          __typename: 'PostChoiceQuestion',
          id: 'q4',
          title: '方振宇在羽球比賽中最看重的不是比賽結果，而是什麼？',
          options: [
            { content: '是否能贏得最多的獎牌', isCorrectAnswer: false },
            { content: '是否能用盡全力取勝', isCorrectAnswer: true },
            { content: '是否能打破世界紀錄', isCorrectAnswer: false },
          ],
          reason:
            '對方振宇來說，球還沒落地前要不停地追，只要還有一絲希望，就不能放棄，這是他與羽球的約定。',
          createdAt: '2024-01-12T16:45:00Z',
          updatedAt: '2024-01-12T16:45:00Z',
        },
      },
    ],
  },
  // Post 2: 你認為科技對學習有什麼幫助？
  {
    title:
      '「現在，換我們謝謝你！」從學生、士官長到新住民媽媽，光復在地的「好人連線」助災民轉為助人者',
    href: '/article/2',
    lastAnsweredTime: '2024-01-13T09:15:00Z',
    answers: [
      {
        __typename: 'PostEssayAnswer',
        id: '3',
        content:
          '科技讓學習變得更有趣和方便。我們可以透過網路找到很多學習資源，也可以用平板或電腦做筆記，比傳統方式更有效率。',
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:15:00Z',
        compositeKey: 'member-1-question-3',
        likesCount: 25,
        question: {
          __typename: 'PostEssayQuestion',
          id: 'q3',
          title: '你認為科技對學習有什麼幫助？',
          hint: '請從個人經驗或觀察中舉例說明',
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
        },
      },
      {
        __typename: 'PostEssayAnswer',
        id: '5',
        content:
          '我理想中的學校生活是每天都有有趣的課程，老師會用遊戲和實驗來教我們知識。下課時間可以和朋友一起玩，午餐時間可以選擇自己喜歡的食物。放學後有時間做自己喜歡的活動，像是畫畫、運動或閱讀。',
        createdAt: '2024-01-11T11:00:00Z',
        updatedAt: '2024-01-11T11:00:00Z',
        compositeKey: 'member-1-question-5',
        likesCount: 15,
        question: {
          __typename: 'PostEssayQuestion',
          id: 'q5',
          title: '描述你理想中的學校生活',
          hint: '請從個人經驗或觀察中舉例說明',
          createdAt: '2024-01-11T11:00:00Z',
          updatedAt: '2024-01-11T11:00:00Z',
        },
      },
    ],
  },
  // Post 3: 氣候變遷相關
  {
    title: '極端氣候下的生存挑戰：小島國家的氣候難民危機',
    href: '/article/3',
    lastAnsweredTime: '2024-01-10T08:20:00Z',
    answers: [
      {
        __typename: 'PostChoiceAnswer',
        id: '6',
        choiceIndex: 1,
        correct: true,
        createdAt: '2024-01-10T08:20:00Z',
        updatedAt: '2024-01-10T08:20:00Z',
        compositeKey: 'member-1-question-6',
        question: {
          __typename: 'PostChoiceQuestion',
          id: 'q6',
          title: '造成海平面上升的主要原因是什麼？',
          options: [
            { content: '地殼變動', isCorrectAnswer: false },
            { content: '全球暖化導致冰川融化', isCorrectAnswer: true },
            { content: '海洋生物數量增加', isCorrectAnswer: false },
          ],
          reason:
            '全球暖化導致南北極冰川和格陵蘭冰蓋大量融化，是造成海平面上升的主要原因。',
          createdAt: '2024-01-10T08:20:00Z',
          updatedAt: '2024-01-10T08:20:00Z',
        },
      },
      {
        __typename: 'PostEssayAnswer',
        id: '7',
        content:
          '我覺得我們每個人都應該從日常生活中做起，像是減少使用塑膠製品、多搭乘大眾運輸工具、節約用電等。雖然個人的力量很小，但如果每個人都願意改變，就能產生很大的影響。',
        createdAt: '2024-01-09T15:30:00Z',
        updatedAt: '2024-01-09T15:30:00Z',
        compositeKey: 'member-1-question-7',
        likesCount: 42,
        question: {
          __typename: 'PostEssayQuestion',
          id: 'q7',
          title: '你認為個人可以如何對抗氣候變遷？',
          hint: '請從實際行動的角度思考',
          createdAt: '2024-01-09T15:30:00Z',
          updatedAt: '2024-01-09T15:30:00Z',
        },
      },
    ],
  },
  // Post 4: 歷史相關
  {
    title: '從二二八事件看台灣民主化的艱辛歷程',
    href: '/article/4',
    lastAnsweredTime: '2024-01-08T14:10:00Z',
    answers: [
      {
        __typename: 'PostChoiceAnswer',
        id: '8',
        choiceIndex: 2,
        correct: true,
        createdAt: '2024-01-08T14:10:00Z',
        updatedAt: '2024-01-08T14:10:00Z',
        compositeKey: 'member-1-question-8',
        question: {
          __typename: 'PostChoiceQuestion',
          id: 'q8',
          title: '二二八事件發生在哪一年？',
          options: [
            { content: '1945年', isCorrectAnswer: false },
            { content: '1946年', isCorrectAnswer: false },
            { content: '1947年', isCorrectAnswer: true },
          ],
          reason:
            '二二八事件發生於1947年2月28日，是台灣歷史上重要的民主運動事件。',
          createdAt: '2024-01-08T14:10:00Z',
          updatedAt: '2024-01-08T14:10:00Z',
        },
      },
    ],
  },
  // Post 5: 科學相關
  {
    title: 'AI人工智慧的未來：機器學習如何改變我們的生活',
    href: '/article/5',
    lastAnsweredTime: '2024-01-07T11:45:00Z',
    answers: [
      {
        __typename: 'PostEssayAnswer',
        id: '9',
        content:
          'AI已經在很多地方幫助我們了，像是手機的語音助理、推薦影片的演算法，還有自動駕駛車。我覺得未來AI會更聰明，可能會幫助醫生診斷疾病，或是幫助老師設計更適合每個學生的學習方式。但我也擔心AI會不會取代太多人的工作。',
        createdAt: '2024-01-07T11:45:00Z',
        updatedAt: '2024-01-07T11:45:00Z',
        compositeKey: 'member-1-question-9',
        likesCount: 67,
        question: {
          __typename: 'PostEssayQuestion',
          id: 'q9',
          title: '你認為AI人工智慧在未來十年會如何影響我們的生活？',
          hint: '可以從正面和負面兩個角度思考',
          createdAt: '2024-01-07T11:45:00Z',
          updatedAt: '2024-01-07T11:45:00Z',
        },
      },
      {
        __typename: 'PostChoiceAnswer',
        id: '10',
        choiceIndex: 0,
        correct: true,
        createdAt: '2024-01-06T16:20:00Z',
        updatedAt: '2024-01-06T16:20:00Z',
        compositeKey: 'member-1-question-10',
        question: {
          __typename: 'PostChoiceQuestion',
          id: 'q10',
          title: '機器學習是AI的核心技術之一，它的主要特點是什麼？',
          options: [
            {
              content: '機器可以從數據中學習並改進',
              isCorrectAnswer: true,
            },
            { content: '機器可以完全自主思考', isCorrectAnswer: false },
            { content: '機器不需要任何數據', isCorrectAnswer: false },
          ],
          reason:
            '機器學習的核心是讓電腦系統能夠從數據中自動學習和改進，而不需要明確編寫每個規則。',
          createdAt: '2024-01-06T16:20:00Z',
          updatedAt: '2024-01-06T16:20:00Z',
        },
      },
    ],
  },
  // Post 6: 社會議題
  {
    title: '網路霸凌的陰影：數位時代下的青少年心理健康',
    href: '/article/6',
    lastAnsweredTime: '2024-01-05T09:30:00Z',
    answers: [
      {
        __typename: 'PostEssayAnswer',
        id: '11',
        content:
          '如果看到同學被網路霸凌，我會先安慰他，告訴他這不是他的錯。然後我會建議他告訴老師或家長，或者一起想辦法阻止那些霸凌的人。我覺得最重要的是讓被霸凌的人知道有人支持他，他不是一個人面對。',
        createdAt: '2024-01-05T09:30:00Z',
        updatedAt: '2024-01-05T09:30:00Z',
        compositeKey: 'member-1-question-11',
        likesCount: 89,
        question: {
          __typename: 'PostEssayQuestion',
          id: 'q11',
          title: '如果你發現同學在網路上被霸凌，你會怎麼做？',
          hint: '請思考實際可行的幫助方式',
          createdAt: '2024-01-05T09:30:00Z',
          updatedAt: '2024-01-05T09:30:00Z',
        },
      },
      {
        __typename: 'PostChoiceAnswer',
        id: '12',
        choiceIndex: 2,
        correct: true,
        createdAt: '2024-01-04T13:15:00Z',
        updatedAt: '2024-01-04T13:15:00Z',
        compositeKey: 'member-1-question-12',
        question: {
          __typename: 'PostChoiceQuestion',
          id: 'q12',
          title: '網路霸凌最常見的形式是什麼？',
          options: [
            { content: '面對面的言語攻擊', isCorrectAnswer: false },
            { content: '肢體衝突', isCorrectAnswer: false },
            {
              content: '在社群媒體上散播謠言或惡意留言',
              isCorrectAnswer: true,
            },
          ],
          reason:
            '網路霸凌最常見的形式是在社群媒體、聊天室或論壇上散播謠言、惡意留言、公開羞辱等行為。',
          createdAt: '2024-01-04T13:15:00Z',
          updatedAt: '2024-01-04T13:15:00Z',
        },
      },
    ],
  },
  // Post 7: 文化相關
  {
    title: '傳統與現代的對話：原住民文化在當代社會的傳承與創新',
    href: '/article/7',
    lastAnsweredTime: '2024-01-03T10:00:00Z',
    answers: [
      {
        __typename: 'PostEssayAnswer',
        id: '13',
        content:
          '我覺得原住民文化很珍貴，像是他們的語言、傳統服飾、音樂和舞蹈都很有特色。在現代社會中，可以透過學校教育、文化節慶、博物館展覽等方式來保存和傳承。同時也可以結合現代科技，像是用APP學習原住民語言，或是用VR體驗傳統生活，這樣年輕人會更有興趣。',
        createdAt: '2024-01-03T10:00:00Z',
        updatedAt: '2024-01-03T10:00:00Z',
        compositeKey: 'member-1-question-13',
        likesCount: 56,
        question: {
          __typename: 'PostEssayQuestion',
          id: 'q13',
          title: '你認為如何在現代社會中保存和傳承原住民文化？',
          hint: '可以思考傳統與創新的平衡',
          createdAt: '2024-01-03T10:00:00Z',
          updatedAt: '2024-01-03T10:00:00Z',
        },
      },
    ],
  },
  // Post 8: 環境保護
  {
    title: '海洋塑膠危機：從源頭減塑到循環經濟',
    href: '/article/8',
    lastAnsweredTime: '2024-01-02T15:40:00Z',
    answers: [
      {
        __typename: 'PostChoiceAnswer',
        id: '14',
        choiceIndex: 1,
        correct: true,
        createdAt: '2024-01-02T15:40:00Z',
        updatedAt: '2024-01-02T15:40:00Z',
        compositeKey: 'member-1-question-14',
        question: {
          __typename: 'PostChoiceQuestion',
          id: 'q14',
          title: '哪種塑膠製品對海洋生態的威脅最大？',
          options: [
            { content: '可回收的塑膠瓶', isCorrectAnswer: false },
            { content: '一次性塑膠製品如吸管、塑膠袋', isCorrectAnswer: true },
            { content: '塑膠玩具', isCorrectAnswer: false },
          ],
          reason:
            '一次性塑膠製品因為使用時間短、數量龐大，且容易被隨意丟棄，對海洋生態造成最大的威脅。',
          createdAt: '2024-01-02T15:40:00Z',
          updatedAt: '2024-01-02T15:40:00Z',
        },
      },
      {
        __typename: 'PostEssayAnswer',
        id: '15',
        content:
          '我會隨身帶環保袋和環保餐具，盡量不買有過度包裝的商品。也會選擇可以重複使用的產品，像是玻璃瓶裝的飲料而不是塑膠瓶。在學校也會提醒同學一起做環保，大家一起努力效果會更好。',
        createdAt: '2024-01-01T12:25:00Z',
        updatedAt: '2024-01-01T12:25:00Z',
        compositeKey: 'member-1-question-15',
        likesCount: 33,
        question: {
          __typename: 'PostEssayQuestion',
          id: 'q15',
          title: '你在日常生活中如何減少使用塑膠製品？',
          hint: '請分享具體的行動',
          createdAt: '2024-01-01T12:25:00Z',
          updatedAt: '2024-01-01T12:25:00Z',
        },
      },
    ],
  },
  // Post 9: 教育相關
  {
    title: '翻轉教室的實踐：讓學習回到學生手中',
    href: '/article/9',
    lastAnsweredTime: '2023-12-30T14:50:00Z',
    answers: [
      {
        __typename: 'PostChoiceAnswer',
        id: '16',
        choiceIndex: 0,
        correct: false,
        createdAt: '2023-12-30T14:50:00Z',
        updatedAt: '2023-12-30T14:50:00Z',
        compositeKey: 'member-1-question-16',
        question: {
          __typename: 'PostChoiceQuestion',
          id: 'q16',
          title: '翻轉教室的主要特色是什麼？',
          options: [
            { content: '學生在家看影片，在學校做作業', isCorrectAnswer: false },
            {
              content: '學生在家預習，在學校進行討論和實作',
              isCorrectAnswer: true,
            },
            { content: '完全取消課堂教學', isCorrectAnswer: false },
          ],
          reason:
            '翻轉教室的核心是讓學生在家先預習課程內容，在課堂上則進行討論、互動和實作，讓學習更主動。',
          createdAt: '2023-12-30T14:50:00Z',
          updatedAt: '2023-12-30T14:50:00Z',
        },
      },
    ],
  },
  // Post 10: 健康相關
  {
    title: '青少年睡眠不足危機：數位時代下的健康隱憂',
    href: '/article/10',
    lastAnsweredTime: '2023-12-28T16:30:00Z',
    answers: [
      {
        __typename: 'PostEssayAnswer',
        id: '17',
        content:
          '我發現自己常常因為滑手機或看影片而晚睡，導致隔天精神不好。現在我會設定手機的睡眠模式，晚上十點後就不再看螢幕。也會在睡前做一些放鬆的事情，像是看書或聽音樂，這樣比較容易入睡。',
        createdAt: '2023-12-28T16:30:00Z',
        updatedAt: '2023-12-28T16:30:00Z',
        compositeKey: 'member-1-question-17',
        likesCount: 78,
        question: {
          __typename: 'PostEssayQuestion',
          id: 'q17',
          title: '你如何改善自己的睡眠品質？',
          hint: '可以分享實際的經驗和方法',
          createdAt: '2023-12-28T16:30:00Z',
          updatedAt: '2023-12-28T16:30:00Z',
        },
      },
      {
        __typename: 'PostChoiceAnswer',
        id: '18',
        choiceIndex: 2,
        correct: true,
        createdAt: '2023-12-27T11:20:00Z',
        updatedAt: '2023-12-27T11:20:00Z',
        compositeKey: 'member-1-question-18',
        question: {
          __typename: 'PostChoiceQuestion',
          id: 'q18',
          title: '青少年建議每天睡眠時間是幾小時？',
          options: [
            { content: '6-7小時', isCorrectAnswer: false },
            { content: '7-8小時', isCorrectAnswer: false },
            { content: '8-10小時', isCorrectAnswer: true },
          ],
          reason:
            '根據醫學研究，13-18歲的青少年建議每天睡眠8-10小時，才能維持良好的身心健康。',
          createdAt: '2023-12-27T11:20:00Z',
          updatedAt: '2023-12-27T11:20:00Z',
        },
      },
    ],
  },
]
