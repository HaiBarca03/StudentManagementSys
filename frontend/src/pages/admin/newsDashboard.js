import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
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
} from '@mui/material'
import {
  Search,
  CheckCircle,
  Cancel,
  Visibility,
  Delete as DeleteIcon,
  AutoDelete
} from '@mui/icons-material'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import HeadForum from '../../components/forum/head-forum'
import { deleteNew } from '../../redux/forumRelated/forumHandle'

const NewsDashboard = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalNews, setTotalNews] = useState(0)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [showApproved, setShowApproved] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [statsData, setStatsData] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newsToDelete, setNewsToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/news`,
        {
          params: {
            page,
            limit,
            approved: !showApproved,
            search: searchTerm
          },
          headers: {
            token: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      setNews(response.data.news)
      setTotalPages(response.data.totalPages)
      setTotalNews(response.data.totalNews)
    } catch (err) {
      console.error('Error fetching news:', {
        message: err.message,
        response: err.response,
        stack: err.stack
      })
      setError(err.response?.data?.error || 'Failed to fetch news')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/news/stats/monthly`,
        {
          headers: {
            token: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      const processedData = response.data.map((item) => ({
        ...item,
        name: item.month,
        approved: item.approved || 0,
        pending: item.pending || 0
      }))

      setStatsData(processedData)
    } catch (err) {
      console.error('Error fetching stats:', err)
      setSnackbar({
        open: true,
        message: 'Không thể tải dữ liệu thống kê',
        severity: 'error'
      })
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [page, showApproved, searchTerm])

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token') || currentUser?.token

      if (!token) {
        throw new Error('Không tìm thấy token xác thực')
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/news/approve/${id}`,
        {},
        {
          headers: {
            token: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Bài viết đã được duyệt thành công',
          severity: 'success'
        })
        fetchNews()
      }
    } catch (err) {
      console.error('Chi tiết lỗi:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })

      let errorMessage = 'Không thể duyệt bài viết'
      if (err.response?.status === 400) {
        errorMessage = err.response.data.message || 'Yêu cầu không hợp lệ'
      } else if (err.response?.status === 401) {
        errorMessage = 'Bạn cần đăng nhập lại'
      } else if (err.response?.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện hành động này'
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
        details: err.response?.data?.error
      })
    }
  }

  const handlePreview = (newsItem) => {
    // Tạo bản sao của newsItem để không ảnh hưởng đến dữ liệu gốc
    const processedNewsItem = { ...newsItem };
    
    // Xử lý nội dung: loại bỏ các thẻ HTML không mong muốn và mã đặc biệt
    if (processedNewsItem.content) {
      // Thay thế các thẻ HTML không cần thiết
      let cleanContent = processedNewsItem.content
        .replace(/<\/?span[^>]*>/g, '')
        .replace(/<\/?s>/g, '')
        .replace(/<\/?p>/g, '\n') // Thay thế thẻ p bằng xuống dòng
        .replace(/<br\s*\/?>/g, '\n') // Thay thế thẻ br bằng xuống dòng
        .replace(/&nbsp;/g, ' ') // Thay thế &nbsp; bằng khoảng trắng
        .replace(/&[a-z]+;/g, ''); // Loại bỏ các HTML entities khác
      
      processedNewsItem.content = cleanContent;
    }
    
    setSelectedNews(processedNewsItem);
    setPreviewOpen(true);
  };

  const handleDeleteClick = (newId) => {
    setNewsToDelete(newId)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await dispatch(deleteNew(newsToDelete)).unwrap()
      fetchNews()
      setSnackbar({
        open: true,
        message: 'Bài viết đã được xóa thành công',
        severity: 'success'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Xóa bài viết thất bại: ' + error.message,
        severity: 'error'
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setNewsToDelete(null)
    }
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setNewsToDelete(null)
  }

  const handleClosePreview = () => {
    setPreviewOpen(false)
    setSelectedNews(null)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(e.target.value)
      setPage(1)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('vi-VN', options)
  }

  if (!currentUser || currentUser.role !== 'Admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Bạn không có quyền truy cập trang này
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <HeadForum />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý bài viết
        </Typography>

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
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleDeleteClick(item._id)}
                          startIcon={<DeleteIcon />}
                          color="error"
                        >
                          Xoá
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
        <Dialog
          open={previewOpen}
          onClose={handleClosePreview}
          maxWidth="md"
          fullWidth
        >
          {selectedNews && (
            <>
              <DialogTitle>{selectedNews.title}</DialogTitle>
              <DialogContent dividers>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Tác giả:</strong>{' '}
                    {selectedNews.userId?.name || 'Ẩn danh'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Chủ đề:</strong>{' '}
                    {selectedNews.topicId?.name || 'Không có'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Ngày đăng:</strong>{' '}
                    {formatDate(selectedNews.createdAt)}
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
                <Box sx={{ 
                  whiteSpace: 'pre-line',
                  fontFamily: 'inherit',
                  lineHeight: 1.6
                }}>
                  {selectedNews.content}
                </Box>
              <Typography paragraph>{selectedNews.content}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePreview}>Đóng</Button>
                {!selectedNews.approved && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      handleApprove(selectedNews._id)
                      handleClosePreview()
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseDeleteDialog}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleDelete} 
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
  )
}

export default NewsDashboard