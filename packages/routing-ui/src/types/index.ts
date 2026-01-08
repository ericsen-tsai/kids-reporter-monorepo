export type MenuItem = {
  label: string
  href: string
  subItems?: MenuItem[]
  external?: boolean
  showIcon?: boolean
  icon?: React.ReactNode
}

export type SocialMediaHrefs = readonly string[]
