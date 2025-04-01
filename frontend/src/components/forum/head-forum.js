import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Subject as SubjectIcon,
  Article as ArticleIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HeadForum = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/forum/create/post')}>
            <AddIcon sx={{ mr: 2 }} />
            <ListItemText primary="Bài viết mới" />
          </ListItemButton>
        </ListItem>
        
        {currentUser?.role === 'Admin' && (
          <>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/forum/topic/dashboard')}>
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
  );

  return (
    <AppBar
      position="static"
      color="default"
      sx={{ boxShadow: 1 }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Brand/Account */}
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
            <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>B</Avatar>
            {!isMobile && (
              <>
                <Typography variant="h6">Tài khoản</Typography>
                <IconButton onClick={handleMenuOpen}>
                  <ArrowDropDownIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        {/* Middle - Search (hidden on mobile) */}
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

        {/* Right side - Buttons/Avatar */}
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
                  color="success"
                  sx={{ mr: 2 }}
                  onClick={() => navigate('/forum/news/dashboard')}
                >
                  Quản lý bài viết
                </Button>
              </>
            )}

            <Avatar src="https://i.pravatar.cc/40" />
          </Box>
        ) : (
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
        )}

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

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default HeadForum;