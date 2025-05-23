import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  CircularProgress
} from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ShareIcon from '@mui/icons-material/Share'
import TrenddingPost from '../../components/forum/trendding-post'
import NewPosts from '../../components/forum/news-post'
import CommentPost from '../../components/forum/comment-post'
import { useDispatch, useSelector } from 'react-redux'
import { getCommentByNews } from '../../redux/forumRelated/commentHandle'
import { likeNews, shareNews } from '../../redux/forumRelated/forumHandle'
import DOMPurify from 'dompurify'

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/news`

const PostContent = ({ html }) => {
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'img',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'div',
      'span'
    ],
    ALLOWED_ATTR: ['src', 'alt', 'width', 'height', 'style', 'class']
  })

  return (
    <Box
      sx={{
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          margin: '1rem auto',
          borderRadius: '8px',
          '@media (max-width: 600px)': {
            maxHeight: '300px'
          },
          '@media (min-width: 601px)': {
            maxHeight: '500px'
          }
        },
        fontFamily: 'Roboto',
        lineHeight: 1.6,
        textAlign: 'justify',
        wordBreak: 'break-word'
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  )
}

const ForumPostDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [post, setPost] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const { commentList } = useSelector((state) => state.comment)
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(`${API_URL}/${id}`)
        setPost(response.data)
        setLikes(response.data.likes || 0)
        setHasLiked(
          response.data.likedBy?.includes(currentUser?._id ?? '') || false
        )

        if (response.data?.userId) {
          setUser({
            username: response.data.userId.name || 'Người dùng ẩn danh',
            avatar: response.data.userId.avatar || ''
          })
        } else {
          setUser({
            username: 'Người dùng ẩn danh',
            avatar: ''
          })
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        setError('Không thể tải bài viết. Vui lòng thử lại sau.')
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPostDetails()
      dispatch(getCommentByNews(id))
    }
  }, [id, dispatch, currentUser?._id ?? ''])

  const handleToggleComments = () => {
    setShowComments((prev) => !prev)
  }

  const isLocal = process.env.REACT_APP_DOMAIN_CHECK_LOCAL === '0'
  const shareUrl = isLocal
    ? `http://localhost:3000/forum/post/${id}`
    : `https://student-sys-fe.vercel.app/forum/post/${id}`

  useEffect(() => {
    if (!window.FB) {
      const script = document.createElement('script')
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'

      script.onload = () => {
        window.fbAsyncInit = () => {
          window.FB.init({
            appId: process.env.REACT_APP_FB_APP_ID,
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v19.0'
          })
        }
      }

      document.body.appendChild(script)
    }
  }, [])

  const handleShare = () => {
    const urlToShare = shareUrl
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      urlToShare
    )}`

    window.open(fbShareUrl, '_blank', 'width=600,height=400')
    dispatch(shareNews(id))
  }

  const handleLike = async () => {
    try {
      setHasLiked(!hasLiked)
      setLikes(hasLiked ? likes - 1 : likes + 1)

      await dispatch(likeNews(id)).unwrap()
      await axios.get(`${API_URL}/${id}`)
    } catch (error) {
      console.error('Error liking post:', error)
      setHasLiked(hasLiked)
      setLikes(likes)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error" sx={{ fontFamily: 'Roboto' }}>
          {error}
        </Typography>
      </Box>
    )
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" sx={{ fontFamily: 'Roboto' }}>
          Bài viết không tồn tại hoặc đã bị xóa!
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>{post.title || 'Bài viết diễn đàn'}</title>
        <meta
          name="description"
          content={post.summary || 'Bài viết diễn đàn'}
        />
      </Helmet>

      <Grid
        container
        spacing={2}
        sx={{ padding: 2, margin: '0 auto', maxWidth: '1200px' }}
      >
        <Grid item xs={12} md={8}>
          <Card sx={{ marginBottom: 2, boxShadow: 3 }}>
            <CardContent sx={{ padding: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={user?.avatar || ''} sx={{ marginRight: 1 }}>
                  {user?.username?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="body2" sx={{ fontFamily: 'Roboto' }}>
                  {user?.username || 'Người dùng ẩn danh'} -{' '}
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString('vi-VN')
                    : 'N/A'}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontFamily: 'Roboto', fontWeight: 700 }}
              >
                {post.title}
              </Typography>
              <Box display="flex" gap={1} mb={2}>
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
              {post.images &&
                post.images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
                  >
                    <img
                      src={image.url || image}
                      alt={`Hình ảnh ${index + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                ))}

              <PostContent html={post.content} />

              <Box display="flex" alignItems="center" mt={2}>
                <IconButton onClick={handleToggleComments}>
                  <ChatBubbleOutlineIcon />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'Roboto', mr: 2 }}
                >
                  {commentList.length}
                </Typography>
                <IconButton onClick={handleLike}>
                  {hasLiked ? (
                    <ThumbUpAltIcon color="primary" />
                  ) : (
                    <ThumbUpAltOutlinedIcon />
                  )}
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'Roboto', mr: 2 }}
                >
                  {post.likes}
                </Typography>
                <div>
                  <IconButton onClick={handleShare}>
                    <ShareIcon />
                  </IconButton>
                </div>
                <Typography variant="body2" sx={{ fontFamily: 'Roboto' }}>
                  {post.shares || 0}
                </Typography>
              </Box>
            </CardContent>
            {showComments && (
              <Box sx={{ maxHeight: '800px', overflowY: 'auto', padding: 2 }}>
                <CommentPost comments={commentList} postId={post._id} />
              </Box>
            )}
          </Card>
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
          <Box sx={{ mt: 2 }}>
            <NewPosts />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default ForumPostDetailPage
