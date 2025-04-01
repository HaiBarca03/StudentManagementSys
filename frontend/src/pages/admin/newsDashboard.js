import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Pagination,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Search, CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HeadForum from '../../components/forum/head-forum';

const NewsDashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showApproved, setShowApproved] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();


  const fetchNews = async () => {
    try {
      setLoading(true);
      console.log('Fetching news with params:', {
        page,
        limit,
        approved: !showApproved,
        search: searchTerm
      });
      
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/news`, {
        params: {
          page,
          limit,
          approved: !showApproved,
          search: searchTerm
        },
        headers: {
          token: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      console.log('News API response:', response.data);
      setNews(response.data.news);
      setTotalPages(response.data.totalPages);
      setTotalNews(response.data.totalNews);
    } catch (err) {
      console.error('Error fetching news:', {
        message: err.message,
        response: err.response,
        stack: err.stack
      });
      setError(err.response?.data?.error || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/news/stats/monthly`, {
        headers: {
          token: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Xử lý dữ liệu nhận được
      const processedData = response.data.map(item => ({
        ...item,
        name: item.month, // Recharts cần trường 'name' cho XAxis
        approved: item.approved || 0, // Đảm bảo có giá trị số
        pending: item.pending || 0
      }));
      
      setStatsData(processedData);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setSnackbar({
        open: true,
        message: 'Không thể tải dữ liệu thống kê',
        severity: 'error'
      });
    } finally {
      setStatsLoading(false);
    }
  };
  useEffect(() => {
    fetchNews();
  }, [page, showApproved, searchTerm]);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token') || currentUser?.token;
      
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
  
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/news/approve/${id}`,
        {},
        {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Bài viết đã được duyệt thành công',
          severity: 'success'
        });
        fetchNews();
      }
    } catch (err) {
      console.error('Chi tiết lỗi:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
  
      let errorMessage = 'Không thể duyệt bài viết';
      if (err.response?.status === 400) {
        errorMessage = err.response.data.message || 'Yêu cầu không hợp lệ';
      } else if (err.response?.status === 401) {
        errorMessage = 'Bạn cần đăng nhập lại';
      } else if (err.response?.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện hành động này';
      }
  
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
        details: err.response?.data?.error
      });
    }
  };

  const handlePreview = (newsItem) => {
    setSelectedNews(newsItem);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedNews(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(e.target.value);
      setPage(1);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  if (!currentUser || currentUser.role !== 'Admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Bạn không có quyền truy cập trang này
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <HeadForum />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý bài viết
        </Typography>
        {/* <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Thống kê bài viết theo tháng
          </Typography>
          
          {statsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', height: 300, alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : statsData.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', height: 300, lineHeight: '300px' }}>
              Không có dữ liệu thống kê
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={statsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.replace('/', '/')}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: 'Số bài viết', 
                    angle: -90, 
                    position: 'insideLeft',
                    fontSize: 12 
                  }}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Số bài']}
                  labelFormatter={(label) => `Tháng: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="approved" 
                  name="Bài đã duyệt" 
                  fill="#4caf50" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="pending" 
                  name="Bài chờ duyệt" 
                  fill="#ff9800" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box> */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm bài viết..."
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />
            }}
            onKeyPress={handleSearch}
          />
          <Button
            variant="contained"
            color={showApproved ? 'primary' : 'secondary'}
            onClick={() => setShowApproved(!showApproved)}
          >
            {showApproved ? 'Hiển thị bài chưa duyệt' : 'Hiển thị bài đã duyệt'}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Tác giả</TableCell>
                    <TableCell>Chủ đề</TableCell>
                    <TableCell>Ngày đăng</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {news.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          onClick={() => handlePreview(item)}
                        >
                          {item.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={item.userId?.avatar}
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                          {item.userId?.name || 'Ẩn danh'}
                        </Box>
                      </TableCell>
                      <TableCell>{item.topicId?.name || 'Không có'}</TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.approved ? 'Đã duyệt' : 'Chờ duyệt'}
                          color={item.approved ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handlePreview(item)}
                          startIcon={<Visibility />}
                        >
                          Xem
                        </Button>
                        {!item.approved && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApprove(item._id)}
                            startIcon={<CheckCircle />}
                          >
                            Duyệt
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onClose={handleClosePreview} maxWidth="md" fullWidth>
          {selectedNews && (
            <>
              <DialogTitle>{selectedNews.title}</DialogTitle>
              <DialogContent dividers>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Tác giả:</strong> {selectedNews.userId?.name || 'Ẩn danh'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Chủ đề:</strong> {selectedNews.topicId?.name || 'Không có'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Ngày đăng:</strong> {formatDate(selectedNews.createdAt)}
                  </Typography>
                </Box>
                {selectedNews.thumbnail && (
                  <Box sx={{ mb: 2 }}>
                    <img
                      src={selectedNews.thumbnail.url}
                      alt="Thumbnail"
                      style={{ maxWidth: '100%', maxHeight: '300px' }}
                    />
                  </Box>
                )}
                <Typography variant="h6" gutterBottom>
                  Tóm tắt
                </Typography>
                <Typography paragraph>{selectedNews.summary}</Typography>
                <Typography variant="h6" gutterBottom>
                  Nội dung
                </Typography>
                <Typography paragraph>{selectedNews.content}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePreview}>Đóng</Button>
                {!selectedNews.approved && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      handleApprove(selectedNews._id);
                      handleClosePreview();
                    }}
                    startIcon={<CheckCircle />}
                  >
                    Duyệt bài
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default NewsDashboard;