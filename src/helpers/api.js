import axios from 'axios'
import { useUserStore } from '@/stores/user'

const baseURL = 'https://api.amigurume.me'

export async function loginUser(username, password) {
  const userStore = useUserStore()
  let response
  try {
    response = await axios.post('https://api.amigurume.me/user/log-in', {
      username,
      password,
    })
  } catch (error) {
    throw new Error(error.response.data.message)
  }
  if (response.data.clearance !== 'admin') {
    throw new Error('You must be an admin to access this site.')
  }
  userStore.access = response.data.tokens.access
  userStore.username = response.data.username
  return response
}

export async function authCall(route, method = 'get', body = null) {
  const userStore = useUserStore()
  if (!userStore.access) throw new Error('access must not be null')
  try {
    const { data } = await axios({
      baseURL,
      method,
      url: route,
      data: body,
      headers: { Authorization: userStore.authHeader },
    })
    return data
  } catch (error) {
    console.log(error.response.data, error.response.status)
    throw error
  }
}
