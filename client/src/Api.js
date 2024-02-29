import axios from 'axios'

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api/v1'
})

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

Api.interceptors.response.use(undefined, async (error) => {
  if (
    error.response.status === 403 &&
    error.response.data.message === 'Invalid token'
  ) {
    try {
      const refresh = await Api.post(
        '/auth/refresh',
        {},
        { withCredentials: true }
      )
      localStorage.setItem('accessToken', refresh.data.accessToken)
      const originalRequest = error.config
      originalRequest.headers.Authorization = `Bearer ${refresh.data.accessToken}`
      return Api(originalRequest)
    } catch (err) {
      await Api.delete('/auth/logout')
      localStorage.removeItem('accessToken')
      this.$router.push('/')
      return Promise.reject(err)
    }
  } else {
    return Promise.reject(error)
  }
})
