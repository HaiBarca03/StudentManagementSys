const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ chấp nhận file ảnh!'));
        }
        cb(null, true);
    }
});

const uploadNewsFiles = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ chấp nhận file ảnh!'));
        }
        cb(null, true);
    }
}).fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]);

const uploadThumbnail = upload.single('thumbnail');
const uploadImages = upload.array('images', 10);

module.exports = {
    uploadThumbnail,
    uploadImages,
    uploadNewsFiles
};
