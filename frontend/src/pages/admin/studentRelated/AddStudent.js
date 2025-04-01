import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../../redux/userRelated/userHandle'
import Popup from '../../../components/Popup'
import { underControl } from '../../../redux/userRelated/userSlice'
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle'
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/system'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: 'auto',
  maxWidth: 800,
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: '#fff'
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: 8,
  textTransform: 'none',
  fontSize: '1.1rem'
}))

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()

  const userState = useSelector((state) => state.user)
  const { status, currentUser, response, error } = userState
  const { sclassesList } = useSelector((state) => state.sclass)
  const [formData, setFormData] = useState({
    name: '',
    rollNum: '',
    password: '',
    sclassName: '',
    major: 'Công nghệ thông tin',
    schoolEntryDay: '',
    status: 'Đang học',
    nation: 'Kinh',
    religion: 'Phật',
    nationality: 'Việt Nam',
    typeOfTraining: 'Chính quy',
    trainingLevel: 'Đại học'
  })
  const adminID = currentUser._id
  const role = 'Student'
  const attendance = []

  useEffect(() => {
    dispatch(getAllSclasses(adminID, 'Sclass'))
  }, [adminID, dispatch])

  useEffect(() => {
    if (sclassesList.length > 0) {
      if (situation === 'Class' && params.id) {
        setFormData((prev) => ({
          ...prev,
          sclassName: params.id
        }))
      } else if (situation === 'Student' && !formData.sclassName) {
        setFormData((prev) => ({
          ...prev,
          sclassName: sclassesList[0]._id
        }))
      }
    }
  }, [params.id, situation, sclassesList])

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [loader, setLoader] = useState(false)

  const changeHandler = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const submitHandler = (event) => {
    event.preventDefault()
    if (!formData.sclassName) {
      setMessage('Vui lòng chọn lớp học')
      setShowPopup(true)
      return
    }
    setLoader(true)
    dispatch(registerUser({ ...formData, adminID, role, attendance }, role))
  }

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl())
      navigate(-1)
    } else if (status === 'failed' || status === 'error') {
      setMessage(status === 'failed' ? response : 'Network Error')
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch])

  if (!sclassesList.length) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6">Loading classes...</Typography>
        <CircularProgress />
      </div>
    )
  }

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h4" align="center" gutterBottom color="primary">
        Thêm Sinh Viên
      </Typography>
      <form onSubmit={submitHandler}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Họ và tên"
              name="name"
              value={formData.name}
              onChange={changeHandler}
              required
              variant="outlined"
            />
            {situation === 'Student' && (
              <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                <InputLabel>Lớp</InputLabel>
                <Select
                  name="sclassName"
                  value={formData.sclassName}
                  onChange={changeHandler}
                  label="Lớp"
                  required
                >
                  <MenuItem value="">
                    <em>Select Class</em>
                  </MenuItem>
                  {sclassesList.map((classItem) => (
                    <MenuItem key={classItem._id} value={classItem._id}>
                      {classItem.sclassName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <TextField
              fullWidth
              label="Mã sinh viên"
              name="rollNum"
              type="number"
              value={formData.rollNum}
              onChange={changeHandler}
              required
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={changeHandler}
              required
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel>Chuyên ngành</InputLabel>
              <Select
                name="major"
                value={formData.major}
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
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ngày nhập học"
              name="schoolEntryDay"
              type="date"
              value={formData.schoolEntryDay}
              onChange={changeHandler}
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={formData.status}
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
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel>Dân tộc</InputLabel>
              <Select
                name="nation"
                value={formData.nation}
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
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel>Tôn giáo</InputLabel>
              <Select
                name="religion"
                value={formData.religion}
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
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel>Quốc gia</InputLabel>
              <Select
                name="nationality"
                value={formData.nationality}
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
          </Grid>
        </Grid>
        <StyledButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loader}
          startIcon={loader && <CircularProgress size={24} color="inherit" />}
        >
          {loader ? 'Đang thêm...' : 'Thêm'}
        </StyledButton>
      </form>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </StyledPaper>
  )
}

export default AddStudent
