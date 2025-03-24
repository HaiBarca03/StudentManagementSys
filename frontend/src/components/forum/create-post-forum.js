import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const CreatePostForum = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      thumbnail: null,
      summary: '',
      slug: '',
      images: [],
      content: '',
      published: false,
      userType: 'student',
      userId: ''
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .trim() // Loại bỏ khoảng trắng thừa
        .max(255, 'Tối đa 255 ký tự')
        .required('Bắt buộc nhập tiêu đề'),
      summary: Yup.string()
        .trim()
        .max(255, 'Tối đa 255 ký tự')
        .required('Bắt buộc nhập tóm tắt'),
      slug: Yup.string().max(100, 'Tối đa 100 ký tự'),
      content: Yup.string()
        .trim()
        .required('Bắt buộc nhập nội dung'),
      userType: Yup.string()
        .oneOf(['student', 'teacher', 'admin'], 'Chọn loại tài khoản')
        .required('Bắt buộc chọn loại tài khoản'),
      userId: Yup.string()
        .trim()
        .required('Bắt buộc nhập userId'),
      thumbnail: Yup.mixed().required('Bắt buộc chọn thumbnail')
    }),
    onSubmit: async (values, { resetForm }) => {
      setError(null);
      setSuccess(null);
      setLoading(true);

      // Kiểm tra token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để tạo bài viết. Vui lòng đăng nhập và thử lại.');
        setLoading(false);
        return;
      }

      // Kiểm tra các trường bắt buộc trước khi gửi
      const requiredFields = {
        title: values.title?.trim(),
        summary: values.summary?.trim(),
        content: values.content?.trim(),
        userId: values.userId?.trim(),
        userType: values.userType?.trim()
      };

      const missingFields = Object.keys(requiredFields).filter(
        (key) => !requiredFields[key]
      );

      if (missingFields.length > 0) {
        setError(
          `Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(', ')}.`
        );
        setLoading(false);
        return;
      }

      // Tạo FormData để gửi dữ liệu
      const formData = new FormData();
      formData.append('title', values.title.trim());
      formData.append('summary', values.summary.trim());
      formData.append('slug', values.slug?.trim() || '');
      formData.append('content', values.content.trim());
      formData.append('published', values.published);
      formData.append('userType', values.userType.trim());
      formData.append('userId', values.userId.trim());

      if (values.thumbnail) {
        formData.append('thumbnail', values.thumbnail);
      }

      if (values.images && values.images.length > 0) {
        values.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      // Debug dữ liệu gửi đi
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const response = await axios.post('http://localhost:5000/', formData, {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        setSuccess(response.data.message || 'Bài viết đã được tạo thành công!');
        resetForm();
        setThumbnailPreview(null);
        setImagePreviews([]);
      } catch (err) {
        console.error('Lỗi từ backend:', err.response?.data);
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.'
        );
      } finally {
        setLoading(false);
      }
    }
  });

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('thumbnail', file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      formik.setFieldValue('thumbnail', null);
      setThumbnailPreview(null);
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue('images', files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ maxWidth: 600, margin: 'auto', p: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Tạo bài viết
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

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

      <TextField
        fullWidth
        label="User ID"
        name="userId"
        value={formik.values.userId}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.userId && Boolean(formik.errors.userId)}
        helperText={formik.touched.userId && formik.errors.userId}
        sx={{ mb: 2 }}
      />

      <Typography variant="body1" sx={{ mt: 2 }}>
        Thumbnail:
      </Typography>
      <input type="file" accept="image/*" onChange={handleThumbnailChange} />
      {formik.touched.thumbnail && formik.errors.thumbnail && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {formik.errors.thumbnail}
        </Typography>
      )}
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
        onBlur={formik.handleBlur}
        error={formik.touched.userType && Boolean(formik.errors.userType)}
        helperText={formik.touched.userType && formik.errors.userType}
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

      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Đang đăng...' : 'Đăng bài'}
      </Button>
    </Box>
  );
};

export default CreatePostForum;