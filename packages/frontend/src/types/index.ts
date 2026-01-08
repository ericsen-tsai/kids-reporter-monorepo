export type Photo = {
  imageFile?: {
    width: number
    height: number
  }
  resized?: {
    small: string
    medium: string
    large: string
  }
}

export type CategorySlug =
  | 'news'
  | 'comics'
  | 'campus'
  | 'listening-news'
  | 'classroom'
