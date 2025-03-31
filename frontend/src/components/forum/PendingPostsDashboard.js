import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPendingPosts, approvePost, rejectPost } from '../../redux/forumRelated/forumHandle'
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'

const PendingPostsDashboard = () => {
  const dispatch = useDispatch()
  const { pendingPosts = [], loading, error } = useSelector((state) => state.forum)
  const [selectedPost, setSelectedPost] = useState(null)
  const [actionConfirm, setActionConfirm] = useState(null)
  const [actionType, setActionType] = useState('')

  useEffect(() => {
    dispatch(getPendingPosts())
  }, [dispatch])

  const handleApprove = (postId) => {
    dispatch(approvePost(postId))
    dispatch(getPendingPosts())
    setActionConfirm(null)
  }

  const handleReject = (postId) => {
    dispatch(rejectPost(postId))
    dispatch(getPendingPosts())
    setActionConfirm(null)
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        📝 Duyệt Bài Viết
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Tiêu Đề</TableCell>
              <TableCell>Tác Giả</TableCell>
              <TableCell>Chủ Đề</TableCell>
              <TableCell>Ngày Tạo</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(pendingPosts) && pendingPosts.length > 0 ? (
              pendingPosts.map((post, index) => (
                <TableRow key={post._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.author?.name || 'Unknown'}</TableCell>
                  <TableCell>{post.topic?.name || 'No Topic'}</TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => setSelectedPost(post)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => {
                        setActionConfirm(post._id)
                        setActionType('approve')
                      }}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setActionConfirm(post._id)
                        setActionType('reject')
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>❌ Không có bài viết nào đang chờ duyệt.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(actionConfirm)}
        onClose={() => setActionConfirm(null)}
      >
        <DialogTitle>Xác nhận hành động</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn {actionType === 'approve' ? 'duyệt' : 'từ chối'} bài viết này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionConfirm(null)} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={() => 
              actionType === 'approve' 
                ? handleApprove(actionConfirm) 
                : handleReject(actionConfirm)
            }
            color={actionType === 'approve' ? 'success' : 'error'}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedPost?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">
            Tác giả: {selectedPost?.author?.name}
          </Typography>
          <Typography variant="subtitle2">
            Chủ đề: {selectedPost?.topic?.name}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {selectedPost?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPost(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default PendingPostsDashboard