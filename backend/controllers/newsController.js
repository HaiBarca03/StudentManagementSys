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
        let newSlug = slugify(title, { lower: true, strict: true });
        let count = 1;
        
        while (await News.findOne({ slug: newSlug })) {
            newSlug = `${slugify(title, { lower: true, strict: true })}-${count}`;
            count++;
        }

        return newSlug;
    };
    // Tạo bài viết mới
    const createNews = async (req, res) => {
        try {
            console.log("🟡 Request body:", req.body);
            console.log("🟡 Request file:", req.file);
            console.log("🟡 Request files:", req.files);

            const { title, summary, content, userId, userType, published, thumbnail } = req.body;

            if (!title || !summary || !content || !userId || !userType) {
                return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc: title, summary, content, userId, userType" });
            }

            let thumbnailData = null;
            let images = [];

            if (req.file) {
                try {
                    const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "news_thumbnails" });
                    thumbnailData = { public_id: uploadResult.public_id, url: uploadResult.secure_url };
                    fs.unlinkSync(req.file.path);
                } catch (error) {
                    console.error("❌ Lỗi khi upload thumbnail:", error);
                    return res.status(500).json({ message: "Lỗi khi upload thumbnail" });
                }
            } else if (thumbnail && thumbnail.url) {
                thumbnailData = thumbnail;
            } else {
                return res.status(400).json({ error: "Thiếu thumbnail" });
            }

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
                published,
                approved: false // Mặc định bài viết chưa được duyệt
            });

            await newNews.save();

            return res.status(201).json({
                message: "🎉 Bài viết đã được tạo, chờ duyệt bởi admin.",
                data: newNews
            });

        } catch (error) {
            console.error("❌ Lỗi khi tạo bài viết:", error);
            return res.status(500).json({ message: "Lỗi khi tạo bài viết", error });
        }
    };

    module.exports = { getAllNews, getNewsById, createNews, approveNews };
