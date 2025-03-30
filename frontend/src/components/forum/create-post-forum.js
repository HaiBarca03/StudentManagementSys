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
  Paper,
  Divider,
  IconButton,
} 
from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ReactQuill from 'react-quill'; // Thêm editor WYSIWYG
import 'react-quill/dist/quill.snow.css'; // CSS cho ReactQuill
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/news`;
const TOPIC_API_URL = `${process.env.REACT_APP_BASE_URL}/topic`;

const CreateNews = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  // Fetch topics từ backend
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Kiểm tra token
        if (!token) throw new Error('No token found');

        const response = await axios.get(TOPIC_API_URL, {
          headers: {
            token: `Bearer ${token}`,
          },
        });
        console.log('Topics response:', response.data); // Kiểm tra dữ liệu trả về
        setTopics(response.data);
        console.log('Topics state:', response.data); // Kiểm tra state sau khi set
      } catch (error) {
        console.error('Lỗi khi lấy danh sách chủ đề:', error.response || error.message);
        setSnackbar({
          open: true,
          message: 'Không thể tải danh sách chủ đề: ' + (error.response?.data?.error || error.message),
          severity: 'error',
        });
      }
    };
    fetchTopics();
  }, []);
  const formik = useFormik({
    initialValues: {
      title: '',
      thumbnail: null,
      summary: '',
      images: [],
      content: '',
      published: false,
      userType: 'admin',
      topicId: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(255, 'Tối đa 255 ký tự')
        .required('Tiêu đề là bắt buộc'),
      summary: Yup.string()
        .max(255, 'Tối đa 255 ký tự')
        .required('Tóm tắt là bắt buộc'),
      content: Yup.string().required('Nội dung là bắt buộc'),
      userType: Yup.string()
        .oneOf(['student', 'teacher', 'admin'], 'Chọn loại tài khoản hợp lệ')
        .required('Loại tài khoản là bắt buộc'),
      topicId: Yup.string().required('Chủ đề là bắt buộc'), // Thêm validation cho topicId
      thumbnail: Yup.mixed()
        .required('Thumbnail là bắt buộc')
        .test('fileSize', 'Kích thước file tối đa là 2MB', (value) => 
          value && value.size <= 2 * 1024 * 1024
        )
        .test('fileType', 'Chỉ chấp nhận file ảnh', (value) => 
          value && value.type.startsWith('image/')
        ),
      images: Yup.array()
        .max(10, 'Tối đa 10 hình ảnh')
        .of(
          Yup.mixed()
            .test('fileSize', 'Kích thước file tối đa là 2MB', (value) => 
              value && value.size <= 2 * 1024 * 1024
            )
            .test('fileType', 'Chỉ chấp nhận file ảnh', (value) => 
              value && value.type.startsWith('image/')
            )
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsUploading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Vui lòng đăng nhập.');

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) throw new Error('Token hết hạn.');

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('summary', values.summary);
        formData.append('content', values.content);
        formData.append('published', values.published);
        formData.append('userType', values.userType);
        formData.append('thumbnail', values.thumbnail);
        formData.append('userId', decodedToken.id);
        formData.append('topicId', values.topicId);

        values.images.forEach((image) => formData.append('images', image));

        const response = await axios.post(API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: `Bearer ${token}`,
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
          message: response.data.message || 'Đăng bài thành công!',
          severity: 'success',
        });

        resetForm();
        setThumbnailPreview(null);
        setImagePreviews([]);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || error.message || 'Lỗi khi đăng bài';
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
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
    const validFiles = files.filter((file) => file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024);
    if (validFiles.length + imagePreviews.length > 10) {
      setSnackbar({
        open: true,
        message: 'Tối đa 10 hình ảnh!',
        severity: 'warning',
      });
      return;
    }
    formik.setFieldValue('images', [...formik.values.images, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...validFiles.map((file) => URL.createObjectURL(file))]);
    setSnackbar({
      open: true,
      message: `Đã chọn ${validFiles.length} hình ảnh`,
      severity: 'info',
    });
  };

  const removeImage = (index) => {
    const newImages = formik.values.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    formik.setFieldValue('images', newImages);
    setImagePreviews(newPreviews);
    setSnackbar({
      open: true,
      message: 'Đã xóa hình ảnh',
      severity: 'info',
    });
  };

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [thumbnailPreview, imagePreviews]);

  return (
    <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', p: 4, mt: 4, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Tạo Bài Viết Mới
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Tiêu đề"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          sx={{ mb: 3 }}
          variant="outlined"
        />
    
    <TextField
          fullWidth
          select
          label="Chủ đề"
          name="topicId"
          value={formik.values.topicId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.topicId && Boolean(formik.errors.topicId)}
          helperText={formik.touched.topicId && formik.errors.topicId}
          sx={{ mb: 3 }}
          variant="outlined"
        >
          {topics.length > 0 ? (
            topics.map((topic) => (
              <MenuItem key={topic._id} value={topic._id}>
                {topic.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Không có chủ đề nào</MenuItem>
          )}
        </TextField>

        <TextField
          fullWidth
          label="Tóm tắt"
          name="summary"
          value={formik.values.summary}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.summary && Boolean(formik.errors.summary)}
          helperText={formik.touched.summary && formik.errors.summary}
          sx={{ mb: 3 }}
          variant="outlined"
        />

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
          Thumbnail
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Tải lên Thumbnail
          <input type="file" accept="image/*" hidden onChange={handleThumbnailChange} />
        </Button>
        {thumbnailPreview && (
          <Box sx={{ mb: 2 }}>
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8 }}
            />
          </Box>
        )}
        {formik.touched.thumbnail && formik.errors.thumbnail && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {formik.errors.thumbnail}
          </Typography>
        )}

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
          Hình ảnh bổ sung (Tối đa 10)
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Tải lên hình ảnh
          <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
        </Button>
        <Box display="flex" gap={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {imagePreviews.map((src, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              <img
                src={src}
                alt={`Preview ${index}`}
                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
              />
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.7)' }}
                onClick={() => removeImage(index)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          ))}
        </Box>
        {formik.touched.images && formik.errors.images && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {formik.errors.images}
          </Typography>
        )}

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
          Nội dung
        </Typography>
        <Box sx={{ mb: 3 }}>
          <ReactQuill
            value={formik.values.content}
            onChange={(value) => formik.setFieldValue('content', value)}
            onBlur={() => formik.setFieldTouched('content', true)}
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            style={{ minHeight: '300px' }}
          />
          <style jsx global>{`
            .ql-editor {
              min-height: 300px !important;
              font-size: 16px;
              line-height: 1.8;
            }
            .ql-container {
              border-radius: 8px;
              border: 1px solid #ccc;
            }
            .ql-toolbar {
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
              border: 1px solid #ccc;
              border-bottom: none;
            }
          `}</style>
        </Box>
        {formik.touched.content && formik.errors.content && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {formik.errors.content}
          </Typography>
        )}

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
          sx={{ mb: 3 }}
          variant="outlined"
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
          sx={{ mb: 3 }}
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
          disabled={isUploading || formik.isSubmitting}
          sx={{ py: 1.5, fontSize: '1rem', bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
        >
          {isUploading ? 'Đang tải lên...' : 'Đăng bài viết'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreateNews;