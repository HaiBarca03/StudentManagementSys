import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  commentList: [],
  childComments: [],
  loading: false,
  error: null,
  response: null
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    getSuccess: (state, action) => {
      state.commentList = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getChildCommentSuccess: (state, action) => {
      state.childComments = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getFailed: (state, action) => {
      state.response = action.payload
      state.loading = false
      state.error = null
    },
    getError: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    stuffDone: (state) => {
      state.loading = false
      state.error = null
      state.response = null
      state.statestatus = 'added'
    }
  }
})

export const {
  getRequest,
  getSuccess,
  getFailed,
  stuffDone,
  getError,
  getChildCommentSuccess
} = commentSlice.actions

export const commentReducer = commentSlice.reducer
