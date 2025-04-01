import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Box, 
  Button, 
  Typography, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import Students from "../assets/students.svg";

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
        }}>
          <Grid container>
            {!isMobile && (
              <Grid item md={6} sx={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 4
              }}>
                <img 
                  src={Students} 
                  alt="students" 
                  style={{ 
                    width: '100%',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
                    transform: 'scale(1.05)'
                  }} 
                />
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <Box sx={{
                p: { xs: 3, md: 6 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Typography variant="h2" component="h1" sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2
                }}>
                  Chào mừng đến với hệ thống Quản lý Trường Học
                </Typography>
                
                <Typography variant="body1" sx={{
                  color: 'text.secondary',
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}>
                    Đơn giản hóa việc quản lý trường học, tổ chức lớp học, thêm sinh viên và giảng viên.
                    Theo dõi điểm danh, đánh giá hiệu suất và gửi phản hồi dễ dàng.
                    Truy cập hồ sơ, xem điểm số và liên lạc thuận tiện.
                </Typography>
                
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mb: 2
                }}>
                  <Button
                    component={Link}
                    to="/choose"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)',
                      }
                    }}
                  >
                    Login
                  </Button>
                  
                  <Button
                    component={Link}
                    to="/chooseasguest"
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderWidth: 2,
                      '&:hover': { 
                        borderWidth: 2,
                        backgroundColor: 'rgba(63, 81, 181, 0.04)'
                      }
                    }}
                  >
                    Login as Guest
                  </Button>
                </Box>
                
                <Typography variant="body2" sx={{ 
                  textAlign: 'center',
                  mt: 2,
                  color: 'text.secondary'
                }}>
                  Don't have an account?{' '}
                  <Button 
                    component={Link}
                    to="/Adminregister"
                    size="small"
                    sx={{ 
                      textTransform: 'none',
                      color: 'primary.main',
                      fontWeight: 500,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Sign up
                  </Button>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Homepage;