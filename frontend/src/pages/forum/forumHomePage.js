import React, { useState } from 'react'
import HeadForum from '../../components/forum/head-forum'
import MainForum from '../../components/forum/main-forum'
import TrenddingPost from '../../components/forum/trendding-post'
import { Box, Grid } from '@mui/material'
import NewPosts from '../../components/forum/news-post'
import CreatePostForum from '../../components/forum/create-post-forum'

const ForumHomePage = () => {
  const [showCreatePost, setShowCreatePost] = useState(false)
  return (
    <>
      <HeadForum onOpenCreatePost={() => setShowCreatePost(true)} />
      <div className="forum-home">
        <Grid
          container
          spacing={2}
          sx={{
            padding: 2,
            '& > .MuiGrid-item': { mt: 2, pt: 0 }
          }}
        >
          <Grid item xs={12} md={8}>
            <MainForum />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 100px)',
              paddingRight: 1
            }}
          >
            <TrenddingPost />
            <br />
            <NewPosts />
          </Grid>
        </Grid>
      </div>

      {showCreatePost && (
        <Box className="create-post-overlay">
          <CreatePostForum onSubmit={() => setShowCreatePost(false)} />
        </Box>
      )}

      <style>
        {`
          .blur-content {
            filter: blur(4px);
            pointer-events: none;
            user-select: none;
          }

          .create-post-overlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 1);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
          }
        `}
      </style>
    </>
  )
}

export default ForumHomePage
