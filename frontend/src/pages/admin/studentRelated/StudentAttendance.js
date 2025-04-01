import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getUserDetails } from '../../../redux/userRelated/userHandle'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle'
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle'

import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack,
  TextField,
  CircularProgress,
  FormControl,
  Paper,
  Avatar,
  Divider,
  useTheme
} from '@mui/material'
import { PurpleButton } from '../../../components/buttonStyles'
import Popup from '../../../components/Popup'
import { Event, Person, School, Today } from '@mui/icons-material'

const StudentAttendance = ({ situation }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { currentUser, userDetails, loading } = useSelector(
    (state) => state.user
  )
  const { subjectsList } = useSelector((state) => state.sclass)
  const { response, error, statestatus } = useSelector((state) => state.student)
  const params = useParams()

  const [studentID, setStudentID] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [chosenSubName, setChosenSubName] = useState('')
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if (situation === 'Student') {
      setStudentID(params.id)
      const stdID = params.id
      dispatch(getUserDetails(stdID, 'Student'))
    } else if (situation === 'Subject') {
      const { studentID, subjectID } = params
      setStudentID(studentID)
      dispatch(getUserDetails(studentID, 'Student'))
      setChosenSubName(subjectID)
    }
  }, [situation])

  useEffect(() => {
    if (userDetails && userDetails.sclassName && situation === 'Student') {
      dispatch(getSubjectList(userDetails.sclassName._id, 'ClassSubjects'))
    }
  }, [dispatch, userDetails])

  const changeHandler = (event) => {
    const selectedSubject = subjectsList.find(
      (subject) => subject.subName === event.target.value
    )
    setSubjectName(selectedSubject.subName)
    setChosenSubName(selectedSubject._id)
  }

  const fields = { subName: chosenSubName, status, date }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(updateStudentFields(studentID, fields, 'StudentAttendance'))
  }

  useEffect(() => {
    if (response) {
      setLoader(false)
      setShowPopup(true)
      setMessage(response)
    } else if (error) {
      setLoader(false)
      setShowPopup(true)
      setMessage('error')
    } else if (statestatus === 'added') {
      setLoader(false)
      setShowPopup(true)
      setMessage('Điểm danh thành công!')
    }
  }, [response, statestatus, error])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        backgroundColor: theme.palette.background.default
      }}
    >
      {loading ? (
        <CircularProgress size={60} />
      ) : (
        <Paper
          elevation={3}
          sx={{
            maxWidth: 600,
            width: '100%',
            p: 4,
            borderRadius: 4,
            background: theme.palette.background.paper
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: theme.palette.primary.main
              }}
            >
              <Event fontSize="large" />
            </Avatar>
            <Typography
              variant="h4"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              ĐIỂM DANH SINH VIÊN
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>

          <Stack spacing={3} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person color="primary" />
              <Typography variant="body1">
                <strong>Họ tên:</strong> {userDetails?.name || 'Chưa có dữ liệu'}
              </Typography>
            </Box>

            {currentUser.teachSubject && situation === 'Subject' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <School color="primary" />
                <Typography variant="body1">
                  <strong>Môn học:</strong> {currentUser.teachSubject?.subName}
                </Typography>
              </Box>
            )}
          </Stack>

          <form onSubmit={submitHandler}>
            <Stack spacing={3}>
              {situation === 'Student' && (
                <FormControl fullWidth>
                  <InputLabel id="subject-select-label">
                    Chọn môn học
                  </InputLabel>
                  <Select
                    labelId="subject-select-label"
                    value={subjectName}
                    label="Chọn môn học"
                    onChange={changeHandler}
                    required
                    sx={{ borderRadius: 2 }}
                  >
                    {subjectsList ? (
                      subjectsList.map((subject, index) => (
                        <MenuItem key={index} value={subject.subName}>
                          {subject.subName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="Select Subject">
                        Thêm môn học để điểm danh
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              )}

              <FormControl fullWidth>
                <InputLabel id="status-select-label">
                  Trạng thái điểm danh
                </InputLabel>
                <Select
                  labelId="status-select-label"
                  value={status}
                  label="Trạng thái điểm danh"
                  onChange={(event) => setStatus(event.target.value)}
                  required
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="Present">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: 'success.main'
                        }}
                      />
                      Có mặt
                    </Box>
                  </MenuItem>
                  <MenuItem value="Absent">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: 'error.main'
                        }}
                      />
                      Vắng mặt
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Today color="primary" />
                  <TextField
                    fullWidth
                    label="Chọn ngày"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                    InputLabelProps={{
                      shrink: true
                    }}
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
              </FormControl>
            </Stack>

            <PurpleButton
              fullWidth
              size="large"
              sx={{ mt: 4, py: 1.5, borderRadius: 2, fontSize: 16 }}
              variant="contained"
              type="submit"
              disabled={loader}
              startIcon={
                loader ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {loader ? 'Đang xử lý...' : 'XÁC NHẬN ĐIỂM DANH'}
            </PurpleButton>
          </form>
        </Paper>
      )}

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Box>
  )
}

export default StudentAttendance