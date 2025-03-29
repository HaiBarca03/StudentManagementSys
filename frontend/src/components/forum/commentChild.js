import React, { useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ImageIcon from '@mui/icons-material/Image'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  deleteImageComment,
  getCommentByNews,
  updateComment
} from '../../redux/forumRelated/commentHandle'

const CommentChild = ({
  comment,
  depth,
  postId,
  dispatch,
  onDeleteComment,
  onCreateComment
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [likes, setLikes] = useState(comment.likes || 0)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [newImages, setNewImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [newFile, setNewFile] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [editImages, setEditImages] = useState([])
  const [editPreviewImages, setEditPreviewImages] = useState([])
  const [remainingImages, setRemainingImages] = useState(comment.images)
  const hasChildren = comment.children && comment.children.length > 0

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  const handleLike = () => {
    setLikes((prev) => prev + 1)
  }

  const handleReplyContentChange = (e) => {
    setReplyContent(e.target.value)
  }
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setNewImages(files)
      setPreviewImages(files.map((file) => URL.createObjectURL(file)))
    }
  }

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setEditImages(files)
      setEditPreviewImages(files.map((file) => URL.createObjectURL(file)))
    }
  }

  const handleDeleteImage = async (imageId) => {
    try {
      const commentId = comment._id
      await dispatch(deleteImageComment(commentId, imageId))
      setRemainingImages(remainingImages.filter((img) => img._id !== imageId))
      dispatch(getCommentByNews(postId))
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setNewFile(file)
  }
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return

    const formData = new FormData()
    formData.append('content', replyContent)
    formData.append('newsId', postId)
    formData.append('parentId', comment._id)

    try {
      await onCreateComment(formData)
      setReplyContent('')
      setNewImages([])
      setPreviewImages([])
      setNewFile(null)
      setShowReplyInput(false)
    } catch (error) {
      console.error('Error submitting reply:', error)
    }
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditComment = (id) => {
    setIsEditing(true)
    handleMenuClose()
  }

  const handleSaveEdit = async () => {
    const formData = new FormData()
    const id = comment._id
    formData.append('_id', comment._id)
    formData.append('content', editContent)
    editImages.forEach((file) => formData.append('images', file))
    try {
      await dispatch(updateComment(id, formData))
      dispatch(getCommentByNews(postId))
      setIsEditing(false)
      setEditImages([])
      setEditPreviewImages([])
      setRemainingImages(comment.images)
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setEditImages([])
    setEditPreviewImages([])
    setRemainingImages(comment.images)
    setIsEditing(false)
  }

  const handleDeleteComment = async (id) => {
    try {
      await onDeleteComment(id)
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
    handleMenuClose()
  }

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      {depth > 0 && (
        <Box
          sx={{
            position: 'absolute',
            left: `${depth * 24 - 12}px`,
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: '#ccc',
            zIndex: 0
          }}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          position: 'relative'
        }}
      >
        <Avatar sx={{ width: 32, height: 32, fontSize: '1rem' }}>
          {comment.userId.name[0]}
        </Avatar>

        <Box
          sx={{
            flex: 1,
            backgroundColor: '#f0f2f5',
            borderRadius: 2,
            p: 1,
            position: 'relative'
          }}
        >
          <IconButton
            onClick={handleMenuClick}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              p: 0.5
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <Typography variant="body2" fontWeight="bold">
            {comment.userId.name}
          </Typography>
          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              {/* Hiển thị ảnh cũ với nút xóa */}
              {remainingImages.length > 0 && (
                <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                  {remainingImages.map((img) => (
                    <Box key={img._id} sx={{ position: 'relative' }}>
                      <img
                        src={img.url}
                        alt="comment-img"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <IconButton
                        onClick={() => handleDeleteImage(img._id)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          p: 0.5,
                          backgroundColor: 'rgba(0,0,0,0.5)'
                        }}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: 'white' }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
              {/* Thêm ảnh mới */}
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                <IconButton component="label">
                  <ImageIcon />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleEditImageChange}
                  />
                </IconButton>
                <Button
                  onClick={handleSaveEdit}
                  variant="contained"
                  size="small"
                >
                  Lưu
                </Button>
                <Button onClick={handleCancelEdit} size="small">
                  Hủy
                </Button>
              </Box>
              {/* Xem trước ảnh mới */}
              {editPreviewImages.length > 0 && (
                <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                  {editPreviewImages.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt="Preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body2">{comment.content}</Typography>
          )}

          {comment.images.length > 0 && (
            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
              {comment.images.map((img) => (
                <Box
                  key={img._id}
                  component="img"
                  src={img.url}
                  alt="comment-img"
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 2
                  }}
                />
              ))}
            </Box>
          )}

          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            <Typography variant="caption" color="textSecondary">
              {new Date(comment.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
            <Button
              size="small"
              onClick={handleLike}
              startIcon={<ThumbUpIcon fontSize="small" />}
              sx={{ minWidth: 'auto', padding: '0 4px' }}
            >
              Thích
            </Button>
            <Button
              size="small"
              onClick={() => setShowReplyInput((prev) => !prev)}
              sx={{ minWidth: 'auto', padding: '0 4px' }}
            >
              Phản hồi
            </Button>
            {hasChildren && (
              <Button
                size="small"
                onClick={toggleExpand}
                sx={{ minWidth: 'auto', padding: '0 4px' }}
              >
                {isExpanded ? 'Ẩn' : `Xem thêm (${comment.children.length})`}
                {isExpanded ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </Button>
            )}
            {likes > 0 && (
              <Typography variant="caption" color="textSecondary">
                {likes} 😊
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {showReplyInput && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1,
            ml: `${depth * 24 + 40}px`
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Viết phản hồi..."
            value={replyContent}
            onChange={handleReplyContentChange}
          />
          <IconButton component="label">
            <ImageIcon />
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </IconButton>
          <IconButton component="label">
            <AttachFileIcon />
            <input type="file" hidden onChange={handleFileChange} />
          </IconButton>
          <Button
            onClick={handleReplySubmit}
            variant="contained"
            size="small"
            sx={{ fontSize: '0.52rem', padding: '4px 8px' }}
          >
            Gửi
          </Button>
          <Button
            onClick={() => setShowReplyInput(false)}
            size="small"
            sx={{ fontSize: '0.52rem', padding: '4px 8px' }}
          >
            Hủy
          </Button>
        </Box>
      )}

      {isExpanded && hasChildren && (
        <Box mt={1}>
          {comment.children.map((child) => (
            <CommentChild
              key={child._id}
              comment={child}
              depth={depth + 1}
              postId={postId}
              dispatch={dispatch}
              onDeleteComment={onDeleteComment}
              onCreateComment={onCreateComment}
            />
          ))}
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditComment}>Sửa</MenuItem>
        <MenuItem onClick={() => handleDeleteComment(comment._id)}>
          Xóa
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default CommentChild
