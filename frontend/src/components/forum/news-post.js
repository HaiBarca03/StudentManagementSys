import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Paper,
  useTheme,
  Divider
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import axios from 'axios'

// Common styling configuration
const cardStyles = (theme) => ({
  bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.100',
  p: 3,
  borderRadius: 2,
  height: '100%',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
})

const headerStyles = {
  fontWeight: 600,
  color: 'text.primary',
  mb: 2,
  pb: 1,
  borderBottom: '1px solid',
  borderColor: 'divider'
}

const listItemStyles = (theme) => ({
  px: 0,
  py: 1.5,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
})

const avatarStyles = (theme) => ({
  bgcolor: theme.palette.primary.main,
  color: theme.palette.getContrastText(theme.palette.primary.main),
  width: 36,
  height: 36,
  fontSize: '0.875rem'
})

const NewsList = ({ posts, title, loading, error }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM, yyyy')
  }
  const onClick = (id) => {
    navigate(`/forum/news/${id}`)
  }
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Paper elevation={0} sx={cardStyles(theme)}>
      <Typography variant="h6" gutterBottom sx={headerStyles}>
        {title}
      </Typography>

      <List disablePadding>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <React.Fragment key={post.slug || post._id}>
              <ListItem
                button
                onClick={() => onClick(post._id)}
                sx={listItemStyles(theme)}
              >
                <ListItemAvatar sx={{ minWidth: 44 }}>
                  <Avatar sx={avatarStyles(theme)}>
                    {post.title.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 500,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {post.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      {formatDate(post.datePosted || post.createdAt)}
                      {post.likes && ` • 👍 ${post.likes}`}
                    </Typography>
                  }
                  sx={{ my: 0 }}
                />
              </ListItem>
              {index < posts.length - 1 && <Divider sx={{ mx: 2 }} />}
            </React.Fragment>
          ))
        ) : (
          <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
            No posts available
          </Typography>
        )}
      </List>
    </Paper>
  )
}
export const NewPosts = () => {
  const [latestNews, setLatestNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/news/latest`
        )
        setLatestNews(response.data.data)
      } catch (err) {
        console.error('Error fetching latest news:', err)
        setError('Failed to load latest news')
      } finally {
        setLoading(false)
      }
    }

    fetchLatestNews()
  }, [])

  return (
    <NewsList
      posts={latestNews}
      title="Latest News"
      loading={loading}
      error={error}
    />
  )
}
export default NewPosts
