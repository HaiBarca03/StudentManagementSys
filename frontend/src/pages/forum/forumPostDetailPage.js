import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ShareIcon from "@mui/icons-material/Share";
import TrenddingPost from "../../components/forum/trendding-post";
import NewPosts from "../../components/forum/news-post";
import CommentPost from "../../components/forum/comment-post";
import { useDispatch, useSelector } from "react-redux";
import { getCommentByNews } from "../../redux/forumRelated/commentHandle";

const API_URL = "http://localhost:5000/api/news";
const USER_API_URL = "http://localhost:5000/api/users";

const ForumPostDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New state for error handling
  const [showComments, setShowComments] = useState(false);
  const { commentList } = useSelector((state) => state.comment);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        const response = await axios.get(`${API_URL}/${id}`);
        console.log("Post data:", response.data);
        setPost(response.data);
  
        // Fetch user information if userId exists
        if (response.data.userId && response.data.userId._id) {

          try {
            const userResponse = await axios.get(`${USER_API_URL}/${response.data.userId._id}`);
            console.log("User Data:", userResponse.data);
            setUser(userResponse.data);
          } catch (userError) {
            console.error("Error fetching user:", userError);
            setUser({
              username: "Người dùng ẩn danh",
              avatar: "", // Fallback avatar
            });
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load the post. Please try again later.");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchPostDetails();
      dispatch(getCommentByNews(id));
    }
  }, [id, dispatch]);
  
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!post) {
    return <Typography variant="h6">Bài viết không tồn tại hoặc đã bị xóa!</Typography>;
  }

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="forum-home">
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} md={8}>
          <Box>
            <Card sx={{ marginBottom: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" marginBottom={2}>
                  <Avatar src={user?.avatar || ""} sx={{ marginRight: 1 }}>
                    {user?.username?.charAt(0) || "U"}
                  </Avatar>
                  <Typography variant="body2">
                    {user?.username || "Người dùng ẩn danh"} -{" "}
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
                  </Typography>
                </Box>
                <Typography variant="h4" gutterBottom>
                  {post.title}
                </Typography>
                <Box display="flex" gap={1} marginBottom={2}>
                  {Array.isArray(post.tags) &&
                    post.tags.map((tag, index) => (
                      <Chip key={index} label={tag} color="success" size="small" />
                    ))}
                </Box>
                {post.images &&
                  post.images.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={image.url || image} // Access the `url` property or fallback to `image` if it's a string
                      alt={`Image ${index + 1}`}
                      sx={{ width: "100%", borderRadius: 2, marginBottom: 2 }}
                    />
                  ))}
                <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: post.content }} />

                <Box display="flex" alignItems="center">
                  <IconButton onClick={handleToggleComments}>
                    <ChatBubbleOutlineIcon />
                  </IconButton>
                  <Typography variant="body2">{commentList.length}</Typography>
                  <IconButton>
                    <ThumbUpAltIcon />
                  </IconButton>
                  <Typography variant="body2">{post.likes}</Typography>
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                  <Typography variant="body2">{post.shares}</Typography>
                </Box>
              </CardContent>
              {showComments && <CommentPost comments={commentList} postId={post.id} />}
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} sx={{ overflowY: "auto", maxHeight: "calc(100vh - 100px)", paddingRight: 1 }}>
          <TrenddingPost />
          <br />
          <NewPosts />
        </Grid>
      </Grid>
    </div>
  );
};

export default ForumPostDetailPage;