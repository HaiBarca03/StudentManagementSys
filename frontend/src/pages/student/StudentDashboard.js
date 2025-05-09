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
import StudentSideBar from './StudentSideBar'
import { Navigate, Route, Routes } from 'react-router-dom'
import StudentHomePage from './StudentHomePage'
import StudentProfile from './StudentProfile'
import StudentSubjects from './StudentSubjects'
import ViewStdAttendance from './ViewStdAttendance'
import StudentComplain from './StudentComplain'
import Logout from '../Logout'
import AccountMenu from '../../components/AccountMenu'
import { AppBar, Drawer } from '../../components/styles'
import ForumHomePage from '../forum/forumHomePage'
import ForumPostDetailPage from '../forum/forumPostDetailPage'
import CreatePostForum from '../../components/forum/create-post-forum'
import MyArticlePage from '../forum/myArticlePage'
import NewsByTopicPage from '../forum/newsByTopicPage'
import EditArticlePage from '../forum/editArticlePage'

const StudentDashboard = () => {
  const [open, setOpen] = useState(true)
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
              TRANG QUẢN LÝ SINH VIÊN
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
            <StudentSideBar />
          </List>
        </Drawer>
        <Box component="main" sx={styles.boxStyled}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<StudentHomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/Student/dashboard" element={<StudentHomePage />} />
            <Route path="/Student/profile" element={<StudentProfile />} />

            <Route path="/Student/subjects" element={<StudentSubjects />} />
            <Route path="/Student/attendance" element={<ViewStdAttendance />} />
            <Route path="/Student/complain" element={<StudentComplain />} />

            {/* Forum */}
            <Route path="/forum" element={<ForumHomePage />} />
            <Route path="/forum/news/:id" element={<ForumPostDetailPage />} />
            <Route path="/forum/post/:id" element={<ForumPostDetailPage />} />
            <Route path="/forum/edit-news/:id" element={<EditArticlePage />} />
            <Route
              path="/forum/trendding-news/:id"
              element={<ForumPostDetailPage />}
            />
            <Route path="/forum/news/my-article" element={<MyArticlePage />} />
            <Route
              path="/forum/news-by-topic/:id"
              element={<NewsByTopicPage />}
            />
            <Route path="/forum/create/post" element={<CreatePostForum />} />

            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Box>
      </Box>
    </>
  )
}

export default StudentDashboard

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
