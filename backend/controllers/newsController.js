const News = require('../models/newsModel');
const fs = require('fs');
const cloudinary = require('../config/cloudinaryConfig');

// Lấy bài viết theo trang
const getAllNews = async (req, res) => {
    try {
        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5; // Mặc định 5 bài viết mỗi trang

        const totalNews = await News.countDocuments();
        const totalPages = Math.ceil(totalNews / limit);

        const news = await News.find()
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian mới nhất
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({ page, totalPages, news });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bài viết:", error);
        res.status(500).json({ error: 'Lỗi server khi lấy danh sách bài viết' });
    }
};

// Lấy bài viết theo ID
const getNewsById = async (req, res) => {
    try {
        const newsItem = await News.findById(req.params.id);
        if (!newsItem) return res.status(404).json({ error: 'Không tìm thấy bài viết' });

        res.status(200).json(newsItem);
    } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        res.status(500).json({ error: 'Lỗi server khi lấy bài viết' });
    }
};

// Tạo bài viết mới
const createNews = async (req, res) => {
    try {
        console.log("🟡 Request body:", req.body);
        console.log("🟡 Request file:", req.file);
        console.log("🟡 Request files:", req.files);

        const { title, summary, content, userId, userType, published, thumbnail } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!title || !summary || !content || !userId || !userType) {
            return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc: title, summary, content, userId, userType" });
        }

        let thumbnailData = null;
        let images = [];

        // 📌 Kiểm tra xem có upload thumbnail dưới dạng file không
        if (req.file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "news_thumbnails" });
                thumbnailData = { public_id: uploadResult.public_id, url: uploadResult.secure_url };
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error("❌ Lỗi khi upload thumbnail:", error);
                return res.status(500).json({ message: "Lỗi khi upload thumbnail" });
            }
        } 
        // 📌 Nếu không có file, kiểm tra thumbnail từ JSON
        else if (thumbnail && thumbnail.url) {
            thumbnailData = thumbnail;
        } else {
            return res.status(400).json({ error: "Thiếu thumbnail" });
        }

        // 📌 Kiểm tra danh sách ảnh nếu có
        if (req.files && req.files.length > 0) {
            try {
                images = await Promise.all(
                    req.files.map(async (file) => {
                        const uploadResult = await cloudinary.uploader.upload(file.path, { folder: "news_images" });
                        fs.unlinkSync(file.path);
                        return { public_id: uploadResult.public_id, url: uploadResult.secure_url };
                    })
                );
            } catch (error) {
                console.error("❌ Lỗi khi upload ảnh:", error);
                return res.status(500).json({ message: "Lỗi khi upload hình ảnh" });
            }
        }

        console.log("✅ Thumbnail:", thumbnailData);
        console.log("✅ Images:", images);

        // Tạo slug từ title (nếu chưa có)
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // 📌 Lưu bài viết vào database
        const newNews = new News({
            title,
            summary,
            content,
            slug,
            thumbnail: thumbnailData,
            images,
            userId,
            userType,
            published
        });

        await newNews.save();

        return res.status(201).json({
            message: "🎉 Bài viết đã được tạo",
            data: newNews
        });

    } catch (error) {
        console.error("❌ Lỗi khi tạo bài viết:", error);
        return res.status(500).json({ message: "Lỗi khi tạo bài viết", error });
    }
};

module.exports = { getAllNews, getNewsById, createNews };
