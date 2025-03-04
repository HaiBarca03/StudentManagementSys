const News = require('../models/newsModel'); // Import model bài viết

// ✅ Định nghĩa hàm getAllNews
const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách bài viết' });
  }
};

// ✅ Định nghĩa hàm getNewsById
const getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    }
    res.status(200).json(newsItem);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi lấy bài viết' });
  }
};

// ✅ Định nghĩa hàm createNews
const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const newPost = new News({ title, content, images });
    await newPost.save();

    res.status(201).json({ message: 'Bài viết đã được tạo', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo bài viết', error });
  }
};

// ✅ Export tất cả hàm
module.exports = { getAllNews, getNewsById, createNews };
