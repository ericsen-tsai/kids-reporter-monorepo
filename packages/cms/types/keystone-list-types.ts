import type { TypeInfo } from '.keystone/types'

export type ListType<T extends keyof TypeInfo['lists']> = TypeInfo['lists'][T]
