import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Grid,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ShareIcon from "@mui/icons-material/Share";

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/news`;
const USER_API_URL = `${process.env.REACT_APP_BASE_URL}/user`;

const MainForum = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({}); // Lưu trữ thông tin người dùng theo userId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log("Dữ liệu từ API:", response.data.news); // Kiểm tra dữ liệu trả về
        if (Array.isArray(response.data.news)) {
          setPosts(response.data.news);
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", response.data);
          setPosts([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
        setError("Không thể tải bài viết. Vui lòng thử lại.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const uniqueUserIds = [...new Set(posts.map((post) => post.userId))];
        console.log("Unique User IDs:", uniqueUserIds);
  
        const userResponses = await Promise.all(
          uniqueUserIds.map((id) =>
            axios
              .get(`${USER_API_URL}/${id}`)
              .then((response) => response.data)
              .catch((err) => {
                console.error(`Error fetching user with ID ${id}:`, err);
                return { username: "Người dùng ẩn danh" }; // Fallback user data
              })
          )
        );
  
        const userData = uniqueUserIds.reduce((acc, id, index) => {
          acc[id] = userResponses[index].username;
          return acc;
        }, {});
  
        console.log("User Data:", userData);
        setUsers(userData);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
  
    if (posts.length > 0) {
      fetchUsers();
    }
  }, [posts]);

  const handleClick = (id) => {
    navigate(`/forum/post/${id}`);
  };
  
  if (loading) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

// return (
//   <>
//     {posts.length > 0 ? (
//       posts.map((post) => {
//         console.log("Post data:", post); // Kiểm tra dữ liệu bài viết
//         return (
//           <Card
//             key={post._id} // Đảm bảo key dùng _id thay vì id
//             sx={{ marginBottom: 2, padding: 2, cursor: "pointer" }}
//             onClick={() => handleClick(post._id)} // Sửa id thành _id nếu cần
//           >
//             <CardContent>
//               <Box display="flex" alignItems="center" marginBottom={1}>
//                 <Avatar src={post.thumbnail?.url || ""} sx={{ marginRight: 1 }}>P</Avatar>
//                 <Typography variant="body2">
//                   {users[post.userId?._id] || "Đang tải..."} -{" "}
//                   {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
//                 </Typography>
//               </Box>
//               <Typography variant="h6" gutterBottom>{post.title || "Không có tiêu đề"}</Typography>
//               <Typography variant="body2" color="textSecondary" paragraph>
//                 {post.summary || "Không có mô tả"}
//               </Typography>
//               <Box display="flex" gap={1} marginBottom={1}>
//                 {Array.isArray(post.tags)
//                   ? post.tags.map((tag, index) => (
//                       <Chip key={index} label={tag} color="success" size="small" />
//                     ))
//                   : null}
//               </Box>
//               <Box display="flex" alignItems="center">
//                 <IconButton><ChatBubbleOutlineIcon /></IconButton>
//                 <Typography variant="body2">{post.comments || 0}</Typography>
//                 <IconButton><ThumbUpAltIcon /></IconButton>
//                 <Typography variant="body2">{post.likes || 0}</Typography>
//                 <IconButton><ShareIcon /></IconButton>
//                 <Typography variant="body2">{post.shares || 0}</Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         );
//       })
//     ) : (
//       <Typography>Không có bài viết nào.</Typography>
//     )}
//   </>
// );
// };
// return (
//   <Grid container spacing={3}>
//     {posts.length > 0 ? (
//       posts.map((post) => (
//         <Grid item xs={12} md={6} lg={4} key={post._id}>
//           <Card sx={{ cursor: "pointer" }} onClick={() => handleClick(post._id)}>
//             {post.thumbnail?.url && (
//               <Box
//                 component="img"
//                 src={post.thumbnail.url}
//                 alt="Thumbnail"
//                 sx={{ width: "100%", height: 200, objectFit: "cover" }}
//               />
//             )}
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 {post.title || "Không có tiêu đề"}
//               </Typography>
//               <Typography variant="body2" color="textSecondary" paragraph>
//                 {post.summary || "Không có mô tả"}
//               </Typography>
//               <Box display="flex" gap={1} mb={1}>
//                 {Array.isArray(post.tags)
//                   ? post.tags.map((tag, index) => (
//                       <Chip key={index} label={tag} color="success" size="small" />
//                     ))
//                   : null}
//               </Box>
//               <Box display="flex" justifyContent="space-between" alignItems="center">
//                 <Avatar src={post.authorAvatar || ""} sx={{ width: 32, height: 32 }} />
//                 <Box display="flex" alignItems="center">
//                   <IconButton><ChatBubbleOutlineIcon /></IconButton>
//                   <Typography variant="body2">{post.comments || 0}</Typography>
//                   <IconButton><ThumbUpAltIcon /></IconButton>
//                   <Typography variant="body2">{post.likes || 0}</Typography>
//                   <IconButton><ShareIcon /></IconButton>
//                   <Typography variant="body2">{post.shares || 0}</Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))
//     ) : (
//       <Typography>Không có bài viết nào.</Typography>
//     )}
//   </Grid>
// );
// };
return (
  <Grid container spacing={3}>
    {posts.length > 0 ? (
      posts.map((post) => (
        <Grid item xs={12} key={post._id}>
          <Card sx={{ cursor: "pointer", display: "flex", marginBottom: 2 }} onClick={() => handleClick(post._id)}>
            {post.thumbnail?.url && (
              <Box
                component="img"
                src={post.thumbnail.url}
                alt="Thumbnail"
                sx={{ width: 250, height: "auto", objectFit: "cover" }}
              />
            )}
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {post.title || "Không có tiêu đề"}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {post.summary || "Không có mô tả"}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Box display="flex" alignItems="center">
                  <Avatar src={post.authorAvatar || ""} sx={{ width: 32, height: 32, marginRight: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {users[post.userId] || "Người dùng ẩn danh"}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <IconButton><ChatBubbleOutlineIcon /></IconButton>
                  <Typography variant="body2">{post.comments || 0}</Typography>
                  <IconButton><ThumbUpAltIcon /></IconButton>
                  <Typography variant="body2">{post.likes || 0}</Typography>
                  <IconButton><ShareIcon /></IconButton>
                  <Typography variant="body2">{post.shares || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))
    ) : (
      <Typography>Không có bài viết nào.</Typography>
    )}
  </Grid>
);
};
export default MainForum;
