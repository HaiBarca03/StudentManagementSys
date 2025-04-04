// forumHandle.js
import axios from 'axios'
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  stuffDone,
  getNewsUserSuccess,
  getNewDetailSuccess,
  getNewsTopicSuccess,
  getDetailTopicSuccess
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

export const shareNews = (newsId) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/news/${newsId}/share`,
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

export const getNewsByUser = (status) => async (dispatch) => {
  dispatch(getRequest())
  try {
    let url = `${process.env.REACT_APP_BASE_URL}/api/news/user`
    if (status !== undefined) {
      url += `?status=${status}`
    }

    const result = await axios.get(url, getAuthConfig())

    if (result.data?.error) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getNewsUserSuccess(result.data))
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

export const getNewsByTopic = (id) => async (dispatch) => {
  dispatch(getRequest())
  try {
    let url = `${process.env.REACT_APP_BASE_URL}/api/news/topic/${id}`

    const result = await axios.get(url, getAuthConfig())

    if (result.data?.error) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getNewsTopicSuccess(result.data))
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

export const getDetailTopic = (id) => async (dispatch) => {
  dispatch(getRequest())
  try {
    let url = `${process.env.REACT_APP_BASE_URL}/topic/${id}`

    const result = await axios.get(url, getAuthConfig())

    if (result.data?.error) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getDetailTopicSuccess(result.data))
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

export const getNewsDetail = (id) => async (dispatch) => {
  dispatch(getRequest())
  try {
    let url = `${process.env.REACT_APP_BASE_URL}/api/news/${id}`

    const result = await axios.get(url, getAuthConfig())

    if (result.data?.error) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getNewDetailSuccess(result.data))
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

export const deleteNew = (newId) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/api/news/${newId}`,
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

export const deleteImageNew = (newId, imageId) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/api/news/${newId}/image/${imageId}`,
      getAuthConfig()
    )
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getSuccess(result.data))
    }
  } catch (error) {
    dispatch(getError(error))
  }
}

export const updateNew = (id, data) => async (dispatch) => {
  dispatch(getRequest())
  const token = localStorage.getItem('token')
  const config = {
    headers: {
      token: `Bearer ${token}`
    }
  }
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/news/${id}`,
      data,
      config
    )

    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch({ type: 'news/updateSuccess', payload: result.data })
    }
  } catch (error) {
    dispatch(getError(error))
  }
}
