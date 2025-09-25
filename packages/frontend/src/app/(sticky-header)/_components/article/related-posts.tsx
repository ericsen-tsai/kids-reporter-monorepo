import PostSlider, { PostSliderProp } from '@/components/post-slider'

export const RelatedPosts = (props: PostSliderProp) => {
  return (
    props?.posts?.length > 0 && (
      <div
        style={{ width: '95vw' }}
        className="flex flex-col items-center justify-center px-0 py-12"
      >
        <img
          className="mb-4 h-20 w-full"
          src="/assets/images/post-related-post-title.svg"
          alt="相關文章"
          loading="lazy"
        />
        <PostSlider {...props} />
      </div>
    )
  )
}

export default RelatedPosts
