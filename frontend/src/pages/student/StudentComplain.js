import { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  useTheme,
  InputAdornment,
  Divider
} from '@mui/material'
import Popup from '../../components/Popup'
import { BlueButton } from '../../components/buttonStyles'
import { addStuff } from '../../redux/userRelated/userHandle'
import { useDispatch, useSelector } from 'react-redux'
import { InsertComment, CalendarMonth, Send } from '@mui/icons-material'

const StudentComplain = () => {
  const theme = useTheme()
  const [complaint, setComplaint] = useState('')
  const [date, setDate] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const dispatch = useDispatch()
  const { status, currentUser, error } = useSelector((state) => state.user)

  const user = currentUser._id
  const school = currentUser.school._id
  const address = 'Complain'

  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const fields = {
    user,
    date,
    complaint,
    school
  }

  const submitHandler = (event) => {
    event.preventDefault()
    if (isSubmitted) return // Prevent multiple submissions
    
    setLoader(true)
    setIsSubmitted(true)
    dispatch(addStuff(fields, address))
  }

  useEffect(() => {
    if (status === 'added') {
      setLoader(false)
      setShowPopup(true)
      setMessage('Ý kiến của bạn đã được gửi thành công!')
      setComplaint('')
      setDate('')
      setIsSubmitted(false)
    } else if (error) {
      setLoader(false)
      setShowPopup(true)
      setMessage(error.message || 'Có lỗi xảy ra khi gửi ý kiến. Vui lòng thử lại!')
      setIsSubmitted(false)
    }
  }, [status, error])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        p: 2,
        backgroundColor: theme.palette.background.default
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 600,
          borderRadius: '12px',
          boxShadow: theme.shadows[3],
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <InsertComment
              fontSize="large"
              sx={{ color: theme.palette.primary.main }}
            />
            <Typography variant="h4" fontWeight="600">
              Đóng góp ý kiến
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Alert severity="info" sx={{ mb: 3 }}>
            Mọi ý kiến đóng góp của bạn sẽ giúp chúng tôi cải thiện chất lượng dịch vụ.
          </Alert>

          <form onSubmit={submitHandler}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Ngày gửi"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth color="action" />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />

              <TextField
                fullWidth
                label="Nội dung ý kiến"
                variant="outlined"
                value={complaint}
                onChange={(event) => setComplaint(event.target.value)}
                required
                multiline
                rows={4}
                InputProps={{
                  sx: {
                    borderRadius: '8px'
                  }
                }}
                placeholder="Hãy chia sẻ ý kiến, góp ý của bạn..."
              />
            </Stack>

            <BlueButton
              fullWidth
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600'
              }}
              variant="contained"
              type="submit"
              disabled={loader || isSubmitted}
              startIcon={
                loader ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Send fontSize="small" />
                )
              }
            >
              {loader ? 'Đang gửi...' : 'Gửi ý kiến'}
            </BlueButton>
          </form>
        </CardContent>
      </Card>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        severity={status === 'added' ? 'success' : 'error'}
      />
    </Box>
  )
}

export default StudentComplain