import axios from 'axios'
import { useUserStore } from '@/stores/user'

const baseURL = '/api'

// TODO: DRY THESE 2 FUNCS
export async function loginUser(username, password) {
  const userStore = useUserStore()
  let response
  try {
    response = await axios.post(`${baseURL}/user/log-in`, {
      username,
      password,
    })
  } catch (error) {
    throw new Error(error.response.data.message)
  }
  if (response.data.clearance !== 'admin') {
    throw new Error('You must be an admin to access this site.')
  }
  userStore.access = response.data.access
  userStore.username = response.data.username
  return response
}

export async function refreshUser() {
  let response
  try {
    // using code copied from ChatGPT https://chatgpt.com/c/691342fc-371c-832d-8eb1-71fcadf5972f
    response = await axios.get(`${baseURL}/user/refresh`, { withCredentials: true })
  } catch (error) {
    // TODO: redirect
    throw new Error(error.response.data.message)
  }
  if (response.data.clearance !== 'admin') {
    // TODO: redirect
    throw new Error('You must be an admin to access this site.')
  }
  userStore.access = response.data.access
  userStore.username = response.data.username
  return response
}

export async function logoutUser() {
  const res = authCall('user/log-out', 'get', null, true)
  const userStore = useUserStore()
  userStore.logout()
  // TODO: redirect
  return res
}

export async function authCall(route, method = 'get', body = null, sendRefresh = false) {
  const userStore = useUserStore()
  if (!userStore.access) throw new Error('access must not be null')
  try {
    const { data } = await axios({
      baseURL,
      method,
      url: route,
      data: body,
      // using code copied from ChatGPT https://chatgpt.com/c/691342fc-371c-832d-8eb1-71fcadf5972f
      headers: { Authorization: userStore.authHeader, withCredentials: sendRefresh },
    })
    return data
  } catch (error) {
    // console.log(error.response.data, error.response.status)
    // const cleanError = new Error(error.response.data, error.response.status)
    throw error
  }
}
