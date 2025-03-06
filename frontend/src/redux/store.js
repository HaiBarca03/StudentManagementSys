import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './userRelated/userSlice'
import { studentReducer } from './studentRelated/studentSlice'
import { noticeReducer } from './noticeRelated/noticeSlice'
import { sclassReducer } from './sclassRelated/sclassSlice'
import { teacherReducer } from './teacherRelated/teacherSlice'
import { complainReducer } from './complainRelated/complainSlice'
import { forumReducer } from './forumRelated/forumSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    student: studentReducer,
    teacher: teacherReducer,
    notice: noticeReducer,
    complain: complainReducer,
    sclass: sclassReducer,
    forum: forumReducer
  }
})

export default store
