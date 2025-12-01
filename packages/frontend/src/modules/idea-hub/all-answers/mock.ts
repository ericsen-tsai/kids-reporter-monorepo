import { PostWithTwoTopLikesAnswersPerQuestionReturnType } from '../types'

export const mockPostsWithAnswers: PostWithTwoTopLikesAnswersPerQuestionReturnType =
  {
    posts: [
      {
        id: '1',
        slug: 'exploring-the-ocean-depths',
        title:
          '探索海洋深處的奧秘探索海洋深處的奧秘探索海洋深處的奧秘探索海洋深處的奧秘探索海洋深處的奧秘探索海洋深處的奧秘探索海洋深處的奧秘探索海洋深處的奧秘探索海洋深處的奧秘探索海洋深處的奧秘探索海洋深處的奧秘',
        publishedDate: '2024-01-15T10:00:00Z',
        heroImage: {
          resized: {
            medium:
              'https://kids-storage.twreporter.org/images/6a381d2a-44e5-416f-afb5-60e3fbd98738.png',
          },
        },
        subSubcategoriesOrdered: [{ name: '海洋生物' }, { name: '環境保護' }],
        questions: [
          {
            id: 'q1-1',
            title: '你覺得海洋中最有趣的生物是什麼？',
            hint: '可以想想你見過或聽過的海洋生物',
            answers: [
              {
                id: 'a1-1',
                content:
                  '我覺得章魚最有趣！它們有八隻觸手，而且非常聰明，可以改變顏色和形狀來偽裝自己。',
                likesCount: 130,
                createdAt: '2024-01-16T08:30:00Z',
                updatedAt: '2024-01-16T08:30:00Z',
                member: {
                  id: 'm1',
                  name: '小明',
                  nickname: '海洋小探險家',
                  avatar: null,
                },
              },
              {
                id: 'a1-2',
                content:
                  '我喜歡海豚！它們很友善，而且會用聲音來溝通，就像在唱歌一樣。',
                likesCount: 38,
                createdAt: '2024-01-16T09:15:00Z',
                updatedAt: '2024-01-16T09:15:00Z',
                member: {
                  id: 'm2',
                  name: '小華',
                  nickname: '動物愛好者',
                  avatar: null,
                },
              },
              {
                id: 'a1-3',
                content:
                  '我覺得鯨魚很神奇！它們是海洋中最大的動物，而且會唱歌，聲音可以傳到很遠的地方。',
                likesCount: 42,
                createdAt: '2024-01-16T10:00:00Z',
                updatedAt: '2024-01-16T10:00:00Z',
                member: {
                  id: 'm3',
                  name: '小美',
                  nickname: '海洋愛好者',
                  avatar: null,
                },
              },
            ],
          },
          {
            id: 'q1-2',
            title: '我們應該如何保護海洋環境？',
            hint: '想想日常生活中可以做什麼',
            answers: [
              {
                id: 'a1-4',
                content:
                  '我們可以減少使用塑膠製品，特別是塑膠袋和吸管，因為這些會污染海洋。',
                likesCount: 52,
                createdAt: '2024-01-16T11:20:00Z',
                updatedAt: '2024-01-16T11:20:00Z',
                member: {
                  id: 'm4',
                  name: '小強',
                  nickname: '環保小天使',
                  avatar: null,
                },
              },
            ],
          },
          {
            id: 'q1-3',
            title: '你認為海洋污染對我們的生活有什麼影響？',
            hint: '想想海洋和我們的關係',
            answers: [
              {
                id: 'a1-5',
                content:
                  '海洋污染會影響我們吃的海鮮，如果魚吃了塑膠，我們吃魚的時候也可能吃到有害物質。',
                likesCount: 48,
                createdAt: '2024-01-16T14:00:00Z',
                updatedAt: '2024-01-16T14:00:00Z',
                member: {
                  id: 'm5',
                  name: '小健',
                  nickname: '健康守護者',
                  avatar: null,
                },
              },
              {
                id: 'a1-6',
                content:
                  '污染會破壞海洋生態，很多美麗的珊瑚和魚類會消失，我們就看不到這些美景了。',
                likesCount: 55,
                createdAt: '2024-01-16T15:30:00Z',
                updatedAt: '2024-01-16T15:30:00Z',
                member: {
                  id: 'm6',
                  name: '小麗',
                  nickname: '生態保護者',
                  avatar: null,
                },
              },
            ],
          },
        ],
      },
      {
        id: '2',
        slug: 'the-magic-of-space',
        title: '太空的魔法世界',
        publishedDate: '2024-01-20T14:00:00Z',
        heroImage: {
          resized: {
            medium:
              'https://kids-storage.twreporter.org/images/6a381d2a-44e5-416f-afb5-60e3fbd98738.png',
          },
        },
        subSubcategoriesOrdered: [{ name: '天文學' }, { name: '科學探索' }],
        questions: [
          {
            id: 'q2-1',
            title: '如果你能去任何一個星球，你會選擇哪一個？',
            hint: '想想你對哪個星球最感興趣',
            answers: [
              {
                id: 'a2-1',
                content:
                  '我想去火星！因為科學家說那裡可能有水，說不定可以找到生命。',
                likesCount: 67,
                createdAt: '2024-01-21T09:00:00Z',
                updatedAt: '2024-01-21T09:00:00Z',
                member: {
                  id: 'm7',
                  name: '小宇',
                  nickname: '未來太空人',
                  avatar: null,
                },
              },
            ],
          },
          {
            id: 'q2-2',
            title: '你覺得宇宙中會有其他生命嗎？',
            hint: '想想宇宙有多大',
            answers: [
              {
                id: 'a2-2',
                content:
                  '我覺得一定有！宇宙這麼大，有那麼多星球，不可能只有地球有生命。',
                likesCount: 72,
                createdAt: '2024-01-21T11:00:00Z',
                updatedAt: '2024-01-21T11:00:00Z',
                member: {
                  id: 'm8',
                  name: '小晴',
                  nickname: '星空觀察家',
                  avatar: null,
                },
              },
              {
                id: 'a2-3',
                content:
                  '可能會有，但我們還沒找到證據。不過科學家一直在尋找，說不定很快就會發現了！',
                likesCount: 58,
                createdAt: '2024-01-21T12:30:00Z',
                updatedAt: '2024-01-21T12:30:00Z',
                member: {
                  id: 'm9',
                  name: '小科',
                  nickname: '科學探索者',
                  avatar: null,
                },
              },
              {
                id: 'a2-4',
                content:
                  '我希望有！這樣我們就不會孤單了，可以和其他星球的朋友交流。',
                likesCount: 64,
                createdAt: '2024-01-21T14:00:00Z',
                updatedAt: '2024-01-21T14:00:00Z',
                member: {
                  id: 'm10',
                  name: '小友',
                  nickname: '友善使者',
                  avatar: null,
                },
              },
            ],
          },
          {
            id: 'q2-3',
            title: '為什麼我們要探索太空？',
            hint: '想想探索太空的好處',
            answers: [
              {
                id: 'a2-5',
                content:
                  '探索太空可以幫助我們了解宇宙的奧秘，也能發展新的科技，讓生活變得更好。',
                likesCount: 61,
                createdAt: '2024-01-21T15:30:00Z',
                updatedAt: '2024-01-21T15:30:00Z',
                member: {
                  id: 'm11',
                  name: '小智',
                  nickname: '智慧探索者',
                  avatar: null,
                },
              },
              {
                id: 'a2-6',
                content:
                  '因為地球的資源有限，我們需要找到新的地方，為人類的未來做準備。',
                likesCount: 55,
                createdAt: '2024-01-21T16:45:00Z',
                updatedAt: '2024-01-21T16:45:00Z',
                member: {
                  id: 'm12',
                  name: '小遠',
                  nickname: '未來規劃師',
                  avatar: null,
                },
              },
            ],
          },
        ],
      },
      {
        id: '3',
        slug: 'ancient-civilizations',
        title: '古代文明的智慧',
        publishedDate: '2024-01-25T11:00:00Z',
        heroImage: {
          resized: {
            medium:
              'https://kids-storage.twreporter.org/images/6a381d2a-44e5-416f-afb5-60e3fbd98738.png',
          },
        },
        subSubcategoriesOrdered: [
          { name: '歷史' },
          { name: '文化' },
          { name: '考古' },
        ],
        questions: [
          {
            id: 'q3-1',
            title: '你覺得古代人最厲害的發明是什麼？',
            hint: '想想哪些東西到現在還在用',
            answers: [
              {
                id: 'a3-1',
                content:
                  '我覺得是文字！有了文字，知識才能被記錄和傳承，讓我們可以學習古人的智慧。',
                likesCount: 73,
                createdAt: '2024-01-26T08:00:00Z',
                updatedAt: '2024-01-26T08:00:00Z',
                member: {
                  id: 'm13',
                  name: '小文',
                  nickname: '歷史迷',
                  avatar: null,
                },
              },
            ],
          },
          {
            id: 'q3-2',
            title: '為什麼我們要學習歷史？',
            hint: '想想歷史能教會我們什麼',
            answers: [
              {
                id: 'a3-2',
                content:
                  '學習歷史可以讓我們了解過去，避免重複犯錯，也能知道我們是怎麼走到今天的。',
                likesCount: 58,
                createdAt: '2024-01-26T11:00:00Z',
                updatedAt: '2024-01-26T11:00:00Z',
                member: {
                  id: 'm14',
                  name: '小思',
                  nickname: '思考者',
                  avatar: null,
                },
              },
              {
                id: 'a3-3',
                content:
                  '因為歷史很有趣！可以知道以前的人怎麼生活，他們的建築、藝術都很棒。',
                likesCount: 49,
                createdAt: '2024-01-26T13:20:00Z',
                updatedAt: '2024-01-26T13:20:00Z',
                member: {
                  id: 'm15',
                  name: '小藝',
                  nickname: '藝術愛好者',
                  avatar: null,
                },
              },
              {
                id: 'a3-4',
                content:
                  '歷史告訴我們人類的發展過程，讓我們更珍惜現在的生活，也更有智慧面對未來。',
                likesCount: 52,
                createdAt: '2024-01-26T14:30:00Z',
                updatedAt: '2024-01-26T14:30:00Z',
                member: {
                  id: 'm16',
                  name: '小慧',
                  nickname: '智慧傳承者',
                  avatar: null,
                },
              },
            ],
          },
          {
            id: 'q3-3',
            title: '你最想了解哪個古代文明？',
            hint: '想想你聽過的古代文明',
            answers: [
              {
                id: 'a3-5',
                content:
                  '我想了解古埃及！他們建造了金字塔，還有木乃伊，感覺很神秘。',
                likesCount: 66,
                createdAt: '2024-01-26T16:00:00Z',
                updatedAt: '2024-01-26T16:00:00Z',
                member: {
                  id: 'm17',
                  name: '小神',
                  nickname: '神秘探索者',
                  avatar: null,
                },
              },
              {
                id: 'a3-6',
                content:
                  '我對古希臘文明很感興趣，他們有很多哲學家和科學家，影響了整個世界。',
                likesCount: 59,
                createdAt: '2024-01-26T17:15:00Z',
                updatedAt: '2024-01-26T17:15:00Z',
                member: {
                  id: 'm18',
                  name: '小哲',
                  nickname: '哲學愛好者',
                  avatar: null,
                },
              },
            ],
          },
        ],
      },
      {
        id: '4',
        slug: 'wonderful-animals',
        title: '動物的奇妙世界',
        publishedDate: '2024-02-01T09:00:00Z',
        heroImage: {
          resized: {
            medium:
              'https://kids-storage.twreporter.org/images/6a381d2a-44e5-416f-afb5-60e3fbd98738.png',
          },
        },
        subSubcategoriesOrdered: [{ name: '動物' }, { name: '自然' }],
        questions: [
          {
            id: 'q4-1',
            title: '你最喜歡哪種動物的特殊能力？',
            hint: '想想動物的超能力',
            answers: [
              {
                id: 'a4-1',
                content:
                  '我喜歡變色龍！它們可以改變顏色來隱藏自己，這樣就不會被敵人發現。',
                likesCount: 64,
                createdAt: '2024-02-02T10:00:00Z',
                updatedAt: '2024-02-02T10:00:00Z',
                member: {
                  id: 'm19',
                  name: '小隱',
                  nickname: '自然觀察員',
                  avatar: null,
                },
              },
              {
                id: 'a4-2',
                content:
                  '我覺得蝙蝠的回聲定位很酷！它們可以用聲音「看見」東西，在黑暗中也能飛行。',
                likesCount: 56,
                createdAt: '2024-02-02T11:30:00Z',
                updatedAt: '2024-02-02T11:30:00Z',
                member: {
                  id: 'm20',
                  name: '小夜',
                  nickname: '夜行動物迷',
                  avatar: null,
                },
              },
              {
                id: 'a4-3',
                content:
                  '我覺得鳥類的飛行能力最厲害！它們可以在天空中自由飛翔，去任何想去的地方。',
                likesCount: 61,
                createdAt: '2024-02-02T13:00:00Z',
                updatedAt: '2024-02-02T13:00:00Z',
                member: {
                  id: 'm21',
                  name: '小飛',
                  nickname: '飛行愛好者',
                  avatar: null,
                },
              },
            ],
          },
          {
            id: 'q4-2',
            title: '你認為人類應該如何保護野生動物？',
            hint: '想想我們可以為動物做什麼',
            answers: [
              {
                id: 'a4-4',
                content:
                  '我們應該保護動物的棲息地，不要破壞森林和草原，讓它們有地方可以生活。',
                likesCount: 68,
                createdAt: '2024-02-02T14:30:00Z',
                updatedAt: '2024-02-02T14:30:00Z',
                member: {
                  id: 'm22',
                  name: '小保',
                  nickname: '環境守護者',
                  avatar: null,
                },
              },
            ],
          },
          {
            id: 'q4-3',
            title: '你最想和哪種動物做朋友？',
            hint: '想想你喜歡的動物',
            answers: [
              {
                id: 'a4-5',
                content:
                  '我想和狗狗做朋友！它們很忠誠，而且很聰明，可以陪我玩。',
                likesCount: 55,
                createdAt: '2024-02-02T16:00:00Z',
                updatedAt: '2024-02-02T16:00:00Z',
                member: {
                  id: 'm23',
                  name: '小忠',
                  nickname: '動物朋友',
                  avatar: null,
                },
              },
              {
                id: 'a4-6',
                content: '我想和貓咪做朋友！它們很可愛，而且很獨立，感覺很酷。',
                likesCount: 49,
                createdAt: '2024-02-02T17:20:00Z',
                updatedAt: '2024-02-02T17:20:00Z',
                member: {
                  id: 'm24',
                  name: '小貓',
                  nickname: '貓咪愛好者',
                  avatar: null,
                },
              },
            ],
          },
        ],
      },
      {
        id: '5',
        slug: 'technology-and-future',
        title: '科技與未來',
        publishedDate: '2024-02-05T16:00:00Z',
        heroImage: {
          resized: {
            medium:
              'https://kids-storage.twreporter.org/images/6a381d2a-44e5-416f-afb5-60e3fbd98738.png',
          },
        },
        subSubcategoriesOrdered: [
          { name: '科技' },
          { name: '創新' },
          { name: '未來' },
        ],
        questions: [
          {
            id: 'q5-1',
            title: '你覺得未來的科技會如何改變我們的生活？',
            hint: '想想現在已經有的科技，未來會怎麼發展',
            answers: [
              {
                id: 'a5-1',
                content:
                  '我覺得會有更多機器人幫我們做家事，讓我們有更多時間做自己喜歡的事。',
                likesCount: 71,
                createdAt: '2024-02-06T08:00:00Z',
                updatedAt: '2024-02-06T08:00:00Z',
                member: {
                  id: 'm25',
                  name: '小創',
                  nickname: '科技夢想家',
                  avatar: null,
                },
              },
              {
                id: 'a5-2',
                content:
                  '我希望未來的交通工具更環保，比如用太陽能或電能，這樣就不會污染環境了。',
                likesCount: 68,
                createdAt: '2024-02-06T09:30:00Z',
                updatedAt: '2024-02-06T09:30:00Z',
                member: {
                  id: 'm26',
                  name: '小綠',
                  nickname: '環保科技',
                  avatar: null,
                },
              },
              {
                id: 'a5-3',
                content:
                  '未來的醫療科技會更發達，可以治療更多疾病，讓大家更健康。',
                likesCount: 65,
                createdAt: '2024-02-06T10:15:00Z',
                updatedAt: '2024-02-06T10:15:00Z',
                member: {
                  id: 'm27',
                  name: '小醫',
                  nickname: '健康守護者',
                  avatar: null,
                },
              },
            ],
          },
          {
            id: 'q5-2',
            title: '你希望發明什麼新科技？',
            hint: '想想什麼可以讓生活更便利或有趣',
            answers: [
              {
                id: 'a5-4',
                content:
                  '我想發明一個可以翻譯所有動物語言的機器，這樣就能知道小貓小狗在想什麼了！',
                likesCount: 82,
                createdAt: '2024-02-06T11:00:00Z',
                updatedAt: '2024-02-06T11:00:00Z',
                member: {
                  id: 'm28',
                  name: '小奇',
                  nickname: '發明小天才',
                  avatar: null,
                },
              },
            ],
          },
          {
            id: 'q5-3',
            title: '你認為科技發展有什麼需要注意的地方？',
            hint: '想想科技可能帶來的問題',
            answers: [
              {
                id: 'a5-5',
                content: '我們要注意保護環境，不能為了發展科技而破壞大自然。',
                likesCount: 74,
                createdAt: '2024-02-06T13:00:00Z',
                updatedAt: '2024-02-06T13:00:00Z',
                member: {
                  id: 'm29',
                  name: '小環',
                  nickname: '環保先鋒',
                  avatar: null,
                },
              },
              {
                id: 'a5-6',
                content:
                  '要確保科技是為了幫助人類，而不是取代人類，我們還是要保留人與人之間的溫暖。',
                likesCount: 69,
                createdAt: '2024-02-06T14:30:00Z',
                updatedAt: '2024-02-06T14:30:00Z',
                member: {
                  id: 'm30',
                  name: '小溫',
                  nickname: '人文關懷者',
                  avatar: null,
                },
              },
            ],
          },
        ],
      },
    ],
    nextCursor: 'cursor_12345',
  }
