import { Maybe } from '__generated__/types'

export type DeepPartial<T> = T extends any[]
  ? DeepPartial<T[number]>[]
  : T extends Maybe<object>
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T
