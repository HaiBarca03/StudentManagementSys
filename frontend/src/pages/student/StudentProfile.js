import React from 'react';
import styled from 'styled-components';
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
} from '@mui/material';
import { useSelector } from 'react-redux';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Public as PublicIcon,
  People as PeopleIcon,
  Cake as CakeIcon,
  School as SchoolIcon,
  Workspaces as WorkspacesIcon,
  EmojiNature as EmojiNatureIcon,
  Person as PersonIcon,
  Transgender as TransgenderIcon,
  Translate as TranslateIcon,
  MenuBook as MenuBookIcon,
  CastForEducation as CastForEducationIcon
} from '@mui/icons-material';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const personalInfoItems = [
    {
      icon: <CakeIcon />,
      label: 'Ngày Sinh',
      value: formatDate(currentUser.dateOfBirth)
    },
    {
      icon: currentUser.sex === 'male' ? <PersonIcon /> : <TransgenderIcon />,
      label: 'Giới Tính',
      value: currentUser.sex === 'male' ? 'Nam' : 'Nữ'
    },
    { icon: <EmailIcon />, label: 'Email', value: currentUser.email },
    { icon: <PhoneIcon />, label: 'SĐT', value: currentUser.phone },
    { icon: <HomeIcon />, label: 'Địa chỉ', value: currentUser.address },
    { icon: <PublicIcon />, label: 'Quốc tịch', value: currentUser.nationality },
    { icon: <PeopleIcon />, label: 'Dân tộc', value: currentUser.nation },
    { icon: <EmojiNatureIcon />, label: 'Tôn giáo', value: currentUser.religion },
    { icon: <MenuBookIcon />, label: 'Ngành học', value: currentUser.major },
    {
      icon: <CastForEducationIcon />,
      label: 'Trình độ đào tạo',
      value: currentUser.trainingLevel
    }
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
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
              border: '3px solid',
              borderColor: 'primary.main'
            }}
          >
            {!currentUser.images[0]?.url && String(currentUser.name).charAt(0)}
          </Avatar>

          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
            align="center"
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
              <strong>Lớp:</strong> {currentUser.sclassName?.sclassName || '---'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              <strong>Trường:</strong> {currentUser.school?.schoolName || '---'}
            </Typography>
          </Box>
        </Box>
      </ProfileCard>

      {/* Personal Information Card */}
      <InfoCard elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <SchoolIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h2" fontWeight="bold">
              Thông Tin Cá Nhân
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {personalInfoItems.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box display="flex" alignItems="center" minHeight={60}>
                  <Box mr={2} color="primary.main">
                    {item.icon}
                  </Box>
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
  );
};

export default StudentProfile;

// Styled Components
const ProfileCard = styled(Paper)`
  border-radius: 16px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const InfoCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;