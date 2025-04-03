import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material'
import {
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Subject as SubjectIcon,
  Article as ArticleIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HeadForum = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/forum/create/post')}>
            <AddIcon sx={{ mr: 2 }} />
            <ListItemText primary="Bài viết mới" />
          </ListItemButton>
        </ListItem>

        {currentUser?.role === 'Student' && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/forum/news/my-article')}>
              <ArticleIcon sx={{ mr: 2 }} />
              <ListItemText primary="Bài viết của tôi" />
            </ListItemButton>
          </ListItem>
        )}

        {currentUser?.role === 'Admin' && (
          <>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/forum/topic/dashboard')}
              >
                <SubjectIcon sx={{ mr: 2 }} />
                <ListItemText primary="Chủ đề" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/forum/news/dashboard')}>
                <ArticleIcon sx={{ mr: 2 }} />
                <ListItemText primary="Quản lý bài viết" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  )

  return (
    <AppBar position="static" color="default" sx={{ boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{ bgcolor: 'primary.main', mr: 1 }}
              src={currentUser?.images?.[0]?.url ?? ''}
            >
              {!currentUser?.images?.[0]?.url &&
                String(currentUser.name).charAt(0)}
            </Avatar>
            {!isMobile && (
              <>
                <Typography variant="h6">{currentUser?.name}</Typography>
              </>
            )}
          </Box>
        </Box>

        {!isMobile && (
          <TextField
            variant="outlined"
            placeholder="Search Topics"
            size="small"
            sx={{
              mx: 2,
              bgcolor: 'white',
              borderRadius: '5px',
              width: '250px'
            }}
            InputProps={{
              endAdornment: <SearchIcon />
            }}
          />
        )}

        {!isMobile ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="success"
              sx={{ mr: 2 }}
              onClick={() => navigate('/forum/create/post')}
            >
              Bài viết mới
            </Button>
            {currentUser?.role === 'Student' && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => navigate('/forum/news/my-article')}
              >
                Bài viết của tôi
              </Button>
            )}
            {currentUser?.role === 'Admin' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mr: 2 }}
                  onClick={() => navigate('/forum/news/dashboard')}
                >
                  Quản lý bài viết
                </Button>
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
                  color="primary"
                  sx={{ mr: 2 }}
                  onClick={() => navigate('/forum/news/my-article')}
                >
                  Bài viết của tôi
                </Button>
              </>
            )}
          </Box>
        ) : (
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
        )}
      </Toolbar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 }
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  )
}

export default HeadForum
