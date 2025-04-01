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
  Grid,
  Pagination
} from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ShareIcon from '@mui/icons-material/Share'

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/news`

const PostList = ({
  posts,
  handleClick,
  page,
  totalPages,
  handlePageChange
}) => {
  // Chia posts thành 2 phần: 4 bài đầu (1 lớn + 3 nhỏ) và phần còn lại
  const featuredPosts = posts.slice(0, 4) // 4 bài đầu
  const remainingPosts = posts.slice(4) // Các bài còn lại

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', my: 2 }}>
      {/* Phần trên: 1 bài lớn bên trái, 3 bài nhỏ bên phải */}
      {featuredPosts.length > 0 && (
        <Grid container spacing={2} mb={4}>
          {/* Bài lớn bên trái */}
          {featuredPosts[0] && (
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  cursor: 'pointer',
                  boxShadow: 3,
                  borderRadius: '8px',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
                onClick={() => handleClick(featuredPosts[0]._id)}
              >
                {featuredPosts[0].thumbnail?.url && (
                  <Box
                    component="img"
                    src={featuredPosts[0].thumbnail.url}
                    alt={featuredPosts[0].title || 'Thumbnail'}
                    sx={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px 8px 0 0',
                      padding: 1.5
                    }}
                  />
                )}
                <CardContent sx={{ padding: 2 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar
                      src={featuredPosts[0].userId?.avatar || ''}
                      sx={{ marginRight: 1, width: 32, height: 32 }}
                    >
                      {featuredPosts[0].userId?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Typography variant="body2" color="textSecondary">
                      {featuredPosts[0].userId?.name || 'Người dùng ẩn danh'} -{' '}
                      {featuredPosts[0].createdAt
                        ? new Date(
                            featuredPosts[0].createdAt
                          ).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      lineHeight: 1.2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {featuredPosts[0].title || 'Không có tiêu đề'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    paragraph
                    sx={{
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {featuredPosts[0].summary || 'Không có mô tả'}
                  </Typography>
                  <Box display="flex" gap={1} mb={1}>
                    {Array.isArray(featuredPosts[0].tags) &&
                      featuredPosts[0].tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          color="primary"
                          size="small"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton size="small">
                      <ChatBubbleOutlineIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">
                      {featuredPosts[0].comments || 0}
                    </Typography>
                    <IconButton size="small">
                      <ThumbUpAltIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">
                      {featuredPosts[0].likes || 0}
                    </Typography>
                    <IconButton size="small">
                      <ShareIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">
                      {featuredPosts[0].shares || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
          {/* 3 bài nhỏ bên phải */}
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" gap={2}>
              {featuredPosts.slice(1, 4).map((post) => (
                <Card
                  key={post._id}
                  sx={{
                    cursor: 'pointer',
                    boxShadow: 3,
                    borderRadius: '8px',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}
                  onClick={() => handleClick(post._id)}
                >
                  <Grid container spacing={1}>
                    {post.thumbnail?.url && (
                      <Grid item xs={4}>
                        <Box
                          component="img"
                          src={post.thumbnail.url}
                          alt={post.title || 'Thumbnail'}
                          sx={{
                            width: '100%',
                            height: '100%',
                            minHeight: '120px', // Đảm bảo không quá nhỏ
                            maxHeight: '200px', // Giữ thumbnail cân đối
                            objectFit: 'cover', // Giữ tỷ lệ ảnh mà không bị méo
                            aspectRatio: '16/9', // Đảm bảo ảnh có tỷ lệ đẹp
                            borderRadius: '8px 0 0 8px',
                            overflow: 'hidden',
                            padding: 1.5
                          }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={post.thumbnail?.url ? 8 : 12}>
                      <CardContent
                        sx={{
                          padding: 1.5,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1
                        }}
                      >
                        {/* Thông tin tác giả */}
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            src={featuredPosts?.[0]?.userId?.avatar || ''}
                            sx={{ width: 36, height: 36 }}
                          >
                            {featuredPosts?.[0]?.userId?.name?.charAt(0) || 'U'}
                          </Avatar>
                          <Typography variant="body2" color="textSecondary">
                            {featuredPosts?.[0]?.userId?.name ||
                              'Người dùng ẩn danh'}{' '}
                            -{' '}
                            {featuredPosts?.[0]?.createdAt
                              ? new Date(
                                  featuredPosts[0].createdAt
                                ).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })
                              : 'N/A'}
                          </Typography>
                        </Box>

                        {/* Tiêu đề bài viết */}
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: 'bold',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {post.title || 'Không có tiêu đề'}
                        </Typography>

                        {/* Mô tả bài viết */}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {featuredPosts?.[0]?.summary || 'Không có mô tả'}
                        </Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Phần dưới: Danh sách các bài viết khác */}
      {remainingPosts.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Các bài viết khác
          </Typography>
          {remainingPosts.map((post) => (
            <Card
              key={post._id}
              sx={{
                marginBottom: 2,
                cursor: 'pointer',
                boxShadow: 3,
                borderRadius: '8px',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
              }}
              onClick={() => handleClick(post._id)}
            >
              <Grid container spacing={0}>
                {post.thumbnail?.url && (
                  <Grid item xs={12} sm={4}>
                    <Box
                      component="img"
                      src={post.thumbnail.url}
                      alt={post.title || 'Thumbnail'}
                      sx={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px 0 0 8px'
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={post.thumbnail?.url ? 8 : 12}>
                  <CardContent sx={{ padding: 2, height: '100%' }}>
                    <Box display="flex" flexDirection="column" height="100%">
                      <Box display="flex" alignItems="center" mb={1}>
                        <Avatar
                          src={post.userId?.avatar || ''}
                          sx={{ marginRight: 1, width: 32, height: 32 }}
                        >
                          {post.userId?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Typography variant="body2" color="textSecondary">
                          {post.userId?.name || 'Người dùng ẩn danh'} -{' '}
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString(
                                'vi-VN',
                                {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                }
                              )
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 'bold',
                          lineHeight: 1.2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {post.title || 'Không có tiêu đề'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        paragraph
                        sx={{
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {post.summary || 'Không có mô tả'}
                      </Typography>
                      <Box display="flex" gap={1} mb={1}>
                        {Array.isArray(post.tags) &&
                          post.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              color="primary"
                              size="small"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ))}
                      </Box>
                      <Box display="flex" alignItems="center" mt="auto" gap={1}>
                        <IconButton size="small">
                          <ChatBubbleOutlineIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2">
                          {post.comments || 0}
                        </Typography>
                        <IconButton size="small">
                          <ThumbUpAltIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2">
                          {post.likes || 0}
                        </Typography>
                        <IconButton size="small">
                          <ShareIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2">
                          {post.shares || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}
          {/* Phân trang */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ margin: '0 auto' }} // Center the pagination
              />
            </Box>
          )}
        </Box>
      )}

      {/* Nếu không có bài viết nào */}
      {posts.length === 0 && (
        <Typography textAlign="center" color="textSecondary">
          Không có bài viết nào.
        </Typography>
      )}
    </Box>
  )
}

const MainForum = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(API_URL, {
          params: { page, limit: 10, approved: true } // Lấy 10 bài mỗi trang
        })
        if (Array.isArray(response.data.news)) {
          setPosts(response.data.news)
          setTotalPages(response.data.totalPages || 1)
        } else {
          console.error('Dữ liệu trả về không hợp lệ:', response.data)
          setPosts([])
          setTotalPages(1)
        }
      } catch (error) {
        console.error('Lỗi khi tải bài viết:', error)
        setError('Không thể tải bài viết. Vui lòng thử lại.')
        setPosts([])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [page]) // Gọi lại API khi page thay đổi

  const handleClick = (id) => {
    navigate(`/forum/post/${id}`)
  }

  const handlePageChange = (event, value) => {
    setPage(value) // Update the page state
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll to the top of the page
  }

  if (loading) {
    return <Typography textAlign="center">Đang tải dữ liệu...</Typography>
  }

  if (error) {
    return (
      <Typography textAlign="center" color="error">
        {error}
      </Typography>
    )
  }

  return (
    <PostList
      posts={posts}
      handleClick={handleClick}
      page={page}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
    />
  )
}

export default MainForum
