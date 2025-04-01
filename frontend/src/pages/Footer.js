import { Avatar, Box, Typography, Container, Link } from '@mui/material'
import React from 'react'
import styled from '@emotion/styled'

const FooterStyled = styled.footer`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
`

const FooterContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
`

const FooterSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const FooterTitle = styled(Typography)`
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 0.75rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: rgba(255, 255, 255, 0.5);
  }
`

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: inline-block;
  
  &:hover {
    color: white;
    transform: translateX(4px);
  }
`

const MemberItem = styled(Typography)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.6;
`

const AvatarGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`

const AvatarRow = styled(Box)`
  display: flex;
  gap: 1rem;
  justify-content: center;
`

const FooterBottom = styled(Box)`
  text-align: center;
  padding-top: 2.5rem;
  margin-top: 2.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`

const SocialLink = styled(Link)`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`

const Footer = () => {
  return (
    <FooterStyled>
      <FooterContainer maxWidth="lg">
        <FooterSection>
          <FooterTitle variant="h6">Thành viên thực hiện</FooterTitle>
          <Box display="flex" flexDirection="column" gap={1}>
            <MemberItem>Đoàn Đức Hải - 2100903 (L)</MemberItem>
            <MemberItem>Đặng Thị Soi - 2101164</MemberItem>
            <MemberItem>Nguyễn Thu Hiền - 2101317</MemberItem>
            <MemberItem>Trịnh Quốc Khánh - 2100853</MemberItem>
            <MemberItem>Nguyễn Văn Quang - 2100857</MemberItem>
          </Box>
        </FooterSection>

        <FooterSection>
          <FooterTitle variant="h6">Danh mục trang</FooterTitle>
          <FooterList>
            <li><FooterLink href="/">Trang chủ</FooterLink></li>
            <li><FooterLink href="/forum">Diễn đàn</FooterLink></li>
            <li><FooterLink href="#">Phản ánh</FooterLink></li>
            <li><FooterLink href="#">Thông tin cá nhân</FooterLink></li>
          </FooterList>
        </FooterSection>

        <FooterSection>
          <FooterTitle variant="h6">Thông tin sản phẩm</FooterTitle>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <SocialLink href="https://student-sys-fe.vercel.app">MongoDB</SocialLink>
            <SocialLink href="https://student-sys-fe.vercel.app">Demo</SocialLink>
            <SocialLink href="https://student-sys.vercel.app">API</SocialLink>
          </Box>
        </FooterSection>

        <FooterSection>
          <FooterTitle variant="h6" textAlign="left">Face Of The Project</FooterTitle>
          <AvatarGroup>
            <AvatarRow>
              <Avatar
                src="https://res.cloudinary.com/demwoy6ku/image/upload/v1743508853/anhthe_v1_grpn55.jpg"
                alt="Hải"
                sx={{ width: 56, height: 56, border: '2px solid white' }}
              />
              <Avatar
                src="https://res.cloudinary.com/demwoy6ku/image/upload/v1743356233/news_images/zjyl9khql1slqapkvnka.jpg"
                alt="Soi"
                sx={{ width: 56, height: 56, border: '2px solid white' }}
              />
              <Avatar
                src="https://res.cloudinary.com/demwoy6ku/image/upload/v1743509154/z6321503142207_11c7187bce51a692632024598d21293b_wuw7um.jpg"
                alt="Hiền"
                sx={{ width: 56, height: 56, border: '2px solid white' }}
              />
            </AvatarRow>
            <AvatarRow>
              <Avatar
                src="https://res.cloudinary.com/demwoy6ku/image/upload/v1743509152/9d6b2a40-56e4-4977-80ab-117e8fa97646_okjzdj.jpg"
                alt="Khánh"
                sx={{ width: 56, height: 56, border: '2px solid white' }}
              />
              <Avatar
                src="https://res.cloudinary.com/demwoy6ku/image/upload/v1743509153/z6321498102634_c4afce58903bb6b7d9caf6612d4e1f61_wzkvtm.jpg"
                alt="Quang"
                sx={{ width: 56, height: 56, border: '2px solid white' }}
              />
            </AvatarRow>
          </AvatarGroup>
        </FooterSection>
      </FooterContainer>

      <FooterBottom>
        <Typography variant="body2">
          @ Welcome to Group 10 - University Management Database System! 🎉
        </Typography>
      </FooterBottom>
    </FooterStyled>
  )
}

export default Footer