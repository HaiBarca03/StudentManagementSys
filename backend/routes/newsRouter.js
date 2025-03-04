const express = require('express');
const { getAllNews, getNewsById, createNews } = require('../controllers/newsController');

const newsRouter = express.Router();

// Route lấy tất cả bài viết
newsRouter.get('/', getAllNews);

// Route lấy bài viết theo ID
newsRouter.get('/:id', getNewsById);

// Route tạo bài viết mới
newsRouter.post('/createNews', createNews);

module.exports = newsRouter;