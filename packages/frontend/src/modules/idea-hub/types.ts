export type PostWithTwoTopLikesAnswersPerQuestionReturnType = {
  posts: Array<{
    id: string
    slug: string | null
    title: string | null
    publishedDate: string | null
    heroImage: {
      resized: {
        medium: string | null
      } | null
    } | null
    subSubcategoriesOrdered: Array<{ name: string | null }>
    questions: Array<{
      id: string
      title: string
      hint: string
      answers: Array<{
        id: string
        content: string
        likesCount: number
        createdAt: string | null
        updatedAt: string | null
        member: {
          id: string
          name: string | null
          nickname: string | null
          avatar: { fileUrl: string } | null
        } | null
      }>
    }>
  }>
  nextCursor: string | null
}
