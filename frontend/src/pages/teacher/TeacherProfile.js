import React from 'react'
import styled from 'styled-components'
import { Card, CardContent, Typography } from '@mui/material'
import { useSelector } from 'react-redux'

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user)
  const teachSclass = currentUser.teachSclass
  const teachSubject = currentUser.teachSubject
  const teachSchool = currentUser.school

  return (
    <Container>
      <ProfileCard>
        <ProfileCardContent>
          <Title>Thông Tin Giáo Viên</Title>
          <ProfileText>
            <strong>Tên:</strong> {currentUser.name}
          </ProfileText>
          <ProfileText>
            <strong>Email:</strong> {currentUser.email}
          </ProfileText>
          <ProfileText>
            <strong>Lớp:</strong> {teachSclass.sclassName}
          </ProfileText>
          <ProfileText>
            <strong>Môn Học:</strong> {teachSubject.subName}
          </ProfileText>
          <ProfileText>
            <strong>Trường:</strong> {teachSchool.schoolName}
          </ProfileText>
        </ProfileCardContent>
      </ProfileCard>
    </Container>
  )
}

export default TeacherProfile

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`

const ProfileCard = styled(Card)`
  width: 450px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  background-color: #ffffff;
`

const ProfileCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
`

const Title = styled(Typography).attrs({ variant: 'h5' })`
  font-weight: bold;
  margin-bottom: 16px;
`

const ProfileText = styled(Typography).attrs({ variant: 'body1' })`
  margin: 8px 0;
`
