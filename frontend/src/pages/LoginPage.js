import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop,
  Fade,
  Container
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff, ArrowForward } from '@mui/icons-material';
import bgpic from '../assets/designlogin.jpg';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

// Modern theme with custom palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
    rollNumber: false,
    studentName: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const errors = {};
    if (role === 'Student') {
      if (!formData.get('rollNumber')) errors.rollNumber = true;
      if (!formData.get('studentName')) errors.studentName = true;
    } else {
      if (!formData.get('email')) errors.email = true;
    }
    if (!formData.get('password')) errors.password = true;

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const fields = role === 'Student' 
      ? { 
          rollNum: formData.get('rollNumber'),
          studentName: formData.get('studentName'),
          password: formData.get('password')
        }
      : {
          email: formData.get('email'),
          password: formData.get('password')
        };

    setLoader(true);
    dispatch(loginUser(fields, role));
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    setFormErrors(prev => ({ ...prev, [name]: false }));
  };

  const guestModeHandler = () => {
    const credentials = {
      Admin: { email: 'yogendra@12', password: 'zxc' },
      Student: { rollNum: '1', studentName: 'Dipesh Awasthi', password: 'zxc' },
      Teacher: { email: 'tony@12', password: 'zxc' }
    };
    
    setGuestLoader(true);
    dispatch(loginUser(credentials[role], role));
  };

  useEffect(() => {
    if (status === 'success' && currentUser) {
      navigate(`/${currentRole}/dashboard`);
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setMessage('Network Error');
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ minHeight: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Container maxWidth="sm">
            <Fade in timeout={500}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 4,
                }}
              >
                <Box sx={{ width: '100%', mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    {role} Portal
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Welcome back! Please sign in to continue
                  </Typography>
                </Box>

                <Box 
                  component="form" 
                  onSubmit={handleSubmit} 
                  sx={{ width: '100%' }}
                >
                  {role === 'Student' ? (
                    <>
                      <TextField
                        margin="normal"
                        fullWidth
                        id="rollNumber"
                        label="Roll Number"
                        name="rollNumber"
                        autoComplete="off"
                        autoFocus
                        error={formErrors.rollNumber}
                        helperText={formErrors.rollNumber && 'Required field'}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        margin="normal"
                        fullWidth
                        id="studentName"
                        label="Full Name"
                        name="studentName"
                        autoComplete="name"
                        error={formErrors.studentName}
                        helperText={formErrors.studentName && 'Required field'}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                      />
                    </>
                  ) : (
                    <TextField
                      margin="normal"
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      error={formErrors.email}
                      helperText={formErrors.email && 'Required field'}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                    />
                  )}

                  <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type={toggle ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    error={formErrors.password}
                    helperText={formErrors.password && 'Required field'}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={() => setToggle(!toggle)}
                            edge="end"
                          >
                            {toggle ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          color="primary" 
                          sx={{ 
                            '&.Mui-checked': { color: 'primary.main' } 
                          }} 
                        />
                      }
                      label="Remember me"
                    />
                    <Typography 
                      component={Link}
                      to="#"
                      sx={{ 
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontSize: 14,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Forgot password?
                    </Typography>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      mt: 2,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                      }
                    }}
                    disabled={loader}
                  >
                    {loader ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <Button
                    fullWidth
                    onClick={guestModeHandler}
                    variant="outlined"
                    size="large"
                    sx={{
                      mt: 1,
                      py: 1.5,
                      borderRadius: 2,
                      borderWidth: 2,
                      '&:hover': { borderWidth: 2 }
                    }}
                    disabled={guestLoader}
                  >
                    {guestLoader ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Continue as Guest'
                    )}
                  </Button>

                  {role === 'Admin' && (
                    <Typography sx={{ mt: 3, textAlign: 'center' }}>
                      Don't have an account?{' '}
                      <Typography 
                        component={Link}
                        to="/Adminregister"
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 500,
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        Sign up
                      </Typography>
                    </Typography>
                  )}
                </Box>
              </Box>
            </Fade>
          </Container>
        </Grid>

        <Grid
          item
          xs={false}
          md={6}
          sx={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${bgpic})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', md: 'block' }
          }}
        />
      </Grid>

      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)'
        }}
        open={guestLoader}
      >
        <Box textAlign="center">
          <CircularProgress color="inherit" sx={{ mb: 2 }} />
          <Typography variant="h6">Loading Guest Session</Typography>
        </Box>
      </Backdrop>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </ThemeProvider>
  );
};

export default LoginPage;