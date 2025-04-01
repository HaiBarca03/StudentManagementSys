import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Collapse,
  TextField,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material'
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete,
  Save,
  Cancel
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle'
import { useNavigate } from 'react-router-dom'
import { authLogout } from '../../redux/userRelated/userSlice'

const TeacherProfile = () => {
  const [showEditForm, setShowEditForm] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser, response, error } = useSelector((state) => state.user)
  const theme = useTheme()

  // Form states
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [password, setPassword] = useState('')
  const teachSclass = currentUser.teachSclass
  const teachSubject = currentUser.teachSubject
  const teachSchool = currentUser.school

  const fields =
    password === ''
      ? { name, email }
      : { name, email, password }

  const submitHandler = (event) => {
    event.preventDefault()
    dispatch(updateUser(fields, currentUser._id, 'Teacher'))
    setShowEditForm(false)
  }

  const handleDelete = () => {
    try {
      dispatch(deleteUser(currentUser._id, 'Teacher'))
      dispatch(authLogout())
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      my: 4,
      padding: 2
    }}>
      <Paper elevation={0} sx={{
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: theme.shadows[4],
        background: theme.palette.background.paper
      }}>
        <Box sx={{
          height: 120,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.info.main} 100%)`
        }} />
        
        <Box sx={{ px: 4, pb: 4, position: 'relative' }}>
          <Avatar sx={{
            width: 120,
            height: 120,
            border: `4px solid ${theme.palette.background.paper}`,
            position: 'absolute',
            top: -135,
            left: 40,
            fontSize: 48,
            backgroundColor: theme.palette.secondary.dark
          }}>
            {currentUser.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              {currentUser.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Giáo viên
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {currentUser.email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Lớp giảng dạy
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {teachSclass.sclassName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Môn học
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {teachSubject.subName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Trường
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {teachSchool.schoolName}
                </Typography>
              </Grid>
            </Grid>
            
            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexDirection: { xs: 'column', sm: 'row' },
              mt: 4
            }}>
              <Button
                variant="contained"
                startIcon={showEditForm ? <Cancel /> : <Edit />}
                onClick={() => setShowEditForm(!showEditForm)}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 16
                }}
              >
                {showEditForm ? 'Huỷ chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setOpenDeleteDialog(true)}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 16
                }}
              >
                Xoá tài khoản
              </Button>
            </Box>

            {/* Edit Form */}
            <Collapse in={showEditForm}>
              <Box 
                component="form" 
                onSubmit={submitHandler} 
                sx={{ 
                  mt: 4,
                  p: 3,
                  borderRadius: 2,
                  background: theme.palette.background.default
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Họ tên"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mật khẩu mới (tuỳ chọn)"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      size="small"
                      helperText="Để trống nếu không muốn đổi mật khẩu"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<Save />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: 16
                      }}
                    >
                      Lưu thay đổi
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác nhận xoá tài khoản</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xoá tài khoản này? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
          >
            Huỷ
          </Button>
          <Button 
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            Xác nhận xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TeacherProfile