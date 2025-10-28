import type { Session } from './keystone-session'
import type { Context as _Context } from '.keystone/types'

type Context = _Context<Session>

export type { Context }
