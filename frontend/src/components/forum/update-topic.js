import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { updateTopic } from '../../redux/forumRelated/forumHandle'

const UpdateTopic = ({ open, onClose, topic }) => {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (topic) {
      setName(topic.name)
      setDescription(topic.description || '')
    }
  }, [topic])

  const handleUpdate = () => {
    if (!name.trim()) return

    dispatch(updateTopic(topic._id, { name, description }))
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập Nhật Chủ Đề</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên Chủ Đề"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Mô Tả"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleUpdate} color="primary" variant="contained">
          Cập Nhật
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateTopic
