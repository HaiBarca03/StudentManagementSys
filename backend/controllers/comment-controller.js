const Comment = require('../models/commentSchema')

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

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = {
    createComment,
    getCommentsByNews,
    getCommentDetails,
    getCommentsByParentComment
    // updateComment,
    // deleteComment
}