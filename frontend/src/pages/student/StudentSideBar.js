import * as React from 'react'
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

import HomeIcon from '@mui/icons-material/Home'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined'
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ForumSideBar from '../forum/forumSideBar'

const StudentSideBar = () => {
  const location = useLocation()
  return (
    <>
      <React.Fragment>
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <HomeIcon
              color={
                location.pathname === ('/' || '/Student/dashboard')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Trang chủ" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/subjects">
          <ListItemIcon>
            <AssignmentIcon
              color={
                location.pathname.startsWith('/Student/subjects')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Môn học" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/attendance">
          <ListItemIcon>
            <ClassOutlinedIcon
              color={
                location.pathname.startsWith('/Student/attendance')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Điểm danh" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/complain">
          <ListItemIcon>
            <AnnouncementOutlinedIcon
              color={
                location.pathname.startsWith('/Student/complain')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Phản ánh" />
        </ListItemButton>
        <ForumSideBar />
      </React.Fragment>
      <Divider sx={{ my: 1 }} />
      <React.Fragment>
        <ListSubheader component="div" inset>
          Người dùng
        </ListSubheader>
        <ListItemButton component={Link} to="/Student/profile">
          <ListItemIcon>
            <AccountCircleOutlinedIcon
              color={
                location.pathname.startsWith('/Student/profile')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Trang cá nhân" />
        </ListItemButton>
        <ListItemButton component={Link} to="/logout">
          <ListItemIcon>
            <ExitToAppIcon
              color={
                location.pathname.startsWith('/logout') ? 'primary' : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </ListItemButton>
      </React.Fragment>
    </>
  )
}

export default StudentSideBar
