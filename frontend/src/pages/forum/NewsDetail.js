import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Avatar, Chip, CircularProgress } from "@mui/material";

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/news`

const NewsDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết bài viết:", error);
        setError("Không thể tải chi tiết bài viết. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!post) {
    return <Typography>Không tìm thấy bài viết.</Typography>;
  }

  return (
    <Box padding={3}>
      <Box display="flex" alignItems="center" marginBottom={2}>
        <Avatar src={post.userId?.avatar || ""} sx={{ marginRight: 1 }}>
          {post.userId?.username?.charAt(0).toUpperCase() || "P"}
        </Avatar>
        <Typography variant="body2">
          {post.userId?.username || "Người dùng ẩn danh"} -{" "}
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
        </Typography>
      </Box>
      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {post.content || "Không có nội dung"}
      </Typography>
      <Box display="flex" gap={1} marginBottom={1}>
        {Array.isArray(post.tags)
          ? post.tags.map((tag, index) => (
              <Chip key={index} label={tag} color="success" size="small" />
            ))
          : null}
      </Box>
    </Box>
  );
};

export default NewsDetail;
