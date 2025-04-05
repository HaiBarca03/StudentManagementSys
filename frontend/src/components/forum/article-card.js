import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ShareIcon from '@mui/icons-material/Share'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteNew } from '../../redux/forumRelated/forumHandle'

const ArticleCard = ({ onDeleteSuccess, ...post }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const open = Boolean(anchorEl)

  const handleClick = (id) => {
    navigate(`/forum/post/${id}`)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    const id = post._id
    navigate(`/forum/edit-news/${id}`)
    handleMenuClose()
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteConfirm = async () => {
    try {
      const newId = post._id
      await dispatch(deleteNew(newId))
      setSnackbar({
        open: true,
        message: 'Xóa bài viết thành công!',
        severity: 'success'
      })
      onDeleteSuccess()
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Xóa bài viết thất bại!',
        severity: 'error'
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box>
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
      >
        <Grid container spacing={0}>
          {post.thumbnail?.url && (
            <Grid item xs={12} sm={4}>
              <Box
                component="img"
                src={post.thumbnail.url}
                alt={post.title || 'Thumbnail'}
                sx={{
                  width: '80%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '8px 0 0 8px'
                }}
                onClick={() => handleClick(post._id)}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={post.thumbnail?.url ? 8 : 12}>
            <CardContent sx={{ padding: 2, height: '100%' }}>
              <Box display="flex" flexDirection="column" height="100%">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={post.user?.avatar || ''}
                      sx={{ marginRight: 1, width: 32, height: 32 }}
                    >
                      {post?.user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Typography variant="body2" color="textSecondary">
                      {post?.user?.name || 'Người dùng ẩn danh'} -{' '}
                      {post.datePosted
                        ? new Date(post.datePosted).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </Typography>
                  </Box>
                  {post.type !== 'topic' && (
                    <IconButton onClick={handleMenuOpen}>
                      <MoreVertIcon />
                    </IconButton>
                  )}

                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                  >
                    {post.type !== 'topic' && (
                      <>
                        <MenuItem onClick={handleEdit}>Sửa</MenuItem>
                        <MenuItem onClick={handleDeleteClick}>Xóa</MenuItem>
                      </>
                    )}
                  </Menu>
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
                  onClick={() => handleClick(post._id)}
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
                  onClick={() => handleClick(post._id)}
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
                <Box
                  display="flex"
                  alignItems="center"
                  mt="auto"
                  gap={1}
                  onClick={() => handleClick(post._id)}
                >
                  <IconButton size="small">
                    <ChatBubbleOutlineIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">{post.comments || 0}</Typography>
                  <IconButton size="small">
                    <ThumbUpAltIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">{post.likes || 0}</Typography>
                  <IconButton size="small">
                    <ShareIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">{post.shares || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa bài viết</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa bài viết "{post.title}"? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ArticleCard