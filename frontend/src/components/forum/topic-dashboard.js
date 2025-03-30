import React, { useEffect, useState, useCallback, memo } from 'react'
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

const TopicRow = memo(({ topic, index, onEdit, onDelete }) => (
  <TableRow>
    <TableCell>{index + 1}</TableCell>
    <TableCell>{topic.name}</TableCell>
    <TableCell>{topic.description || 'Không có mô tả'}</TableCell>
    <TableCell>{new Date(topic.createdAt).toLocaleDateString()}</TableCell>
    <TableCell>
      <IconButton color="primary" onClick={() => onEdit(topic)}>
        <EditIcon />
      </IconButton>
      <IconButton color="error" onClick={() => onDelete(topic._id)}>
        <DeleteIcon />
      </IconButton>
    </TableCell>
  </TableRow>
))

const TopicDashboard = () => {
  const dispatch = useDispatch()
  const { forumList = [], loading } = useSelector((state) => state.forum)
  const [dialogState, setDialogState] = useState({
    createOpen: false,
    updateOpen: false,
    deleteConfirm: null,
    selectedTopic: null
  })

  useEffect(() => {
    dispatch(getAllTopic())
  }, [dispatch])

  const handleEdit = useCallback((topic) => {
    setDialogState((prev) => ({
      ...prev,
      updateOpen: true,
      selectedTopic: topic
    }))
  }, [])

  const handleDelete = useCallback(
    async (topicId) => {
      await dispatch(deleteTopic(topicId))
      await dispatch(getAllTopic())
      setDialogState((prev) => ({ ...prev, deleteConfirm: null }))
    },
    [dispatch]
  )

  const handleTopicCreated = useCallback(() => {
    dispatch(getAllTopic())
  }, [dispatch])

  const toggleDialog = useCallback((type, value) => {
    setDialogState((prev) => ({ ...prev, [type]: value }))
  }, [])

  if (loading) {
    return (
      <Container>
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 5 }} />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🛠 Quản Lý Chủ Đề
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => toggleDialog('createOpen', true)}
        sx={{ mb: 2 }}
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
            {forumList.length > 0 ? (
              forumList.map((topic, index) => (
                <TopicRow
                  key={topic._id}
                  topic={topic}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={(id) => toggleDialog('deleteConfirm', id)}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  ❌ Không có chủ đề nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateTopicForum
        open={dialogState.createOpen}
        onClose={() => toggleDialog('createOpen', false)}
        onTopicCreated={handleTopicCreated}
      />

      <Dialog
        open={!!dialogState.deleteConfirm}
        onClose={() => toggleDialog('deleteConfirm', null)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa chủ đề này?</DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog('deleteConfirm', null)}>
            Hủy
          </Button>
          <Button
            color="error"
            onClick={() => handleDelete(dialogState.deleteConfirm)}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <UpdateTopic
        open={dialogState.updateOpen}
        onClose={() => toggleDialog('updateOpen', false)}
        topic={dialogState.selectedTopic}
      />
    </Container>
  )
}

export default TopicDashboard
