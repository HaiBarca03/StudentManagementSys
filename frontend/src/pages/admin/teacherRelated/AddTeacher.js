import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle'
import Popup from '../../../components/Popup'
import { registerUser } from '../../../redux/userRelated/userHandle'
import { underControl } from '../../../redux/userRelated/userSlice'
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/system'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: 'auto',
  maxWidth: 500,
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

const AddTeacher = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subjectID = params.id

  const { status, response, error } = useSelector((state) => state.user)
  const { subjectDetails } = useSelector((state) => state.sclass)

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, 'Subject'))
  }, [dispatch, subjectID])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [loader, setLoader] = useState(false)

  const role = 'Teacher'
  const school = subjectDetails && subjectDetails.school
  const teachSubject = subjectDetails && subjectDetails._id
  const teachSclass =
    subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName._id

  const fields = {
    name,
    email,
    password,
    role,
    school,
    teachSubject,
    teachSclass
  }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(registerUser(fields, role))
  }

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl())
      navigate('/Admin/teachers')
    } else if (status === 'failed') {
      setMessage(response)
      setShowPopup(true)
      setLoader(false)
    } else if (status === 'error') {
      setMessage('Network Error')
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch])

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h4" align="center" gutterBottom color="primary">
        Thêm giảng viên
      </Typography>
      <form onSubmit={submitHandler}>
        <Grid container spacing={2}>
          {/* Subject and Class Info */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              Môn học: {subjectDetails ? subjectDetails.subName : 'Loading...'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Lớp:{' '}
              {subjectDetails && subjectDetails.sclassName
                ? subjectDetails.sclassName.sclassName
                : 'Loading...'}
            </Typography>
          </Grid>

          {/* Form Fields */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              variant="outlined"
              placeholder="Enter teacher's name..."
              autoComplete="name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              variant="outlined"
              placeholder="Enter teacher's email..."
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              variant="outlined"
              placeholder="Enter teacher's password..."
              autoComplete="new-password"
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <StyledButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loader}
              startIcon={
                loader && <CircularProgress size={24} color="inherit" />
              }
            >
              {loader ? 'Registering...' : 'Register'}
            </StyledButton>
          </Grid>
        </Grid>
      </form>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </StyledPaper>
  )
}

export default AddTeacher
