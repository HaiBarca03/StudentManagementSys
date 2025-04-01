import React, { useState } from 'react'
import HeadForum from '../../components/forum/head-forum'
import MainForum from '../../components/forum/main-forum'
import TrenddingPost from '../../components/forum/trendding-post'
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material'
import NewPosts from '../../components/forum/news-post'
import CreatePostForum from '../../components/forum/create-post-forum'
import TopicForum from '../../components/forum/topic-forum'
import { useSelector } from 'react-redux'
import TopicDashboard from '../../components/forum/topic-dashboard'

const ForumHomePage = () => {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showCreateTopic, setShowCreateTopic] = useState(false)
  const { currentUser } = useSelector((state) => state.user)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default
      }}
    >
      {/* Header Forum */}
      <HeadForum
        onOpenCreatePost={() => setShowCreatePost(true)}
        onOpenCreateTopic={
          currentUser?.role === 'Admin'
            ? () => setShowCreateTopic(true)
            : undefined
        }
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          maxWidth: '1440px',
          width: '100%',
          mx: 'auto',
          px: { xs: 1, sm: 2, md: 3 },
          py: 2
        }}
      >
        <Grid container spacing={isMobile ? 1 : 2}>
          {/* Main Column (Topics + Posts) */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 1 : 2
            }}
          >
            {/* Sticky Topic Header */}
            <Box
              sx={{
                position: 'sticky',
                top: isMobile ? 56 : 64, // AppBar height
                zIndex: 10,
                backgroundColor: 'background.paper',
                py: 1,
                boxShadow: isMobile ? theme.shadows[1] : 'none',
                mb: 1
              }}
            >
              <TopicForum />
            </Box>

            {/* Posts List */}
            <Box
              sx={{
                flexGrow: 1,
                minHeight: 0, // Prevent overflow
                overflow: 'hidden'
              }}
            >
              <MainForum />
            </Box>
          </Grid>

          {/* Sidebar Column (Trending + New Posts) */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 1 : 2,
              height: isDesktop ? 'calc(100vh - 64px)' : 'auto',
              overflowY: isDesktop ? 'auto' : 'visible',
              position: isDesktop ? 'sticky' : 'static',
              top: isDesktop ? 64 : 'auto',
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.action.hover,
                borderRadius: '3px'
              }
            }}
          >
            <TrenddingPost />
            <NewPosts />
          </Grid>
        </Grid>
      </Box>

      {/* Create Post Modal */}
      {showCreatePost && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: theme.zIndex.modal,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1, sm: 2 },
            overflow: 'auto' // Allow scrolling inside modal if needed
          }}
        >
          <CreatePostForum
            onSubmit={() => setShowCreatePost(false)}
            onClose={() => setShowCreatePost(false)}
            sx={{
              maxHeight: '90vh',
              overflowY: 'auto',
              width: '100%',
              maxWidth: { xs: '95%', sm: '600px' }
            }}
          />
        </Box>
      )}

      {/* Create Topic Modal */}
      {showCreateTopic && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: theme.zIndex.modal,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1, sm: 2 },
            overflow: 'auto' // Allow scrolling inside modal if needed
          }}
        >
          <TopicDashboard
            onSubmit={() => setShowCreateTopic(false)}
            onClose={() => setShowCreateTopic(false)}
            sx={{
              maxHeight: '90vh',
              overflowY: 'auto',
              width: '100%',
              maxWidth: { xs: '95%', md: '800px' }
            }}
          />
        </Box>
      )}
    </Box>
  )
}
export default ForumHomePage
