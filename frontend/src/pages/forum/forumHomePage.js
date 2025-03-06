import React, { useState } from 'react'
import HeadForum from '../../components/forum/head-forum'
import MainForum from '../../components/forum/main-forum'
import TrenddingPost from '../../components/forum/trendding-post'
import { Box, Grid } from '@mui/material'
import NewPosts from '../../components/forum/news-post'
import CreatePostForum from '../../components/forum/create-post-forum'
import TopicForum from '../../components/forum/topic-forum'
import { useSelector } from 'react-redux'
import CreateTopicForum from '../../components/forum/create-topic-forum'
import TopicDashboard from '../../components/forum/topic-dashboard'

const ForumHomePage = () => {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showCreateTopic, setShowCreateTopic] = useState(false)
  const { currentUser } = useSelector((state) => state.user)
  console.log(currentUser.role)
  return (
    <>
      <HeadForum
        onOpenCreatePost={() => setShowCreatePost(true)}
        onOpenCreateTopic={
          currentUser?.role === 'Admin'
            ? () => setShowCreateTopic(true)
            : undefined
        }
      />
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
            <TopicForum />
            <br />
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

      {showCreateTopic && (
        <Box className="create-post-overlay">
          <TopicDashboard onSubmit={() => setShowCreateTopic(false)} />
        </Box>
      )}
    </>
  )
}

export default ForumHomePage
