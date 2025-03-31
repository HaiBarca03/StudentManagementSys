// forumHandle.js
import axios from 'axios'
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  stuffDone
} from './forumSlice'

// Consistent header configuration
const getAuthConfig = (isMultipart = false) => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authentication token found')
  }
  return {
    headers: {
      token: `Bearer ${token}`,
      ...(isMultipart
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' })
    }
  }
}

// Topic related actions
export const getAllTopic = () => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/topic`,
      getAuthConfig()
    )
    if (result.data?.error) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getSuccess(result.data))
    }
  } catch (error) {
    dispatch(
      getError({
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      })
    )
  }
}

export const createTopic = (data) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/topic`,
      data,
      getAuthConfig()
    )

    if (result.data?.error) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getSuccess(result.data))
    }
  } catch (error) {
    dispatch(
      getError({
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      })
    )
  }
}

export const updateTopic = (topicId, data) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/topic/${topicId}`,
      data,
      getAuthConfig()
    )
    dispatch(getSuccess(response.data))
  } catch (error) {
    dispatch(getFailed(error.response?.data?.message || 'Cập nhật thất bại'))
  }
}

export const deleteTopic = (topicId) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/topic/${topicId}`,
      getAuthConfig()
    )

    if (result.data?.error) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getSuccess(result.data))
    }
  } catch (error) {
    dispatch(
      getError({
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      })
    )
  }
}

export const createNews = (data) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/news`,
      data,
      getAuthConfig(true)
    )

    if (result.data?.error) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getSuccess(result.data))
    }
  } catch (error) {
    dispatch(
      getError({
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      })
    )
  }
}

export const likeNews = (newsId) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/news/${newsId}/like`,
      null,
      getAuthConfig(true)
    )

    if (result.data?.error) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getSuccess(result.data))
    }
  } catch (error) {
    dispatch(
      getError({
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      })
    )
  }
}
