import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTopic, deleteTopic } from '../../redux/forumRelated/forumHandle'
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
  Tooltip,
  useTheme,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Skeleton
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Category,
  CalendarToday,
  Description,
  Forum
} from '@mui/icons-material'
import CreateTopicForum from './create-topic-forum'
import UpdateTopic from './update-topic'

const TopicDashboard = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { forumList = [], loading, response, error } = useSelector((state) => state.forum)
  
  const [state, setState] = useState({
    createOpen: false,
    updateOpen: false,
    deleteConfirm: null,
    selectedTopic: null,
    snackbar: {
      open: false,
      message: '',
      severity: 'success'
    }
  })

  useEffect(() => {
    dispatch(getAllTopic())
  }, [dispatch])

  useEffect(() => {
    if (response?.success) {
      showSnackbar(response.message || 'Thao tác thành công!', 'success')
      dispatch(getAllTopic()) // Refresh list after successful operation
    } else if (error) {
      showSnackbar(error || 'Đã xảy ra lỗi!', 'error')
    }
  }, [response, error, dispatch])

  const showSnackbar = (message, severity) => {
    setState(prev => ({
      ...prev,
      snackbar: { open: true, message, severity }
    }))
  }

  const handleEdit = (topic) => {
    setState(prev => ({
      ...prev,
      updateOpen: true,
      selectedTopic: topic
    }))
  }

  const handleDelete = async (topicId) => {
    await dispatch(deleteTopic(topicId))
    setState(prev => ({ ...prev, deleteConfirm: null }))
  }

  const handleTopicCreated = () => {
    setState(prev => ({ ...prev, createOpen: false }))
  }

  const toggleDialog = (type, value) => {
    setState(prev => ({ ...prev, [type]: value }))
  }

  const handleCloseSnackbar = () => {
    setState(prev => ({
      ...prev,
      snackbar: { ...prev.snackbar, open: false }
    }))
  }

  // Loading skeleton
  if (loading && !forumList.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={300} height={24} />
          </Box>
          <Skeleton variant="rounded" width={150} height={40} />
        </Stack>
        
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rounded" height={200} />
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            <Forum sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main }} />
            Quản lý chủ đề
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tổng số chủ đề: <Chip label={forumList.length} size="small" />
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => toggleDialog('createOpen', true)}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: '600',
            px: 3,
            py: 1
          }}
        >
          Tạo chủ đề mới
        </Button>
      </Stack>

      {/* Topics Grid */}
      {forumList.length > 0 ? (
        <Grid container spacing={3}>
          {forumList.map((topic) => (
            <Grid item xs={12} sm={6} md={4} key={topic._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[4]
                }
              }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <Category />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" fontWeight="600" noWrap>
                      {topic.name}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="caption" color="text.secondary">
                      {new Date(topic.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                    
                  }
                  sx={{ 
                    pb: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {topic.description || 'Chưa có mô tả'}
                  </Typography>
                  

                </CardContent>
                
                <Box sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      onClick={() => handleEdit(topic)}
                      size="small"
                      sx={{ 
                        mr: 1,
                        '&:hover': {
                          color: theme.palette.primary.main,
                          backgroundColor: theme.palette.primary.lighter
                        }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Xóa">
                    <IconButton
                      onClick={() => toggleDialog('deleteConfirm', topic._id)}
                      size="small"
                      sx={{
                        '&:hover': {
                          color: theme.palette.error.main,
                          backgroundColor: theme.palette.error.lighter
                        }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center', 
            p: 6, 
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Category sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Chưa có chủ đề nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Bắt đầu bằng cách tạo chủ đề mới để quản lý thảo luận
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => toggleDialog('createOpen', true)}
            sx={{ borderRadius: '10px' }}
          >
            Tạo chủ đề đầu tiên
          </Button>
        </Box>
      )}

      {/* Create Dialog */}
      <CreateTopicForum
        open={state.createOpen}
        onClose={() => toggleDialog('createOpen', false)}
        onTopicCreated={handleTopicCreated}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!state.deleteConfirm}
        onClose={() => toggleDialog('deleteConfirm', null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: '600' }}>
          <Delete color="error" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Bạn có chắc chắn muốn xóa chủ đề này?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tất cả bài viết liên quan sẽ bị xóa và không thể khôi phục.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => toggleDialog('deleteConfirm', null)}
            sx={{ borderRadius: '8px' }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(state.deleteConfirm)}
            sx={{ borderRadius: '8px' }}
          >
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      {state.selectedTopic && (
        <UpdateTopic
          open={state.updateOpen}
          onClose={() => toggleDialog('updateOpen', false)}
          topic={state.selectedTopic}
        />
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={state.snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={state.snackbar.severity}
          sx={{ width: '100%', borderRadius: '8px', alignItems: 'center' }}
          onClose={handleCloseSnackbar}
        >
          {state.snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default TopicDashboard