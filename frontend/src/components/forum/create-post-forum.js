import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/api/news';

const CreatePostForum = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(255, 'Tối đa 255 ký tự')
        .required('Tiêu đề là bắt buộc'),
      summary: Yup.string()
        .max(255, 'Tối đa 255 ký tự')
        .optional(),
      slug: Yup.string()
        .max(100, 'Tối đa 100 ký tự')
        .optional(),
      content: Yup.string().required('Nội dung là bắt buộc'),
      userType: Yup.string()
        .oneOf(['student', 'teacher', 'admin'], 'Chọn loại tài khoản hợp lệ')
        .required('Loại tài khoản là bắt buộc'),
      thumbnail: Yup.mixed()
        .required('Thumbnail là bắt buộc')
        .test('fileSize', 'Kích thước file tối đa là 5MB', (value) => 
          value && value.size <= 5 * 1024 * 1024
        )
        .test('fileType', 'Vui lòng chọn file ảnh', (value) => 
          value && value.type.startsWith('image/')
        ),
      images: Yup.array()
        .max(5, 'Tối đa 5 hình ảnh')
        .of(
          Yup.mixed()
            .test('fileSize', 'Kích thước file tối đa là 5MB', (value) => 
              value && value.size <= 5 * 1024 * 1024
            )
            .test('fileType', 'Vui lòng chọn file ảnh', (value) => 
              value && value.type.startsWith('image/')
            )
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsUploading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Access token missing. Please log in.');
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < now) {
          localStorage.removeItem('token');
          throw new Error('Token has expired. Please log in again.');
        }

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('summary', values.summary || '');
        formData.append('slug', values.slug || '');
        formData.append('content', values.content);
        formData.append('published', values.published);
        formData.append('userType', values.userType);
        formData.append('thumbnail', values.thumbnail);
        values.images.forEach((image) => formData.append('images', image));
        formData.append('userId', userId);

        // Log the URL and FormData for debugging
        console.log('Request URL:', API_URL);
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        console.log('formData:', formData);
        const response = await axios.post(API_URL, formData, {
          headers: {
            token: `Bearer ${token}`, // Kept as requested
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });

        setSnackbar({
          open: true,
          message: response.data.message || 'Bài viết đã được tạo thành công!',
          severity: 'success',
        });

        resetForm();
        setThumbnailPreview(null);
        setImagePreviews([]);
      } catch (error) {
        console.error('Submission error:', error.response?.data, error.message);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Đã có lỗi xảy ra khi tạo bài viết.';
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
        if (error.message.includes('token')) {
          console.log('Redirecting to login...');
          // Add redirect logic here if needed
        }
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
  });

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('thumbnail', file);
      setThumbnailPreview(URL.createObjectURL(file));
      setSnackbar({
        open: true,
        message: `Đã chọn thumbnail: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        severity: 'info',
      });
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue('images', files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    setSnackbar({
      open: true,
      message: `Đã chọn ${files.length} hình ảnh`,
      severity: 'info',
    });
  };

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [thumbnailPreview, imagePreviews]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
      {formik.touched.thumbnail && formik.errors.thumbnail && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {formik.errors.thumbnail}
        </Typography>
      )}

      <Typography variant="body1" sx={{ mt: 2 }}>
        Hình ảnh (tối đa 5):
      </Typography>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
      <Box displayADED="flex" gap={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
        {imagePreviews.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Preview ${index}`}
            style={{
              width: 100,
              height: 100,
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
        ))}
      </Box>
      {formik.touched.images && formik.errors.images && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {formik.errors.images}
        </Typography>
      )}

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
            onChange={(e) => formik.setFieldValue('published', e.target.checked)}
          />
        }
        label="Công khai bài viết"
        sx={{ mb: 2 }}
      />

      {isUploading && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{ mb: 2 }}
        />
      )}

      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={formik.isSubmitting || isUploading}
      >
        {isUploading ? 'Đang tải lên...' : formik.isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatePostForum;