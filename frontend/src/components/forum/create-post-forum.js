import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const CreatePostForum = ({ onSubmit }) => {
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [imagePreviews, setImagePreviews] = useState([])

  const formik = useFormik({
    initialValues: {
      title: '',
      thumbnail: null,
      summary: '',
      slug: '',
      images: [],
      content: '',
      published: false,
      userType: 'student'
    },
    validationSchema: Yup.object({
      title: Yup.string().max(255, 'Tối đa 255 ký tự').required('Bắt buộc'),
      summary: Yup.string().max(255, 'Tối đa 255 ký tự'),
      slug: Yup.string().max(100, 'Tối đa 100 ký tự'),
      content: Yup.string().required('Bắt buộc'),
      userType: Yup.string().oneOf(
        ['student', 'teacher', 'admin'],
        'Chọn loại tài khoản'
      )
    }),
    onSubmit: (values) => {
      console.log('Post data:', values)
      if (onSubmit) onSubmit(values)
    }
  })

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      formik.setFieldValue('thumbnail', file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files)
    formik.setFieldValue('images', files)
    setImagePreviews(files.map((file) => URL.createObjectURL(file)))
  }

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ maxWidth: 600, margin: 'auto', p: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Tạo bài viết
      </Typography>

      <TextField
        fullWidth
        label="Tiêu đề"
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Tóm tắt"
        name="summary"
        value={formik.values.summary}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.summary && Boolean(formik.errors.summary)}
        helperText={formik.touched.summary && formik.errors.summary}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Slug"
        name="slug"
        value={formik.values.slug}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.slug && Boolean(formik.errors.slug)}
        helperText={formik.touched.slug && formik.errors.slug}
        sx={{ mb: 2 }}
      />

      <Typography variant="body1" sx={{ mt: 2 }}>
        Thumbnail:
      </Typography>
      <input type="file" accept="image/*" onChange={handleThumbnailChange} />
      {thumbnailPreview && (
        <img
          src={thumbnailPreview}
          alt="Thumbnail preview"
          style={{ width: '100%', marginTop: 10, borderRadius: 8 }}
        />
      )}

      <Typography variant="body1" sx={{ mt: 2 }}>
        Hình ảnh:
      </Typography>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
      <Box display="flex" gap={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
        {imagePreviews.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Preview ${index}`}
            style={{
              width: 100,
              height: 100,
              objectFit: 'cover',
              borderRadius: 8
            }}
          />
        ))}
      </Box>

      <TextField
        fullWidth
        label="Nội dung"
        name="content"
        multiline
        rows={4}
        value={formik.values.content}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.content && Boolean(formik.errors.content)}
        helperText={formik.touched.content && formik.errors.content}
        sx={{ mt: 2, mb: 2 }}
      />

      <TextField
        fullWidth
        select
        label="Loại tài khoản"
        name="userType"
        value={formik.values.userType}
        onChange={formik.handleChange}
        sx={{ mb: 2 }}
      >
        <MenuItem value="student">Học sinh</MenuItem>
        <MenuItem value="teacher">Giáo viên</MenuItem>
        <MenuItem value="admin">Quản trị viên</MenuItem>
      </TextField>

      <FormControlLabel
        control={
          <Switch
            checked={formik.values.published}
            onChange={(e) =>
              formik.setFieldValue('published', e.target.checked)
            }
          />
        }
        label="Công khai bài viết"
        sx={{ mb: 2 }}
      />

      <Button variant="contained" type="submit" fullWidth>
        Đăng bài
      </Button>
    </Box>
  )
}

export default CreatePostForum
