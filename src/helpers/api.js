import axios from 'axios'
import { useUserStore } from '@/stores/user'

// DEVTODO:
// use this for dev
// const baseURL = '/api'
// use this for prod
const baseURL = 'https://api.amigurume.me'

export async function loginUser(username = null, password = null) {
  const userStore = useUserStore()
  let response
  try {
    if (!username || !password) {
      // using code copied from ChatGPT https://chatgpt.com/c/691342fc-371c-832d-8eb1-71fcadf5972f
      response = await axios.get(`${baseURL}/user/refresh`, { withCredentials: true })
    } else {
      // using code copied from ChatGPT https://chatgpt.com/c/6931f18d-5adc-832b-9dfd-92684712c285
      response = await axios.post(
        `${baseURL}/user/log-in`,
        {
          username,
          password,
        },
        { withCredentials: true },
      )
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message)
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
    await axios.get(`${baseURL}/user/log-out`, {
      withCredentials: true,
      headers: {
        Authorization: userStore.authHeader,
      },
    })
  } catch (error) {
    console.log(error)
    // failure (perhaps expired access token?)
    // try again without access token
    try {
      // using code copied from ChatGPT for this axios.get(...) call https://chatgpt.com/c/691342fc-371c-832d-8eb1-71fcadf5972f
      await axios.get(`${baseURL}/user/log-out`, {
        withCredentials: true,
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

export async function authCall(
  route,
  router,
  method = 'get',
  body = null,
  headers = {},
  recurred = false,
) {
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
    const res = await axios({
      baseURL,
      method,
      url: route,
      data: body,
      headers: { Authorization: userStore.authHeader, ...headers },
    })
    return res.data
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
        const res = await authCall(route, router, method, body, headers, true)
        return res
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
