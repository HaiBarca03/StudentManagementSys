import React, { useState, memo } from 'react'
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

const CreateTopicForum = memo(({ open, onClose, onTopicCreated }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await dispatch(createTopic(formData)).unwrap()
      setFormData({ name: '', description: '' })
      onClose()
      onTopicCreated?.(result)
      await dispatch(getAllTopic())
    } catch (error) {
      console.error('Lỗi khi tạo chủ đề:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo Chủ Đề Mới</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên Chủ Đề"
          fullWidth
          margin="dense"
          value={formData.name}
          onChange={handleChange('name')}
          disabled={loading}
          required
        />
        <TextField
          label="Mô Tả"
          fullWidth
          multiline
          rows={3}
          margin="dense"
          value={formData.description}
          onChange={handleChange('description')}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !formData.name}>
          {loading ? 'Đang tạo...' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default CreateTopicForum
