import axios from 'axios'
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getChildCommentSuccess
} from './commentSlice'

// comment
export const getCommentByNews = (commentId) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/comment/news/${commentId}`
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

export const getCommentChild = (parentId) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/comment/parent-comment/${parentId}`
    )
    console.log('result', result)
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getChildCommentSuccess(result.data))
    }
  } catch (error) {
    dispatch(getError(error))
  }
}

export const createComment = (data) => async (dispatch) => {
  dispatch(getRequest())

  try {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        token: `Bearer ${token}`
      }
    }

    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/comment`,
      data,
      config
    )

    console.log(result.data)
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch({ type: 'comment/createSuccess', payload: result.data })
    }
  } catch (error) {
    dispatch(getError(error))
  }
}

export const deleteComment = (id) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        token: `Bearer ${token}`
      }
    }
    const result = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/comment/${id}`,
      config
    )
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getChildCommentSuccess(result.data))
    }
  } catch (error) {
    dispatch(getError(error))
  }
}

export const deleteImageComment = (commentId, imageId) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        token: `Bearer ${token}`
      }
    }
    const result = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/comment/${commentId}/image/${imageId}`,
      config
    )
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch(getChildCommentSuccess(result.data))
    }
  } catch (error) {
    dispatch(getError(error))
  }
}

export const updateComment = (id, data) => async (dispatch) => {
  dispatch(getRequest())

  try {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        token: `Bearer ${token}`
      }
    }

    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/comment/${id}`,
      data,
      config
    )

    console.log(result.data)
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch({ type: 'comment/updateSuccess', payload: result.data })
    }
  } catch (error) {
    dispatch(getError(error))
  }
}

export const like = (commentId) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        token: `Bearer ${token}`
      }
    }

    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/comment/like/${commentId}`,
      null,
      config
    )

    console.log(result.data)
    if (result.data.message) {
      dispatch(getFailed(result.data.message))
    } else {
      dispatch({ type: 'comment/createSuccess', payload: result.data })
    }
  } catch (error) {
    dispatch(getError(error))
  }
}
