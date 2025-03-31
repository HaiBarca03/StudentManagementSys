import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HeadForum = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar
      position="static"
      color="default"
      sx={{ boxShadow: 1, padding: '5px' }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', marginRight: 1 }}>B</Avatar>
          Tài khoản
          <IconButton onClick={handleMenuOpen}>
            <ArrowDropDownIcon />
          </IconButton>
        </Typography>

        <TextField
          variant="outlined"
          placeholder="Search Topics"
          size="small"
          sx={{ mr: 2, bgcolor: 'white', borderRadius: '5px', width: '250px' }}
          InputProps={{
            endAdornment: <SearchIcon />
          }}
        />

        <Button
          variant="contained"
          color="success"
          sx={{ mr: 2 }}
          onClick={() => navigate('/forum/create/post')}
        >
          Bài viết mới
        </Button>

        {currentUser?.role === 'Admin' && (
            <>
            <Button
              variant="contained"
              color="success"
              sx={{ mr: 2 }}
              onClick={() => navigate('/forum/topic/dashboard')}
            >
              Chủ đề
            </Button>
            <Button
              variant="contained"
              color="warning"
              sx={{ mr: 2 }}
              onClick={() => navigate('/forum/pending/posts')}
            >
              Duyệt bài
            </Button>
          </>
        )}

        <Avatar src="https://i.pravatar.cc/40" />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Admin</MenuItem>
          <MenuItem onClick={handleMenuClose}>Teacher</MenuItem>
          <MenuItem onClick={handleMenuClose}>Student</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default HeadForum
