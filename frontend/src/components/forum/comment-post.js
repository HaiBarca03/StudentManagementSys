import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton
} from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import { useDispatch, useSelector } from 'react-redux'
import {
  createComment,
  deleteComment,
  getCommentByNews
} from '../../redux/forumRelated/commentHandle'
import CommentChild from './commentChild'

const CommentPost = ({ postId }) => {
  const [newComment, setNewComment] = useState('')
  const [newImages, setNewImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [newFile, setNewFile] = useState(null)
  const dispatch = useDispatch()
  console.log('postId:', postId)
  const comments = useSelector((state) => state.comment.commentList || [])

  useEffect(() => {
    if (postId) {
      dispatch(getCommentByNews(postId))
    }
  }, [postId, dispatch])

  const handleNewCommentChange = (e) => setNewComment(e.target.value)

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

  const handleNewCommentSubmit = async () => {
    if (!newComment.trim() && newImages.length === 0 && !newFile) return

    const formData = new FormData()
    formData.append('content', newComment)
    formData.append('newsId', postId)

    newImages.forEach((file) => formData.append('images', file))
    if (newFile) formData.append('file', newFile)

    try {
      await dispatch(createComment(formData))
      dispatch(getCommentByNews(postId))
      resetForm()
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  const handleDeleteComment = async (id) => {
    try {
      await dispatch(deleteComment(id))
      dispatch(getCommentByNews(postId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleCreateReply = async (formData) => {
    try {
      await dispatch(createComment(formData))
      dispatch(getCommentByNews(postId))
    } catch (error) {
      console.error('Error creating reply:', error)
    }
  }

  const resetForm = () => {
    setNewComment('')
    setNewImages([])
    setPreviewImages([])
    setNewFile(null)
  }

  const buildCommentTree = (comments) => {
    if (!Array.isArray(comments)) {
      console.warn('Comments is not an array:', comments)
      return []
    }

    const commentMap = {}
    const rootComments = []

    const extensibleComments = comments.map((comment) => ({
      ...comment,
      children: []
    }))

    extensibleComments.forEach((comment) => {
      commentMap[comment._id] = comment
    })

    extensibleComments.forEach((comment) => {
      if (comment.parentId && commentMap[comment.parentId]) {
        commentMap[comment.parentId].children.push(comment)
      } else {
        rootComments.push(comment)
      }
    })

    return rootComments
  }

  const commentTree = buildCommentTree(comments)

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>

      <Card sx={{ marginBottom: 2, padding: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={handleNewCommentChange}
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
              onClick={handleNewCommentSubmit}
              variant="contained"
              size="small"
              sx={{ fontSize: '0.52rem', padding: '4px 8px' }}
            >
              Bình luận
            </Button>
          </Box>

          {previewImages.length > 0 && (
            <Box mt={2} display="flex" gap={1} flexWrap="wrap">
              {previewImages.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt="Preview"
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              ))}
            </Box>
          )}

          {newFile && (
            <Box mt={2}>
              <Typography variant="body2">📄 {newFile.name}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {commentTree.length > 0 ? (
        commentTree.map((comment) => (
          <CommentChild
            key={comment._id}
            comment={comment}
            depth={0}
            postId={postId}
            dispatch={dispatch}
            onDeleteComment={handleDeleteComment}
            onCreateComment={handleCreateReply}
          />
        ))
      ) : (
        <Typography>Chưa có bình luận nào.</Typography>
      )}
    </Box>
  )
}

export default CommentPost
