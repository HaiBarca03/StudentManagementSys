import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Chip,
  Alert,
  Snackbar,
  Divider
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteImageNew,
  getNewsDetail,
  updateNew
} from '../../redux/forumRelated/forumHandle'
import { useParams, useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const EditArticlePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { articleDetail, loading, error } = useSelector((state) => state.forum)

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [images, setImages] = useState([])
  const [selectedThumbnail, setSelectedThumbnail] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

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
      showSnackbar('Xóa ảnh thành công', 'success')
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
      showSnackbar('Cập nhật bài viết thành công', 'success')
      navigate(-1) // Go back after successful update
    } catch (err) {
      showSnackbar('Cập nhật bài viết thất bại', 'error')
      console.error('Cập nhật bài viết thất bại:', err)
    }
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.paper'
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || 'Đã xảy ra lỗi khi tải bài viết'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Chỉnh sửa bài viết
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Tiêu đề bài viết"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{ mb: 3 }}
                InputProps={{
                  style: { fontSize: '1.25rem', fontWeight: 500 }
                }}
              />

              <TextField
                label="Tóm tắt ngắn"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                variant="outlined"
                sx={{ mb: 3 }}
                helperText="Tóm tắt ngắn gọn nội dung bài viết (tối đa 200 ký tự)"
              />

              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Nội dung bài viết
              </Typography>
              <Paper elevation={0} sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent}
                  style={{ height: '400px', border: 'none' }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Ảnh đại diện
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    Tải lên ảnh đại diện
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </Button>
                </Box>
                {thumbnail && (
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Avatar
                      src={thumbnail}
                      variant="rounded"
                      sx={{ width: '100%', height: 200 }}
                    />
                    <IconButton
                      sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'error.main', color: 'white' }}
                      onClick={handleDeleteThumbnail}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Paper>

              <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Ảnh minh họa
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    Tải lên ảnh minh họa
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </Button>
                </Box>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {images.map((img) => (
                    <Grid item xs={6} sm={4} key={img._id}>
                      <Box sx={{ position: 'relative', height: 100 }}>
                        <Avatar
                          src={img.url}
                          variant="rounded"
                          sx={{ width: '100%', height: '100%' }}
                        />
                        <IconButton
                          sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'error.main', color: 'white', p: 0.5 }}
                          onClick={() => handleDeleteImage(img._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}

                  {selectedImages.map((file, index) => (
                    <Grid item xs={6} sm={4} key={`selected-${index}`}>
                      <Box sx={{ position: 'relative', height: 100 }}>
                        <Avatar
                          src={URL.createObjectURL(file)}
                          variant="rounded"
                          sx={{ width: '100%', height: '100%' }}
                        />
                        <IconButton
                          sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'error.main', color: 'white', p: 0.5 }}
                          onClick={() => handleDeleteSelectedImage(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ px: 4 }}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={<SaveIcon />}
              sx={{ px: 4 }}
            >
              Lưu bài viết
            </Button>
          </Box>
        </CardContent>
      </Card>

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

export default EditArticlePage