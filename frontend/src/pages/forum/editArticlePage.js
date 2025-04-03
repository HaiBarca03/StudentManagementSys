import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteImageNew,
  getNewsDetail,
  updateNew
} from '../../redux/forumRelated/forumHandle'
import { useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import DeleteIcon from '@mui/icons-material/Delete'

const EditArticlePage = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { articleDetail, loading, error } = useSelector((state) => state.forum)

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [images, setImages] = useState([])
  const [message, setMessage] = useState('')
  const [selectedThumbnail, setSelectedThumbnail] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])

  useEffect(() => {
    dispatch(getNewsDetail(id))
  }, [dispatch, id])

  useEffect(() => {
    if (articleDetail) {
      setTitle(articleDetail.title || '')
      setSummary(articleDetail.summary || '')
      setContent(articleDetail.content || '')
      setThumbnail(articleDetail.thumbnail?.url || '')
      setImages(Array.isArray(articleDetail.images) ? articleDetail.images : [])
    }
  }, [articleDetail])

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedThumbnail(file)
      setThumbnail(URL.createObjectURL(file))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files])
    }
  }

  const handleDeleteThumbnail = () => {
    setThumbnail('')
    setSelectedThumbnail(null)
  }

  const handleDeleteImage = (imageId) => {
    dispatch(deleteImageNew(id, imageId)).then((result) => {
      setImages((prev) => prev.filter((img) => img._id !== imageId))
    })
  }

  const handleDeleteSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const formData = new FormData()

    formData.append('title', title)
    formData.append('summary', summary)
    formData.append('content', content)

    if (selectedThumbnail) {
      formData.append('thumbnail', selectedThumbnail)
    }
    selectedImages.forEach((file) => formData.append('images', file))

    try {
      await dispatch(updateNew(id, formData))
      await dispatch(getNewsDetail(id))
    } catch (err) {
      setMessage('Cập nhật bài viết thất bại')
      console.error('Cập nhật bài viết thất bại:', err)
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
      <Typography color="error" align="center">
        {error.message || 'Đã xảy ra lỗi khi tải bài viết'}
      </Typography>
    )
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chỉnh sửa bài viết
      </Typography>

      <TextField
        label="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Tóm tắt"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      <Typography variant="subtitle1">Ảnh đại diện (Thumbnail):</Typography>
      <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
        <Button variant="contained" component="label">
          Chọn ảnh đại diện
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </Button>
        {thumbnail && (
          <Box sx={{ marginLeft: 2, position: 'relative' }}>
            <img
              src={thumbnail}
              alt="Thumbnail"
              style={{ maxWidth: 150, maxHeight: 150 }}
            />
            <IconButton
              sx={{ position: 'absolute', top: 0, right: 0 }}
              onClick={handleDeleteThumbnail}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      <Typography variant="subtitle1">Ảnh trong nội dung bài viết:</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Button variant="contained" component="label">
          Chọn ảnh bài viết
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {images.map((img) => (
          <Box key={img._id} sx={{ position: 'relative' }}>
            <img
              src={img.url}
              alt="Article"
              style={{ maxWidth: 150, maxHeight: 150 }}
            />
            <IconButton
              sx={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => handleDeleteImage(img._id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {selectedImages.map((file, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <img
              src={URL.createObjectURL(file)}
              alt="Selected"
              style={{ maxWidth: 150, maxHeight: 150 }}
            />
            <IconButton
              sx={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => handleDeleteSelectedImage(index)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Typography variant="subtitle1">Nội dung bài viết:</Typography>
      <ReactQuill theme="snow" value={content} onChange={setContent} />

      <Box sx={{ marginTop: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      </Box>
    </Box>
  )
}

export default EditArticlePage
