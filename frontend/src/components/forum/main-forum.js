import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Grid
} from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ShareIcon from '@mui/icons-material/Share'

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/news`

const MainForum = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(API_URL)
        if (Array.isArray(response.data.news)) {
          setPosts(response.data.news)
        } else {
          console.error('Dữ liệu trả về không hợp lệ:', response.data)
          setPosts([])
        }
      } catch (error) {
        console.error('Lỗi khi tải bài viết:', error)
        setError('Không thể tải bài viết. Vui lòng thử lại.')
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  console.log('Posts:', posts)

  const handleClick = (id) => {
    navigate(`/forum/post/${id}`)
  }

  if (loading) {
    return <Typography>Đang tải dữ liệu...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', my: 2 }}>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post._id}
            sx={{ marginBottom: 2, cursor: 'pointer', boxShadow: 3 }}
            onClick={() => handleClick(post._id)}
          >
            {post.thumbnail?.url ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box
                    component="img"
                    src={post.thumbnail.url}
                    alt={post.title || 'Thumbnail'}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      padding: 2,
                      borderRadius: '8px 0 0 8px'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CardContent sx={{ padding: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Avatar
                        src={post.userId?.avatar || ''}
                        sx={{ marginRight: 1 }}
                      >
                        {post.userId?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="body2">
                        {post.userId?.name || 'Người dùng ẩn danh'} -{' '}
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {post.title || 'Không có tiêu đề'}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      paragraph
                      sx={{ mb: 1 }}
                    >
                      {post.summary || 'Không có mô tả'}
                    </Typography>
                    <Box display="flex" gap={1} mb={1}>
                      {Array.isArray(post.tags) &&
                        post.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            color="success"
                            size="small"
                          />
                        ))}
                    </Box>
                    <Box display="flex" alignItems="center">
                      <IconButton>
                        <ChatBubbleOutlineIcon />
                      </IconButton>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        {post.comments || 0}
                      </Typography>
                      <IconButton>
                        <ThumbUpAltIcon />
                      </IconButton>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        {post.likes || 0}
                      </Typography>
                      <IconButton>
                        <ShareIcon />
                      </IconButton>
                      <Typography variant="body2">
                        {post.shares || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            ) : (
              <CardContent sx={{ padding: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar
                    src={post.userId?.avatar || ''}
                    sx={{ marginRight: 1 }}
                  >
                    {post.userId?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Typography variant="body2">
                    {post.userId?.name || 'Người dùng ẩn danh'} -{' '}
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {post.title || 'Không có tiêu đề'}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  paragraph
                  sx={{ mb: 1 }}
                >
                  {post.summary || 'Không có mô tả'}
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  {Array.isArray(post.tags) &&
                    post.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        color="success"
                        size="small"
                      />
                    ))}
                </Box>
                <Box display="flex" alignItems="center">
                  <IconButton>
                    <ChatBubbleOutlineIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {post.comments || 0}
                  </Typography>
                  <IconButton>
                    <ThumbUpAltIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {post.likes || 0}
                  </Typography>
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                  <Typography variant="body2">{post.shares || 0}</Typography>
                </Box>
              </CardContent>
            )}
          </Card>
        ))
      ) : (
        <Typography>Không có bài viết nào.</Typography>
      )}
    </Box>
  )
}

export default MainForum