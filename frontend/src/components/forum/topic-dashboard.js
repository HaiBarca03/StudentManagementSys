import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTopic, deleteTopic } from '../../redux/forumRelated/forumHandle'
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
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateTopicForum from './create-topic-forum'
import UpdateTopic from './update-topic'

const TopicDashboard = () => {
  const dispatch = useDispatch()
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const { forumList = [], loading, error } = useSelector((state) => state.forum)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    dispatch(getAllTopic())
  }, [dispatch])

  const handleDelete = (topicId) => {
    dispatch(deleteTopic(topicId))
    dispatch(getAllTopic())
    setDeleteConfirm(null)
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        🛠 Quản Lý Chủ Đề
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => setOpenCreateDialog(true)}
      >
        Thêm Chủ Đề
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Tên Chủ Đề</TableCell>
              <TableCell>Mô Tả</TableCell>
              <TableCell>Ngày Tạo</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(forumList) && forumList.length > 0 ? (
              forumList.map((topic, index) => (
                <TableRow key={topic._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{topic.name}</TableCell>
                  <TableCell>{topic.description || 'Không có mô tả'}</TableCell>
                  <TableCell>
                    {new Date(topic.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedTopic(topic)
                        setUpdateDialogOpen(true)
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => setDeleteConfirm(topic._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography>❌ Không có chủ đề nào.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateTopicForum
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onTopicCreated={(newTopic) => console.log('Chủ đề mới:', newTopic)}
      />

      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa chủ đề này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)} color="secondary">
            Hủy
          </Button>
          <Button onClick={() => handleDelete(deleteConfirm)} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <UpdateTopic
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        topic={selectedTopic}
      />
    </Container>
  )
}

export default TopicDashboard
