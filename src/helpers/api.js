import axios from 'axios'
import { useUserStore } from '@/stores/user'

const baseURL = '/api'

export async function loginUser(username = null, password = null) {
  const userStore = useUserStore()
  let response
  try {
    if (!username || !password) {
      // using code copied from ChatGPT https://chatgpt.com/c/691342fc-371c-832d-8eb1-71fcadf5972f
      response = await axios.get(`${baseURL}/user/refresh`, { withCredentials: true })
    } else {
      response = await axios.post(`${baseURL}/user/log-in`, {
        username,
        password,
      })
    }
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

export async function logoutUser(router) {
  const userStore = useUserStore()
  try {
    // attempt to log out both tokens
    // using code copied from ChatGPT for this axios.get(...) call https://chatgpt.com/c/691342fc-371c-832d-8eb1-71fcadf5972f
    await axios.get(`${baseURL}user/log-out`, {
      headers: {
        withCredentials: true,
        Authorization: userStore.authHeader,
      },
    })
  } catch (error) {
    console.log(error)
    // failure (perhaps expired access token?)
    // try again without access token
    try {
      // using code copied from ChatGPT for this axios.get(...) call https://chatgpt.com/c/691342fc-371c-832d-8eb1-71fcadf5972f
      await axios.get(`${baseURL}user/log-out`, {
        headers: { withCredentials: true },
      })
    } catch (errorTwo) {
      // failure (perhaps a problem with the refresh cookie)
      throw errorTwo
    }
  } finally {
    userStore.logout()
    router.push('/login')
  }
}

export async function authCall(route, router, method = 'get', body = null, recurred = false) {
  const userStore = useUserStore()
  // ensure the user is logged in
  if (!userStore.isLoggedIn) {
    try {
      await loginUser()
    } catch (error) {
      router.push('/login')
      throw error
    }
  }
  try {
    // attempt authenticated call
    const { data } = await axios({
      baseURL,
      method,
      url: route,
      data: body,
      headers: { Authorization: userStore.authHeader },
    })
    return data
  } catch (error) {
    if (error.response.status === 401) {
      // access token did not work
      try {
        // attempt refresh
        await loginUser()
      } catch (error) {
        // refresh did not work
        logoutUser(router)
        return
      }
      // refresh worked
      if (!recurred) {
        // recur this function (only once)
        return await authCall(route, router, method, body, true)
      } else {
        throw error
      }
    } else {
      // other errors
      // console.log(error.response.data, error.response.status)
      // const cleanError = new Error(error.response.data, error.response.status)
      throw error
    }
  }
}
