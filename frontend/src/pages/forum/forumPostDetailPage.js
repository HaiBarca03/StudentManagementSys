import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ShareIcon from '@mui/icons-material/Share'
import TrenddingPost from '../../components/forum/trendding-post'
import NewPosts from '../../components/forum/news-post'
import CommentPost from '../../components/forum/comment-post'
import { useDispatch, useSelector } from 'react-redux'
import { getCommentByNews } from '../../redux/forumRelated/commentHandle'

const posts = [
  {
    id: '67de95f4c1129f45f0d60386',
    author: 'Punit Bhatia',
    title: '3 steps for data transfers according to GDPR',
    date: '31 Aug, 2018',
    content:
      'The EU General Data Protection Regulation (GDPR) is a significant legislation in the field of personal data privacy...',
    tags: ['GDPR', 'Knowledge', 'Course', 'Online'],
    likes: 51,
    shares: 16,
    images: [
      'https://source.unsplash.com/random/800x400/?technology',
      'https://source.unsplash.com/random/800x400/?data'
    ]
  }
]

const ForumPostDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [showComments, setShowComments] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const post = posts.find((p) => p.id === id)
  const { commentList } = useSelector((state) => state.comment)
  useEffect(() => {
    if (id) {
      dispatch(getCommentByNews(id))
    }
  }, [id, dispatch])

  if (!post) {
    return <Typography variant="h6">Post not found!</Typography>
  }
  const handleToggleComments = (id) => {
    setShowComments((prev) => !prev)
    setSelectedPostId(id)
  }

  return (
    <div className="forum-home">
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} md={8}>
          <Box>
            <Card sx={{ marginBottom: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" marginBottom={2}>
                  <Avatar sx={{ marginRight: 1 }}>P</Avatar>
                  <Typography variant="body2">
                    {post.author} - {post.date}
                  </Typography>
                </Box>
                <Typography variant="h4" gutterBottom>
                  {post.title}
                </Typography>
                <Box display="flex" gap={1} marginBottom={2}>
                  {post.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      color="success"
                      size="small"
                    />
                  ))}
                </Box>
                {post.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`Image ${index + 1}`}
                    sx={{ width: '100%', borderRadius: 2, marginBottom: 2 }}
                  />
                ))}
                <Typography variant="body1" paragraph>
                  {post.content}
                </Typography>
                <Box display="flex" alignItems="center">
                  <IconButton onClick={() => handleToggleComments(post.id)}>
                    <ChatBubbleOutlineIcon />
                  </IconButton>
                  <Typography variant="body2">{commentList.length}</Typography>
                  <IconButton>
                    <ThumbUpAltIcon />
                  </IconButton>
                  <Typography variant="body2">{post.likes}</Typography>
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                  <Typography variant="body2">{post.shares}</Typography>
                </Box>
              </CardContent>
              {showComments && (
                <CommentPost comments={commentList} postId={post.id} />
              )}
            </Card>
          </Box>
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
  )
}

export default ForumPostDetailPage
