import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { AccountCircle, School, Groups, ArrowForward } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector(state => state.user);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigateHandler = (user) => {
    const credentials = {
      Admin: { email: "yogendra@12", password },
      Student: { rollNum: "1", studentName: "Dipesh Awasthi", password },
      Teacher: { email: "tony@12", password }
    };

    if (visitor === "guest") {
      setLoader(true);
      dispatch(loginUser(credentials[user], user));
    } else {
      navigate(`/${user}login`);
    }
  };

  useEffect(() => {
    if (status === 'success' && currentUser) {
      navigate(`/${currentRole}/dashboard`);
    } else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  const userTypes = [
    {
      role: "Admin",
      icon: <AccountCircle fontSize="large" />,
      description: "Login as an administrator to access the dashboard to manage app data."
    },
    {
      role: "Student",
      icon: <School fontSize="large" />,
      description: "Login as a student to explore course materials and assignments."
    },
    {
      role: "Teacher",
      icon: <Groups fontSize="large" />,
      description: "Login as a teacher to create courses, assignments, and track student progress."
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 8
    }}>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            <Typography variant="h3" align="center" sx={{ 
              mb: 6,
              color: 'white',
              fontWeight: 700,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              Welcome to Learning Portal
            </Typography>
            
            <Typography variant="h6" align="center" sx={{ 
              mb: 8,
              color: 'rgba(255,255,255,0.8)',
              maxWidth: 600,
              mx: 'auto'
            }}>
              Select your role to continue {visitor === "guest" ? "as guest" : "to login"}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {userTypes.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user.role}>
                  <Paper
                    elevation={hoveredCard === user.role ? 8 : 3}
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        background: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
                      }
                    }}
                    onClick={() => navigateHandler(user.role)}
                    onMouseEnter={() => setHoveredCard(user.role)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Box sx={{
                      width: 80,
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }}>
                      {user.icon}
                    </Box>
                    
                    <Typography variant="h5" sx={{ 
                      mb: 2,
                      color: 'white',
                      fontWeight: 600
                    }}>
                      {user.role}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ 
                      mb: 3,
                      color: 'rgba(255,255,255,0.8)'
                    }}>
                      {user.description}
                    </Typography>
                    
                    <IconButton
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)'
                        }
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
          backdropFilter: 'blur(4px)'
        }}
        open={loader}
      >
        <Box textAlign="center">
          <CircularProgress color="inherit" size={60} thickness={5} sx={{ mb: 3 }} />
          <Typography variant="h6" sx={{ color: 'white' }}>
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
  );
};

export default ChooseUser;