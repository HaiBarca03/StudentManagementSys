    //newsController.js
    const News = require('../models/newSchema');
    const Topic = require('../models/topicSchema');
    const fs = require('fs');
    const cloudinary = require('../config/cloudinaryConfig');
    const slugify = require('slugify');
    
    const getAllNews = async (req, res) => {
        try {
            let { page, limit, approved } = req.query;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 5;
            const approvedFilter = approved === 'false' ? false : true;
    
            const totalNews = await News.countDocuments({ approved: approvedFilter });
            const totalPages = Math.ceil(totalNews / limit);
    
            const news = await News.find({ approved: approvedFilter })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
          
            .populate('userId', 'name')
            
            .populate({
                path: 'topicId',
                select: 'name description'
            })
            .select("title summary thumbnail userId topicId createdAt likes comments shares")
            .lean();

            // Xử lý dữ liệu trả về
            news.forEach((item) => {
                if (!item.userId) {
                // Trường hợp userId không populate được hoặc null
                item.userId = { _id: item.userId || null, name: 'Unknown User' };
                item.userRef = item.userType || null;
                } else {
                // Trường hợp userId populate thành công
                item.userId = {
                    _id: item.userId._id,
                    name: item.userId.name || 'Unknown User',
                };
                item.userRef = item.userType || null;
                }
            });
            res.status(200).json({ page, totalPages, news });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bài viết:", error);
            res.status(500).json({ error: 'Lỗi server khi lấy danh sách bài viết' });
        }
    };
    
    
 // Lấy chi tiết bài viết theo ID
const getNewsById = async (req, res) => {
    try {
      const newsItem = await News.findById(req.params.id)
        .populate({
          path: 'userId',
          select: 'name username avatar email'
        })
        .populate({
          path: 'topicId',
          select: 'name description'
        })
        .lean();
  
      if (!newsItem) return res.status(404).json({ error: 'Không tìm thấy bài viết' });
  
      // Xử lý userId
      if (!newsItem.userId) {
        newsItem.userId = { _id: null, name: 'Unknown User' };
      } else {
        newsItem.userId = {
          _id: newsItem.userId._id,
          name: newsItem.userId.name || 'Unknown User',
          username: newsItem.userId.username || '',
          avatar: newsItem.userId.avatar || '',
          email: newsItem.userId.email || ''
        };
      }
      newsItem.userRef = newsItem.userType || null;
  
      // Log để kiểm tra dữ liệu
      console.log('News item:', JSON.stringify(newsItem, null, 2));
  
      res.status(200).json(newsItem);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết bài viết:', error);
      res.status(500).json({ error: 'Lỗi server khi lấy chi tiết bài viết' });
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

        const { title, summary, content, userId, userType, topicId, published } = req.body;

        if (!title || !summary || !content || !userId || !userType || !topicId) {
            return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
        }

        let validTopicId = topicId;
        if (!topicId || topicId.trim() === '') {
            // Nếu không có topicId, tự động tạo chủ đề mới
            const newTopic = new Topic({ name: title }); // Hoặc đặt tên theo logic riêng
            const savedTopic = await newTopic.save();
            validTopicId = savedTopic._id;
        } else {
            // Kiểm tra xem topicId có tồn tại không
            const existingTopic = await Topic.findById(topicId);
            if (!existingTopic) {
                return res.status(400).json({ error: "Chủ đề không hợp lệ" });
            }
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
            topicId: validTopicId,
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
const getAllTopics = async (req, res) => {
    try {
      const topics = await Topic.find().select('name description');
      console.log('Topics from DB:', topics); // Kiểm tra dữ liệu từ DB
      if (!topics.length) {
        console.log('No topics found in database');
      }
      res.status(200).json(topics);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách chủ đề:', error);
      res.status(500).json({ error: 'Lỗi server khi lấy danh sách chủ đề' });
    }
  };
module.exports = { getAllNews, getNewsById, createNews, approveNews,getAllTopics };