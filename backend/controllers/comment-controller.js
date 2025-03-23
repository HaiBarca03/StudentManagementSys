const Comment = require('../models/commentSchema')
const mongoose = require('mongoose');

//api tạo 
const createComment = async (req, res) => {
    const userId = req.user.id;
    const userType = req.user.role;
    const { content, images, newsId, parentId } = req.body
    try {
        if (!content) {
            return res.status(400).json({ message: 'Content is required' })
        }

        const comment = await Comment.create({
            userId,
            userType,
            content,
            images,
            newsId,
            parentId
        })

        res.status(201).json(comment)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
}

// Lấy danh sách bình luận theo bài viết (getCommentsByNews)
const getCommentsByNews = async (req, res) => {
    try {
        const { newsId } = req.params
        console.log('newsId', newsId)
        const comments = await Comment.find({ newsId })
            .populate('userId', 'name') // Lấy thông tin người dùng
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian mới nhất

        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
}

const getCommentDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id)
            .populate({ path: 'userId', select: 'name' })  // Lấy thông tin người dùng

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const getCommentsByParentComment = async (req, res) => {
    try {
        const { parentId } = req.params;

        const comments = await Comment.find({ parentId })
            .populate({ path: 'userId', select: 'name' }) // Lấy thông tin người dùng
            .populate({
                path: 'userId',
                refPath: 'userRef',
                select: 'name'
            }) // Lấy thông tin người dùng dựa trên userType
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian mới nhất
        console.log('comments', comments.length)
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Cập nhật bình luận
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { content, images, status } = req.body;
        // Tìm comment theo ID  
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Kiểm tra quyền chỉnh sửa
        if (!new mongoose.Types.ObjectId(userId).equals(comment.userId)) {
            return res.status(403).json({ message: 'Unauthorized: You cannot update this comment' });
        }

        // Cập nhật thông tin comment nếu có dữ liệu mới
        if (content) comment.content = content;
        if (images) comment.images = images;
        if (status) comment.status = status;

        await comment.save();
        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error('Error updating comment:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


// Xóa bình luận
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = {
    createComment,
    getCommentsByNews,
    getCommentDetails,
    getCommentsByParentComment,
    updateComment,
    deleteComment
}