    //newsController.js
    const News = require('../models/newsModel');
    const fs = require('fs');
    const cloudinary = require('../config/cloudinaryConfig');
    const slugify = require('slugify');

    // Lấy bài viết theo trang
    const getAllNews = async (req, res) => {
        try {
            let { page, limit, approved } = req.query;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 5;
            const approvedFilter = approved === 'false' ? false : true; // Lọc theo trạng thái duyệt

            const totalNews = await News.countDocuments({ approved: approvedFilter });
            const totalPages = Math.ceil(totalNews / limit);

            const news = await News.find({ approved: approvedFilter })
                .sort({ createdAt: -1 })
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

    // Duyệt bài viết (Admin)
    const approveNews = async (req, res) => {
        try {
            const { id } = req.params;
    
            const news = await News.findById(id);
            if (!news) {
                return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
            }
    
            if (news.approved) {
                return res.status(400).json({ success: false, message: "Bài viết này đã được duyệt trước đó!" });
            }
            
            if (!req.user.permissions.includes('approve_posts')) {
                return res.status(403).json({ success: false, message: 'Bạn không có quyền duyệt bài viết.' });
            }
            
            news.approved = true;
            await news.save();
    
            res.status(200).json({ success: true, message: "✅ Bài viết đã được duyệt", news });
        } catch (error) {
            console.error("❌ Lỗi khi duyệt bài viết:", error);
            res.status(500).json({ success: false, message: "Lỗi server khi duyệt bài viết" });
        }
    };

    // Tạo slug duy nhất
    const generateUniqueSlug = async (title) => {
        let baseSlug = slugify(title, { lower: true, strict: true });
        
        const existingSlugs = await News.find({ slug: new RegExp(`^${baseSlug}(-\\d+)?$`) }).select('slug');

        if (!existingSlugs.length) {
            return baseSlug;
        }

        const slugNumbers = existingSlugs.map(item => {
            const match = item.slug.match(/-(\d+)$/);
            return match ? parseInt(match[1]) : 0;
        });

        const nextNumber = Math.max(...slugNumbers) + 1;
        return `${baseSlug}-${nextNumber}`;
    };

   // Tạo bài viết mới
   const createNews = async (req, res) => {
    try {
        console.log('📦 Request body:', req.body);
        console.log('📎 Files:', req.files);

        const { title, summary, content, userId, userType, published } = req.body;

        if (!title || !summary || !content || !userId || !userType) {
            return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
        }

        let thumbnailData = null;
        let images = [];

        // Kiểm tra và upload thumbnail
        if (!req.files || !req.files.thumbnail || req.files.thumbnail.length === 0) {
            return res.status(400).json({ error: "Thiếu thumbnail" });
        }
        const thumbnailFile = req.files.thumbnail[0];
        const thumbnailResult = await cloudinary.uploader.upload(thumbnailFile.path, {
            folder: "news_thumbnails"
        });
        thumbnailData = {
            public_id: thumbnailResult.public_id,
            url: thumbnailResult.secure_url
        };
        fs.unlinkSync(thumbnailFile.path);

        // Upload images nếu có
        if (req.files && req.files.images) {
            images = await Promise.all(
                req.files.images.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "news_images"
                    });
                    fs.unlinkSync(file.path);
                    return {
                        public_id: result.public_id,
                        url: result.secure_url
                    };
                })
            );
        }

        const slug = await generateUniqueSlug(title);

        const newNews = new News({
            title,
            summary,
            content,
            slug,
            thumbnail: thumbnailData,
            images,
            userId,
            userType,
            published: published === 'true',
            approved: false
        });

        await newNews.save();

        res.status(201).json({
            message: "🎉 Bài viết đã được tạo, chờ duyệt bởi admin.",
            data: newNews
        });
    } catch (error) {
        console.error("❌ Lỗi khi tạo bài viết:", error);
        res.status(500).json({ message: "Lỗi khi tạo bài viết", error: error.message });
    }
};
module.exports = { getAllNews, getNewsById, createNews, approveNews };