import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
  Typography,
  IconButton,
  Fade
} from '@mui/material'
import {
  AccountCircle,
  School,
  Groups,
  ArrowForward
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/userRelated/userHandle'
import Popup from '../components/Popup'

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const password = 'zxc'

  const { status, currentUser, currentRole } = useSelector(
    (state) => state.user
  )
  const [loader, setLoader] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)

  const navigateHandler = (user) => {
    const credentials = {
      Admin: { email: 'yogendra@12', password },
      Student: { rollNum: '1', studentName: 'Dipesh Awasthi', password },
      Teacher: { email: 'tony@12', password }
    }

    if (visitor === 'guest') {
      setLoader(true)
      dispatch(loginUser(credentials[user], user))
    } else {
      navigate(`/${user}login`)
    }
  }

  useEffect(() => {
    if (status === 'success' && currentUser) {
      navigate(`/${currentRole}/dashboard`)
    } else if (status === 'error') {
      setLoader(false)
      setMessage('Network Error')
      setShowPopup(true)
    }
  }, [status, currentRole, navigate, currentUser])

  const userTypes = [
    {
      role: 'Admin',
      icon: <AccountCircle fontSize="large" />,
      description:
        'Đăng nhập quản trị viên để truy cập bảng điều khiển và quản lý dữ liệu.'
    },
    {
      role: 'Student',
      icon: <School fontSize="large" />,
      description: 'Đăng nhập sinh viên để theo dõi môn học và bài tập..'
    },
    {
      role: 'Teacher',
      icon: <Groups fontSize="large" />,
      description:
        'Đăng nhập giáo viên để quản lý môn học, bài tập và theo dõi tiến độ.'
    }
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #6b48ff 0%, #00ddeb 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 0,
        paddingBottom: 10
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            <Typography
              variant="h3"
              align="center"
              sx={{
                mb: 4,
                color: '#ffffff',
                fontWeight: 700,
                textShadow: '0 2px 15px rgba(0,0,0,0.3)',
                letterSpacing: '0.5px'
              }}
            >
              Cổng thông tin học tập
            </Typography>

            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 4,
                color: 'rgba(255,255,255,0.9)', // Chữ trắng nhẹ
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 300
              }}
            >
              Chọn vai trò để{' '}
              {visitor === 'guest'
                ? 'để đăng nhập với tài khoản khách'
                : 'để đăng nhập'}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {userTypes.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user.role}>
                  <Paper
                    elevation={hoveredCard === user.role ? 12 : 4}
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      background: 'rgba(251, 251, 251, 0.95)', // Card trắng nhẹ
                      border: '1px solid rgba(255,255,255,0.2)',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        background: '#ffffff'
                      }
                    }}
                    onClick={() => navigateHandler(user.role)}
                    onMouseEnter={() => setHoveredCard(user.role)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        borderRadius: '50%',
                        bgcolor: '#f0f4ff', // Nền icon tím nhạt
                        color: '#6b48ff', // Icon tím
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: '#00ddeb', // Hover xanh cyan
                          color: '#ffffff'
                        }
                      }}
                    >
                      {user.icon}
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        color: '#6b48ff', // Chữ tím đậm
                        fontWeight: 600
                      }}
                    >
                      {user.role}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        color: '#5c6378', // Xám tím nhạt
                        fontWeight: 400
                      }}
                    >
                      {user.description}
                    </Typography>

                    <IconButton
                      sx={{
                        color: '#ffffff',
                        bgcolor: '#6b48ff', // Nút tím đậm
                        '&:hover': {
                          bgcolor: '#00ddeb', // Hover xanh cyan
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <ArrowForward />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(5px)',
          background: 'rgba(0,0,0,0.4)' // Backdrop tối nhẹ
        }}
        open={loader}
      >
        <Box textAlign="center">
          <CircularProgress
            color="inherit"
            size={60}
            thickness={5}
            sx={{ mb: 3 }}
          />
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Loading {hoveredCard} Portal...
          </Typography>
        </Box>
      </Backdrop>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Box>
  )
}

export default ChooseUser
