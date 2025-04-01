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
  Paper
} from '@mui/material'
import { useSelector } from 'react-redux'

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user)

  if (response) {
    console.log(response)
  } else if (error) {
    console.log(error)
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('vi-VN')
  }

  console.log('currentUser', currentUser)

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <StyledPaper elevation={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Avatar
                  alt="Student Avatar"
                  src={currentUser.images[0]?.url}
                  sx={{ width: 150, height: 150 }}
                >
                  {!currentUser.images[0]?.url &&
                    String(currentUser.name).charAt(0)}{' '}
                </Avatar>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" component="h2" textAlign="center">
                  {currentUser.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography
                  variant="subtitle1"
                  component="p"
                  textAlign="center"
                >
                  Mã sinh viên: {currentUser.rollNum}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography
                  variant="subtitle1"
                  component="p"
                  textAlign="center"
                >
                  Lớp: {currentUser.sclassName.sclassName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography
                  variant="subtitle1"
                  component="p"
                  textAlign="center"
                >
                  Trường: {currentUser.school.schoolName}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông Tin Cá Nhân
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Ngày Sinh:</strong>{' '}
                  {formatDate(currentUser.dateOfBirth)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Giới Tính:</strong>{' '}
                  {currentUser.sex === 'male' ? 'Nam' : 'Nữ'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Email:</strong> {currentUser.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>SĐT:</strong> {currentUser.phone}{' '}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Địa chỉ:</strong> {currentUser.address}{' '}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Quốc tịch:</strong> {currentUser.nationality}{' '}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Dân tộc:</strong> {currentUser.nation}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Tôn giáo:</strong> {currentUser.religion}{' '}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Ngành học:</strong> {currentUser.major}{' '}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Trình độ đào tạo:</strong> {currentUser.trainingLevel}{' '}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default StudentProfile

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`
