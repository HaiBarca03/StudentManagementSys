import axios from 'axios'
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  stuffDone
} from './forumSlice'

// topic related
export const getAllTopic = (id) => async (dispatch) => {
  dispatch(getRequest())

  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/topic`)
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getSuccess(result.data))
    }
  } catch (error) {
    dispatch(getError(error))
  }
}

export const createTopic = (data) => async (dispatch) => {
  dispatch(getRequest())

  try {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        token: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/topic`,
      data,
      config
    )

    console.log(result.data)
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getSuccess(result.data))
    }
  } catch (error) {
    dispatch(getError(error))
  }
}

export const updateTopic = (topicId, data) => async (dispatch) => {
  dispatch(getRequest())

  try {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        token: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/topic/${topicId}`,
      data,
      config
    )

    dispatch(getSuccess(response.data))
  } catch (error) {
    dispatch(getFailed(error.response?.data?.message || 'Cập nhật thất bại'))
  }
}

export const deleteTopic = (topicId) => async (dispatch) => {
  dispatch(getRequest())

  try {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        token: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    console.log(token)
    const result = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/topic/${topicId}`,
      config
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
