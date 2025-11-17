import envVars from '@/environment-variables'

const getLoginUrl = () => {
  return `${envVars.loginUrl}?destination=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`
}

export default getLoginUrl
