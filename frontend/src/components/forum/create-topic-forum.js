import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { createTopic, getAllTopic } from '../../redux/forumRelated/forumHandle'

const CreateTopicForum = ({ open, onClose, onTopicCreated }) => {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const newTopic = { name, description }

    try {
      const result = await dispatch(createTopic(newTopic)).unwrap()
      dispatch(getAllTopic())
      onTopicCreated(result)
      onClose()
    } catch (error) {
      console.error('Lỗi khi tạo chủ đề:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tạo Chủ Đề Mới</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên Chủ Đề"
          fullWidth
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Mô Tả"
          fullWidth
          multiline
          rows={3}
          margin="dense"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateTopicForum
