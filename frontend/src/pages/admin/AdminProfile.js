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
  Divider
} from '@mui/material'
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle'
import { useNavigate } from 'react-router-dom'
import { authLogout } from '../../redux/userRelated/userSlice'

const AdminProfile = () => {
  const [showEditForm, setShowEditForm] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser, response, error } = useSelector((state) => state.user)
  const address = 'Admin'

  // Form states
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [password, setPassword] = useState('')
  const [schoolName, setSchoolName] = useState(currentUser.schoolName)

  const fields =
    password === ''
      ? { name, email, schoolName }
      : { name, email, password, schoolName }

  const submitHandler = (event) => {
    event.preventDefault()
    dispatch(updateUser(fields, currentUser._id, address))
    setShowEditForm(false)
  }

  const deleteHandler = () => {
    try {
      dispatch(deleteUser(currentUser._id, 'Students'))
      dispatch(deleteUser(currentUser._id, address))
      dispatch(authLogout())
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Trang cá nhân
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary">
                  Họ tên
                </Typography>
                <Typography variant="body1">{currentUser.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{currentUser.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary">
                  Trường
                </Typography>
                <Typography variant="body1">
                  {currentUser.schoolName}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              startIcon={showEditForm ? <KeyboardArrowUp /> : <Edit />}
              onClick={() => setShowEditForm(!showEditForm)}
              sx={{ flex: 1 }}
            >
              {showEditForm ? 'Huỷ' : 'Chỉnh sửa'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={deleteHandler}
              sx={{ flex: 1 }}
            >
              Xoá tài khoản
            </Button>
          </Box>

          {/* Edit Form */}
          <Collapse in={showEditForm}>
            <Box component="form" onSubmit={submitHandler} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="School Name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password (optional)"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Lưu thay đổi
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminProfile
