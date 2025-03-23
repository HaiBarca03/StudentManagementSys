const express = require('express');
const { getAllNews, getNewsById, createNews } = require('../controllers/newsController');
const { authorizeUser } = require('../middlewares/auth'); // ✅ Sửa lỗi: import đúng tên
const { uploadImages, uploadThumbnail } = require('../middlewares/uploadCloudinary');

const router = express.Router();

// Debug để kiểm tra kiểu dữ liệu
console.log("uploadImages type:", typeof uploadImages); // Phải là "function"
console.log("uploadThumbnail type:", typeof uploadThumbnail); // Phải là "function"
console.log("createNews type:", typeof createNews); // Phải là "function"
console.log("authorizeUser type:", typeof authorizeUser); // ✅ Kiểm tra lại middleware

// 🚀 Định nghĩa route
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// ✅ Chỉ truyền function hợp lệ vào route
router.post(
    '/',
    authorizeUser,   // ✅ Sửa lỗi: Đúng middleware xác thực
    uploadThumbnail, // Middleware upload file đơn
    uploadImages,    // Middleware upload nhiều file
    createNews       // Controller xử lý
);

module.exports = router;
