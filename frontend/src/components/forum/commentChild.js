import React, { useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import {
  createComment,
  getCommentByNews
} from '../../redux/forumRelated/commentHandle'

const CommentChild = ({ comment, depth, postId, dispatch }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [likes, setLikes] = useState(comment.likes || 0)
  const [showReplyInput, setShowReplyInput] = useState(false) // Toggle reply input visibility
  const [replyContent, setReplyContent] = useState('') // Reply content
  const [newImages, setNewImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [newFile, setNewFile] = useState(null)
  const hasChildren = comment.children && comment.children.length > 0

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  const handleLike = () => {
    setLikes((prev) => prev + 1) // Replace with API call if needed
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setNewFile(file)
  }
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return

    const formData = new FormData()
    formData.append('content', replyContent)
    formData.append('newsId', postId)
    formData.append('parentId', comment._id) // Set parentId to current comment's _id

    try {
      const result = await dispatch(createComment(formData))
      if (result && result.type === 'comment/getSuccess') {
        dispatch(getCommentByNews(postId))
        setReplyContent('')
        setShowReplyInput(false)
      }
    } catch (error) {
      console.error('Error submitting reply:', error)
    }
  }

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      {/* Connecting line for replies */}
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
        {/* Avatar */}
        <Avatar sx={{ width: 32, height: 32, fontSize: '1rem' }}>
          {comment.userId.name[0]}
        </Avatar>

        {/* Comment Content */}
        <Box
          sx={{ flex: 1, backgroundColor: '#f0f2f5', borderRadius: 2, p: 1 }}
        >
          <Typography variant="body2" fontWeight="bold">
            {comment.userId.name}
          </Typography>
          <Typography variant="body2">{comment.content}</Typography>

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

          {/* Actions and Metadata */}
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
              onClick={() => setShowReplyInput((prev) => !prev)} // Toggle reply input
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

      {/* Reply Input */}
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

      {/* Render Child Comments */}
      {isExpanded && hasChildren && (
        <Box mt={1}>
          {comment.children.map((child) => (
            <CommentChild
              key={child._id}
              comment={child}
              depth={depth + 1}
              postId={postId}
              dispatch={dispatch}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default CommentChild
