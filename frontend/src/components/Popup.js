import * as React from 'react';
import { useDispatch } from 'react-redux';
import { underControl } from '../redux/userRelated/userSlice';
import { underStudentControl } from '../redux/studentRelated/studentSlice';
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';

const Popup = ({ 
    message, 
    setShowPopup, 
    showPopup, 
    severity,  // Optional explicit severity prop
    autoHideDuration = 3000 
}) => {
    const dispatch = useDispatch();

    const vertical = "top";
    const horizontal = "right";

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowPopup(false);
        dispatch(underControl());
        dispatch(underStudentControl());
    };

    // Enhanced severity detection with Vietnamese support
    const detectSeverity = () => {
        // Use explicit severity if provided
        if (severity) return severity;
        
        if (!message) return 'info';
        
        const msg = message.toLowerCase();
        
        // Success cases (English and Vietnamese)
        if (msg.includes('success') || 
            msg.includes('thành công') || 
            msg.includes('hoàn tất') ||
            msg.includes('done')) {
            return 'success';
        }
        
        // Error cases (English and Vietnamese)
        if (msg.includes('error') || 
            msg.includes('lỗi') || 
            msg.includes('fail') ||
            msg.includes('thất bại')) {
            return 'error';
        }
        
        // Warning cases (English and Vietnamese)
        if (msg.includes('warning') || 
            msg.includes('cảnh báo') || 
            msg.includes('chú ý')) {
            return 'warning';
        }
        
        // Default to info
        return 'info';
    };

    const alertSeverity = detectSeverity();

    return (
        <Snackbar 
            open={showPopup} 
            autoHideDuration={autoHideDuration} 
            onClose={handleClose} 
            anchorOrigin={{ vertical, horizontal }} 
            key={vertical + horizontal}
        >
            <Alert 
                onClose={handleClose} 
                severity={alertSeverity}
                sx={{ 
                    width: '100%',
                    minWidth: '300px',
                    borderRadius: '8px',
                    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
                    '& .MuiAlert-message': {
                        padding: '8px 0'
                    }
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Popup;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert 
        elevation={6} 
        ref={ref} 
        variant="filled" 
        {...props} 
    />;
});