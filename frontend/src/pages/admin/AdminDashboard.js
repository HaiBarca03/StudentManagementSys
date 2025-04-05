import { useState } from 'react'
import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppBar, Drawer } from '../../components/styles'
import Logout from '../Logout'
import SideBar from './SideBar'
import AdminProfile from './AdminProfile'
import AdminHomePage from './AdminHomePage'

import AddStudent from './studentRelated/AddStudent'
import SeeComplains from './studentRelated/SeeComplains'
import ShowStudents from './studentRelated/ShowStudents'
import StudentAttendance from './studentRelated/StudentAttendance'
import StudentExamMarks from './studentRelated/StudentExamMarks'
import ViewStudent from './studentRelated/ViewStudent'

import AddNotice from './noticeRelated/AddNotice'
import ShowNotices from './noticeRelated/ShowNotices'

import ShowSubjects from './subjectRelated/ShowSubjects'
import SubjectForm from './subjectRelated/SubjectForm'
import ViewSubject from './subjectRelated/ViewSubject'

import AddTeacher from './teacherRelated/AddTeacher'
import ChooseClass from './teacherRelated/ChooseClass'
import ChooseSubject from './teacherRelated/ChooseSubject'
import ShowTeachers from './teacherRelated/ShowTeachers'
import TeacherDetails from './teacherRelated/TeacherDetails'

import AddClass from './classRelated/AddClass'
import ClassDetails from './classRelated/ClassDetails'
import ShowClasses from './classRelated/ShowClasses'
import AccountMenu from '../../components/AccountMenu'
import ForumHomePage from '../forum/forumHomePage'
import ForumPostDetailPage from '../forum/forumPostDetailPage'
import CreatePostForum from '../../components/forum/create-post-forum'
import TopicDashboard from '../../components/forum/topic-dashboard'
import NewsDashboard from './newsDashboard'
import MyArticlePage from '../forum/myArticlePage'
import EditArticlePage from '../forum/editArticlePage'
import NewsByTopicPage from '../forum/newsByTopicPage'

const AdminDashboard = () => {
  const [open, setOpen] = useState(false)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar open={open} position="absolute">
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' })
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{
                flexGrow: 1,
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontSize: '1.25rem',
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            >
              TRANG QUẢN TRỊ
            </Typography>
            <AccountMenu />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={open ? styles.drawerStyled : styles.hideDrawer}
        >
          <Toolbar sx={styles.toolBarStyled}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <SideBar />
          </List>
        </Drawer>
        <Box component="main" sx={styles.boxStyled}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<AdminHomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/Admin/dashboard" element={<AdminHomePage />} />
            <Route path="/Admin/profile" element={<AdminProfile />} />
            <Route path="/Admin/complains" element={<SeeComplains />} />

            {/* Forum */}
            <Route path="/forum" element={<ForumHomePage />} />
            <Route path="/forum/post/:id" element={<ForumPostDetailPage />} />
            <Route path="/forum/news/:id" element={<ForumPostDetailPage />} />
            <Route path="/forum/edit-news/:id" element={<EditArticlePage />} />
            <Route
              path="/forum/trendding-news/:id"
              element={<ForumPostDetailPage />}
            />
            <Route path="/forum/create/post" element={<CreatePostForum />} />
            <Route path="/forum/topic/dashboard" element={<TopicDashboard />} />
            <Route path="/forum/news/my-article" element={<MyArticlePage />} />
            <Route
              path="/forum/news-by-topic/:id"
              element={<NewsByTopicPage />}
            />
            <Route path="/forum/news/dashboard" element={<NewsDashboard />} />
            {/* Notice */}
            <Route path="/Admin/addnotice" element={<AddNotice />} />
            <Route path="/Admin/notices" element={<ShowNotices />} />

            {/* Subject */}
            <Route path="/Admin/subjects" element={<ShowSubjects />} />
            <Route
              path="/Admin/subjects/subject/:classID/:subjectID"
              element={<ViewSubject />}
            />
            <Route
              path="/Admin/subjects/chooseclass"
              element={<ChooseClass situation="Subject" />}
            />

            <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
            <Route
              path="/Admin/class/subject/:classID/:subjectID"
              element={<ViewSubject />}
            />

            <Route
              path="/Admin/subject/student/attendance/:studentID/:subjectID"
              element={<StudentAttendance situation="Subject" />}
            />
            <Route
              path="/Admin/subject/student/marks/:studentID/:subjectID"
              element={<StudentExamMarks situation="Subject" />}
            />

            {/* Class */}
            <Route path="/Admin/addclass" element={<AddClass />} />
            <Route path="/Admin/classes" element={<ShowClasses />} />
            <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
            <Route
              path="/Admin/class/addstudents/:id"
              element={<AddStudent situation="Class" />}
            />

            {/* Student */}
            <Route
              path="/Admin/addstudents"
              element={<AddStudent situation="Student" />}
            />
            <Route path="/Admin/students" element={<ShowStudents />} />
            <Route
              path="/Admin/students/student/:id"
              element={<ViewStudent />}
            />
            <Route
              path="/Admin/students/student/attendance/:id"
              element={<StudentAttendance situation="Student" />}
            />
            <Route
              path="/Admin/students/student/marks/:id"
              element={<StudentExamMarks situation="Student" />}
            />

            {/* Teacher */}
            <Route path="/Admin/teachers" element={<ShowTeachers />} />
            <Route
              path="/Admin/teachers/teacher/:id"
              element={<TeacherDetails />}
            />
            <Route
              path="/Admin/teachers/chooseclass"
              element={<ChooseClass situation="Teacher" />}
            />
            <Route
              path="/Admin/teachers/choosesubject/:id"
              element={<ChooseSubject situation="Norm" />}
            />
            <Route
              path="/Admin/teachers/choosesubject/:classID/:teacherID"
              element={<ChooseSubject situation="Teacher" />}
            />
            <Route
              path="/Admin/teachers/addteacher/:id"
              element={<AddTeacher />}
            />

            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Box>
      </Box>
    </>
  )
}

export default AdminDashboard

const styles = {
  boxStyled: {
    backgroundColor: (theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  toolBarStyled: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    px: [1]
  },
  drawerStyled: {
    display: 'flex'
  },
  hideDrawer: {
    display: 'flex',
    '@media (max-width: 600px)': {
      display: 'none'
    }
  }
}
