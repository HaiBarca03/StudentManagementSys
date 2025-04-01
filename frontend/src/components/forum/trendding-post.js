import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,  
  Divider,

} from '@mui/material';
import { useNavigate } from 'react-router-dom';

//const API_URL = `${process.env.REACT_APP_BASE_URL}/api/news/most-liked`
const API_URL = `http://localhost:5000/api/news/most-liked?limit=5`

const TrendingPost = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchMostLikedNews = async () => {
      if (!API_URL) {
        console.error('API_URL is not defined. Check your .env file.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}?limit=5`);

        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          result = null;
        }

        if (!response.ok) {
          console.error(
            `Error ${response.status}: ${response.statusText}`,
            result || 'No JSON response'
          );
          return;
        }

        setPosts(result?.data || []);
      } catch (error) {
        console.error('Fetch request failed:', error);
      }
    };

    fetchMostLikedNews();
  }, []);

  const handleClick = (slug) => {
    navigate(`/news/${slug}`);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        bgcolor: 'background.paper',
        padding: 3,
        borderRadius: 3,
        boxShadow: 3,
        mx: 'auto',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Trending News
      </Typography>
      <List>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <React.Fragment key={index}>
              <ListItem
                onClick={() => handleClick(post.slug)}
                sx={{
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  '&:hover': { bgcolor: 'grey.100' },
                  borderRadius: 2,
                  paddingY: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary={
                    <>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(post.datePosted).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 'bold', mt: 0.5 }}
                      >
                        {post.title}
                      </Typography>
                    </>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary">
                      👍 {post.likes}
                    </Typography>
                  }
                />
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    src={post.image || 'https://via.placeholder.com/100'}
                    sx={{ width: 80, height: 80, borderRadius: 2, ml: 2 }}
                  />
                </ListItemAvatar>
              </ListItem>
              {index < posts.length - 1 && <Divider variant="fullWidth" />}
            </React.Fragment>
          ))
        ) : (
          <Typography color="textSecondary" sx={{ textAlign: 'center' }}>
            Không có bài viết nổi bật
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default TrendingPost;