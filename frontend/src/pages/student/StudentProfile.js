import React from 'react'
import styled from 'styled-components'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Container,
  Paper,
  Divider,
  Chip
} from '@mui/material'
import { useSelector } from 'react-redux'
import {
  Email,
  Phone,
  Home,
  Public,
  People,
  Cake,
  School,
  Workspaces
} from '@mui/icons-material'

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user)
  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('vi-VN')
  }

  const personalInfoItems = [
    {
      icon: <Cake />,
      label: 'Ngày Sinh',
      value: formatDate(currentUser.dateOfBirth)
    },
    {
      icon: null,
      label: 'Giới Tính',
      value: currentUser.sex === 'male' ? 'Nam' : 'Nữ'
    },
    { icon: <Email />, label: 'Email', value: currentUser.email },
    { icon: <Phone />, label: 'SĐT', value: currentUser.phone },
    { icon: <Home />, label: 'Địa chỉ', value: currentUser.address },
    { icon: <Public />, label: 'Quốc tịch', value: currentUser.nationality },
    { icon: <People />, label: 'Dân tộc', value: currentUser.nation },
    { icon: null, label: 'Tôn giáo', value: currentUser.religion },
    { icon: <School />, label: 'Ngành học', value: currentUser.major },
    {
      icon: <Workspaces />,
      label: 'Trình độ đào tạo',
      value: currentUser.trainingLevel
    }
  ]

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Profile Header Card */}
      <ProfileCard elevation={3}>
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
          <Avatar
            alt="Student Avatar"
            src={currentUser.images[0]?.url}
            sx={{
              width: 120,
              height: 120,
              fontSize: '3rem',
              mb: 2,
              border: '3px solid #1976d2'
            }}
          >
            {!currentUser.images[0]?.url && String(currentUser.name).charAt(0)}
          </Avatar>

          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {currentUser.name}
          </Typography>

          <Chip
            label={`Mã sinh viên: ${currentUser.rollNum}`}
            color="primary"
            variant="outlined"
            sx={{ mb: 1 }}
          />

          <Box textAlign="center" mt={1}>
            <Typography variant="subtitle1" color="text.secondary">
              <strong>Lớp:</strong> {currentUser.sclassName.sclassName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              <strong>Trường:</strong> {currentUser.school.schoolName}
            </Typography>
          </Box>
        </Box>
      </ProfileCard>

      {/* Personal Information Card */}
      <InfoCard elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Thông Tin Cá Nhân
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {personalInfoItems.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box display="flex" alignItems="center">
                  {item.icon && (
                    <Box mr={2} color="primary.main">
                      {item.icon}
                    </Box>
                  )}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {item.value || '---'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </InfoCard>
    </Container>
  )
}

export default StudentProfile

// Styled Components
const ProfileCard = styled(Paper)`
  border-radius: 16px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  overflow: hidden;
`

const InfoCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`
