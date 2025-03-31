import axios from 'axios'
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  stuffDone
} from './studentSlice'

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

export const getAllStudents = (id) => async (dispatch) => {
  dispatch(getRequest())

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Students/${id}`
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

export const updateStudentFields =
  (id, fields, address) => async (dispatch) => {
    dispatch(getRequest())

    try {
      const result = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/${address}/${id}`,
        fields,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
      if (result.data.message) {
        dispatch(getFailed(result.data.message))
      } else {
        dispatch(stuffDone())
      }
    } catch (error) {
      dispatch(getError(error))
    }
  }

export const updateStudent = (id, data) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/Student/${id}`,
      data
    )
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(stuffDone())
    }
  } catch (error) {
    dispatch(getError(error))
  }
}

export const removeStuff = (id, address) => async (dispatch) => {
  dispatch(getRequest())

  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    )
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(stuffDone())
    }
  } catch (error) {
    dispatch(getError(error))
  }
}
