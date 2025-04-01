import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Logout, Cancel } from '@mui/icons-material';

const LogoutPage = () => {
    const currentUser = useSelector(state => state.user.currentUser);
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
        setOpen(false);
    };

    const handleCancel = () => {
        navigate(-1);
        setOpen(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                p: 2
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 2
                }}
            >
                <Avatar
                    src={currentUser?.avatar}
                    sx={{
                        width: 80,
                        height: 80,
                        mb: 2,
                        mx: 'auto',
                        bgcolor: 'primary.main'
                    }}
                >
                    {currentUser?.name?.charAt(0)}
                </Avatar>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {currentUser?.name}
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Bạn có chắc chắn muốn đăng xuất?
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{ flex: 1 }}
                    >
                        Đăng xuất
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        sx={{ flex: 1 }}
                    >
                        Hủy bỏ
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default LogoutPage;