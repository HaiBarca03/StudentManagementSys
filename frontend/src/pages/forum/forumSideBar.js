import React from 'react'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import ForumIcon from '@mui/icons-material/Forum'

const ForumSideBar = () => {
  const location = useLocation()
  return (
    <>
      <React.Fragment>
        <ListItemButton component={Link} to="/forum">
          <ListItemIcon>
            <ForumIcon
              color={location.pathname === '/forum' ? 'primary' : 'inherit'}
            />
          </ListItemIcon>
          <ListItemText primary="Diễn đàn" />
        </ListItemButton>
      </React.Fragment>
    </>
  )
}

export default ForumSideBar
