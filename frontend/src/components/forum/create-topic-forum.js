import React, { useState, memo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { createTopic, getAllTopic } from '../../redux/forumRelated/forumHandle'

const CreateTopicForum = memo(({ open, onClose, onTopicCreated }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (error) setError(null)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Tên chủ đề là bắt buộc')
      return
    }

    setLoading(true)
    try {
      const result = await dispatch(createTopic(formData)).unwrap()
      setFormData({ name: '', description: '' })
      await dispatch(getAllTopic()) // Cập nhật danh sách ngay lập tức
      onTopicCreated?.(result) // Gọi callback nếu có
    } catch (error) {
      console.error('Lỗi khi tạo chủ đề:', error)
      setError(error.message || 'Đã xảy ra lỗi khi tạo chủ đề')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '', description: '' })
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: '1.5rem',
        fontWeight: 600,
        px: 3,
        pt: 3,
        pb: 0
      }}>
        Tạo chủ đề mới
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TextField
          label="Tên chủ đề"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange('name')}
          disabled={loading}
          required
          error={!!error && !formData.name.trim()}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />
        
        <TextField
          label="Mô tả (tuỳ chọn)"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={formData.description}
          onChange={handleChange('description')}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            textTransform: 'none'
          }}
        >
          Huỷ bỏ
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.name.trim()}
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            textTransform: 'none',
            minWidth: '100px'
          }}
        >
          {loading ? (
            <Box display="flex" alignItems="center">
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Đang tạo...
            </Box>
          ) : (
            'Tạo mới'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default CreateTopicForum