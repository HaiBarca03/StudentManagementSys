import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  forumList: [],
  newsByUser: [],
  articleDetail: [],
  articleByTopic: [],
  topicDetail: [],
  loading: false,
  error: null,
  response: null
}

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    getSuccess: (state, action) => {
      state.forumList = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getNewsUserSuccess: (state, action) => {
      state.newsByUser = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getNewDetailSuccess: (state, action) => {
      state.articleDetail = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getNewsTopicSuccess: (state, action) => {
      state.articleByTopic = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getDetailTopicSuccess: (state, action) => {
      state.topicDetail = action.payload
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
  getNewsUserSuccess,
  getNewDetailSuccess,
  getNewsTopicSuccess,
  getDetailTopicSuccess
} = forumSlice.actions

export const forumReducer = forumSlice.reducer
