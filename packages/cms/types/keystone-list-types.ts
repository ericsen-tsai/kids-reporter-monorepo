import type { TypeInfo } from './keystone-type-info'

export type ListType<T extends keyof TypeInfo['lists']> = TypeInfo['lists'][T]
