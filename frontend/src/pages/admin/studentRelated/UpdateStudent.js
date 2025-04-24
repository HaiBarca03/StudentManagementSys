import React, { useEffect, useState } from 'react'
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Avatar
} from '@mui/material'
import { updateStudent } from '../../../redux/studentRelated/studentHandle'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserDetails } from '../../../redux/userRelated/userHandle'
const UpdateStudent = ({ studentID, userDetails }) => {
  const [newImages, setNewImages] = useState([])
  const [localUserDetails, setLocalUserDetails] = useState(userDetails)
  const [previewImages, setPreviewImages] = useState(
    userDetails.images?.length > 0 ? [userDetails.images[0].url] : []
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const changeHandler = (e) => {
    const { name, value } = e.target
    setLocalUserDetails((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setNewImages(files)
      setPreviewImages(files.map((file) => URL.createObjectURL(file)))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    navigate(`/Admin/students/student/${studentID}`)

    const formData = new FormData()
    formData.append('name', localUserDetails.name)
    formData.append('rollNum', localUserDetails.rollNum)
    formData.append('email', localUserDetails.email)
    formData.append('phone', localUserDetails.phone)
    formData.append('major', localUserDetails.major)
    formData.append('sex', localUserDetails.sex)
    formData.append('schoolEntryDay', localUserDetails.schoolEntryDay)
    formData.append('dateOfBirth', localUserDetails.dateOfBirth)
    formData.append('status', localUserDetails.status)
    formData.append('nation', localUserDetails.nation)
    formData.append('religion', localUserDetails.religion)
    formData.append('nationality', localUserDetails.nationality)
    formData.append('address', localUserDetails.address)

    if (newImages.length > 0) {
      newImages.forEach((file) => formData.append('images', file))
    }

    const userId = userDetails._id
    await dispatch(updateStudent(userId, formData))
    await dispatch(getUserDetails(studentID, 'Student'))
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <Grid container spacing={3}>
        {/* Cột trái */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Họ và tên"
            name="name"
            value={localUserDetails.name || userDetails.name}
            onChange={changeHandler}
            required
            variant="outlined"
            sx={{ backgroundColor: '#fff', borderRadius: 1 }}
          />
          <TextField
            fullWidth
            label="Mã sinh viên"
            name="rollNum"
            type="number"
            value={localUserDetails.rollNum || userDetails.rollNum}
            onChange={changeHandler}
            required
            variant="outlined"
            sx={{ mt: 2, backgroundColor: '#fff', borderRadius: 1 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={localUserDetails.email || userDetails.email}
            onChange={changeHandler}
            required
            variant="outlined"
            sx={{ mt: 2, backgroundColor: '#fff', borderRadius: 1 }}
          />
          <TextField
            fullWidth
            label="Số điện thoại"
            name="phone"
            type="number"
            value={localUserDetails.phone || userDetails.phone}
            onChange={changeHandler}
            required
            variant="outlined"
            sx={{ mt: 2, backgroundColor: '#fff', borderRadius: 1 }}
          />
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 2, backgroundColor: '#fff' }}
          >
            <InputLabel>Chuyên ngành</InputLabel>
            <Select
              name="major"
              value={localUserDetails.major || userDetails.major}
              onChange={changeHandler}
              label="Chuyên ngành"
            >
              {[
                'Công nghệ thông tin',
                'Quản trị kinh doanh',
                'Kế toán',
                'Du lịch',
                'Ngôn ngữ Anh',
                'Kỹ thuật ô tô',
                'Kỹ thuật điện',
                'Cơ điện tử',
                'Thiết kế đồ hoạ'
              ].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Ngày sinh"
            name="dateOfBirth"
            type="date"
            value={
              localUserDetails.dateOfBirth.split('T')[0] ||
              userDetails.dateOfBirth.split('T')[0]
            }
            onChange={changeHandler}
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2, backgroundColor: '#fff', borderRadius: 1 }}
          />
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 2, backgroundColor: '#fff' }}
          >
            <InputLabel>Giới tính</InputLabel>
            <Select
              name="sex"
              value={localUserDetails.sex || userDetails.sex}
              onChange={changeHandler}
              label="Giới tính"
            >
              {[
                { label: 'Nam', value: 'male' },
                { label: 'Nữ', value: 'female' }
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Cột phải */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ngày nhập học"
            name="schoolEntryDay"
            type="date"
            value={
              localUserDetails.schoolEntryDay.split('T')[0] ||
              userDetails.schoolEntryDay.split('T')[0]
            }
            onChange={changeHandler}
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ backgroundColor: '#fff', borderRadius: 1 }}
          />
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 2, backgroundColor: '#fff' }}
          >
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={localUserDetails.status || userDetails.status}
              onChange={changeHandler}
              label="Trạng thái"
            >
              {[
                'Đang học',
                'Đã học xong',
                'Đã nghỉ học',
                'Đã chuyển trường'
              ].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 2, backgroundColor: '#fff' }}
          >
            <InputLabel>Dân tộc</InputLabel>
            <Select
              name="nation"
              value={localUserDetails.nation || userDetails.nation}
              onChange={changeHandler}
              label="Dân tộc"
            >
              {['Kinh', 'Mường', 'Tày', 'Nùng'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 2, backgroundColor: '#fff' }}
          >
            <InputLabel>Tôn giáo</InputLabel>
            <Select
              name="religion"
              value={localUserDetails.religion || userDetails.religion}
              onChange={changeHandler}
              label="Tôn giáo"
            >
              {['Phật', 'Cao đài', 'Hồi giáo', 'Kito', 'Tin lành'].map(
                (option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 2, backgroundColor: '#fff' }}
          >
            <InputLabel>Quốc gia</InputLabel>
            <Select
              name="nationality"
              value={localUserDetails.nationality || userDetails.nationality}
              onChange={changeHandler}
              label="Quốc gia"
            >
              {['Việt Nam', 'Lào', 'Campuchia', 'Thái Lan', 'Indonesia'].map(
                (option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Địa chỉ"
            name="address"
            value={localUserDetails.address || userDetails.address}
            onChange={changeHandler}
            variant="outlined"
            sx={{ mt: 2, backgroundColor: '#fff', borderRadius: 1 }}
          />
        </Grid>

        {/* Phần upload ảnh */}
        <Grid item xs={12}>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="label"
              sx={{ borderRadius: 2 }}
            >
              Tải lên ảnh
              <input type="file" hidden multiple onChange={handleImageChange} />
            </Button>
            {previewImages.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {previewImages.map((src, index) => (
                  <Avatar
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    sx={{ width: 80, height: 80, borderRadius: 2 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 3, borderRadius: 2, width: '100%' }}
      >
        Lưu
      </Button>
    </form>
  )
}

export default UpdateStudent
