const express = require('express');
const { getAllNews, getNewsById, createNews, approveNews } = require('../controllers/newsController');
const { authorizeUser } = require('../middlewares/auth'); // ✅ Sửa lỗi: import đúng tên
const { uploadImages, uploadThumbnail } = require('../middlewares/uploadCloudinary');
const { authorizeAdmin } = require('../middlewares/auth');

const router = express.Router();

// Debug để kiểm tra kiểu dữ liệu
console.log("uploadImages type:", typeof uploadImages); // Phải là "function"
console.log("uploadThumbnail type:", typeof uploadThumbnail); // Phải là "function"
console.log("createNews type:", typeof createNews); // Phải là "function"
console.log("authorizeUser type:", typeof authorizeUser); // ✅ Kiểm tra lại middleware
console.log("authorizeAdmin type:", typeof authorizeAdmin); // Phải là "function"

// 🚀 Định nghĩa route
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', authorizeUser, createNews);
router.put('/approve/:id', authorizeUser, authorizeAdmin, approveNews);
router.patch('/approve/:id', authorizeUser, authorizeAdmin, approveNews);

// ✅ Chỉ truyền function hợp lệ vào route
router.post(
    '/',
    authorizeUser,   // ✅ Sửa lỗi: Đúng middleware xác thực
    uploadThumbnail, // Middleware upload file đơn
    uploadImages,    // Middleware upload nhiều file
    createNews       // Controller xử lý
);

module.exports = router;
