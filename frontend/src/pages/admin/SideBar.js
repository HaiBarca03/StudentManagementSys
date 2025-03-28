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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined'
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined'
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined'
import ReportIcon from '@mui/icons-material/Report'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ForumSideBar from '../forum/forumSideBar'

const SideBar = () => {
  const location = useLocation()
  return (
    <>
      <React.Fragment>
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <HomeIcon
              color={
                location.pathname === ('/' || '/Admin/dashboard')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Trang chủ" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/classes">
          <ListItemIcon>
            <ClassOutlinedIcon
              color={
                location.pathname.startsWith('/Admin/classes')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Lớp học" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/subjects">
          <ListItemIcon>
            <AssignmentIcon
              color={
                location.pathname.startsWith('/Admin/subjects')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Môn học" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/teachers">
          <ListItemIcon>
            <SupervisorAccountOutlinedIcon
              color={
                location.pathname.startsWith('/Admin/teachers')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Giảng viên" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/students">
          <ListItemIcon>
            <PersonOutlineIcon
              color={
                location.pathname.startsWith('/Admin/students')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Sinh viên" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/notices">
          <ListItemIcon>
            <AnnouncementOutlinedIcon
              color={
                location.pathname.startsWith('/Admin/notices')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Thông báo" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/complains">
          <ListItemIcon>
            <ReportIcon
              color={
                location.pathname.startsWith('/Admin/complains')
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
        <ListItemButton component={Link} to="/Admin/profile">
          <ListItemIcon>
            <AccountCircleOutlinedIcon
              color={
                location.pathname.startsWith('/Admin/profile')
                  ? 'primary'
                  : 'inherit'
              }
            />
          </ListItemIcon>
          <ListItemText primary="Thông tin" />
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

export default SideBar
