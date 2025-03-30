import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton
} from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ShareIcon from '@mui/icons-material/Share'

const posts = [
  {
    id: '67de95f4c1129f45f0d60386',
    author: 'Punit Bhatia',
    title: '3 steps for data transfers according to GDPR',
    date: '31 Aug, 2018',
    excerpt:
      'The EU General Data Protection Regulation (GDPR) is a significant legislation in the field of personal data privacy...',
    tags: ['GDPR', 'Knowledge', 'Course', 'Online'],
    comments: 30,
    likes: 51,
    shares: 16
  },
  {
    id: 2,
    author: 'Punit Bhatia',
    title: 'Understanding the Lead Supervisory Authority concept in GDPR',
    date: '31 Aug, 2018',
    excerpt:
      'This article focuses on a new instrument which could be defined as half audit and half project management...',
    comments: 80,
    likes: 51,
    shares: 16
  }
]

const MainForum = () => {
  const navigate = useNavigate()

  const handleClick = (id) => {
    navigate(`/forum/post/${id}`)
  }

  return (
    <>
      {posts.map((post) => (
        <Card
          key={post.id}
          sx={{ marginBottom: 2, padding: 2, cursor: 'pointer' }}
          onClick={() => handleClick(post.id)}
        >
          <CardContent>
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Avatar sx={{ marginRight: 1 }}>P</Avatar>
              <Typography variant="body2">
                {post.author} - {post.date}
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {post.excerpt}
            </Typography>
            <Box display="flex" gap={1} marginBottom={1}>
              {post.tags?.map((tag, index) => (
                <Chip key={index} label={tag} color="success" size="small" />
              ))}
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton>
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Typography variant="body2">{post.comments}</Typography>
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
        </Card>
      ))}
    </>
  )
}

export default MainForum
