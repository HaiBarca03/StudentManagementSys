// Footer.js
import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

// Đảm bảo bạn đã cài Font Awesome trong dự án:
// npm install @fortawesome/fontawesome-free
// Thêm vào index.html: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

const FooterStyled = styled.footer`
  background-color: rgb(94, 6, 6);
  color: white;
  padding: 2rem 0;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 1rem;
  }

  .footer-section {
    flex: 1;
    min-width: 200px;
    margin: 1rem;
  }

  .footer-section h3 {
    margin-bottom: 1rem;
  }

  .footer-section ul {
    list-style: none;
    padding: 0;
  }

  .footer-section ul li {
    margin: 0.5rem 0;
  }

  .footer-section a {
    color: white;
    text-decoration: none;
  }

  .footer-section a:hover {
    text-decoration: underline;
  }

  .social-links a {
    display: block;
    margin: 0.5rem 0;
  }

  .stay-connected h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  .social-icons {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Căn trái để đồng bộ với các cột khác */
    gap: 1rem;
  }

  .social-row {
    display: flex;
    gap: 1rem;
  }

  .social-icons a {
    color: white;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s;
  }

  .social-icons a.tumblr { background-color: #36465d; }
  .social-icons a.twitter { background-color: #1da1f2; }
  .social-icons a.google-plus { background-color: #dd4b39; }
  .social-icons a.linkedin { background-color: #0077b5; }
  .social-icons a.facebook { background-color: #3b5998; }
  .social-icons a.youtube { background-color: #ff0000; }
  .social-icons a.rss { background-color: #f26522; }

  .social-icons a:hover {
    opacity: 0.8;
  }

  .footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #555;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .footer-container {
      flex-direction: column;
      text-align: center;
    }

    .social-icons {
      align-items: center; /* Căn giữa trên mobile */
    }

    .social-row {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
`;

const Footer = () => {
    return (
        <FooterStyled>
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Thành viên thực hiện ✅</h3>
                    <p>Đoàn Đức Hải - 2100903 (L)</p>
                    <p>Đặng Thị Soi - 2101164</p>
                    <p>Nguyễn Thu Hiền - 2101317</p>
                    <p>Trịnh Quốc Khánh - 2100853</p>
                    <p>Nguyễn Văn Quang - 2100857</p>
                </div>

                <div className="footer-section">
                    <h3>Danh mục trang 📌 </h3>
                    <ul>
                        <li><a href="/">Trang chủ</a></li>
                        <li><a href="/about">Diễn đàn</a></li>
                        <li><a href="/contact">Phản ánh</a></li>
                        <li><a href="/contact">Thông tin cá nhân</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Thông tin sản phẩm 🌐</h3>
                    <div className="social-links">
                        <a href="https://facebook.com">MongoBD</a>
                        <a href="https://twitter.com">Demo</a>
                        <a href="https://instagram.com">API</a>
                    </div>
                </div>

                <Box
                    className="footer-section stay-connected"
                    sx={{
                        flex: 1,
                        minWidth: 200,
                        margin: '1rem',
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h4"
                        sx={{
                            marginBottom: '1rem',
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}
                    >
                        Face Of The Project
                    </Typography>



                    <Box
                        className="avatar-group"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', // Căn giữa toàn bộ
                            gap: '1rem',
                        }}
                    >
                        {/* Hàng 1: 3 ảnh avatar */}
                        <Box
                            className="avatar-row"
                            sx={{
                                display: 'flex',
                                gap: '1rem',
                            }}
                        >
                            <Avatar
                                src="https://via.placeholder.com/40" // Thay bằng URL ảnh của bạn
                                alt="Hải"
                                sx={{ width: 50, height: 50 }}
                            />
                            <Avatar
                                src="https://via.placeholder.com/50"
                                alt="Soi"
                                sx={{ width: 50, height: 50 }}
                            />
                            <Avatar
                                src="https://via.placeholder.com/50"
                                alt="Hiền"
                                sx={{ width: 50, height: 50 }}
                            />
                        </Box>

                        {/* Hàng 2: 2 ảnh avatar */}
                        <Box
                            className="avatar-row"
                            sx={{
                                display: 'flex',
                                gap: '1rem',
                            }}
                        >
                            <Avatar
                                src="https://via.placeholder.com/50"
                                alt="Khánh"
                                sx={{ width: 50, height: 50 }}
                            />
                            <Avatar
                                src="https://via.placeholder.com/50"
                                alt="Quang"
                                sx={{ width: 50, height: 50 }}
                            />
                        </Box>
                    </Box>
                </Box>
            </div>

            <div className="footer-bottom">
                <p>@ Welcome to Group 10 - University Management Database System! 🎉</p>
            </div>
        </FooterStyled>
    );
};

export default Footer;