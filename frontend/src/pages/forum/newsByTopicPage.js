import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getDetailTopic,
  getNewsByTopic
} from '../../redux/forumRelated/forumHandle'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import ArticleCard from '../../components/forum/article-card'
import HeadForum from '../../components/forum/head-forum'

const NewsByTopicPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { articleByTopic, topicDetail, loading, error } = useSelector(
    (state) => state.forum
  )

  useEffect(() => {
    dispatch(getNewsByTopic(id))
    dispatch(getDetailTopic(id))
  }, [dispatch, id])

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', pb: 5 }}>
      <HeadForum />

      <Box sx={{ p: 5, display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: '80%',
            backgroundColor: '#fff',
            p: 4,
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textTransform: 'capitalize',
              borderBottom: '4px solid #1976d2',
              display: 'inline-block',
              pb: 1,
              mb: 3,
              color: '#333'
            }}
          >
            Chủ đề: {topicDetail.name}
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress color="primary" size={50} />
            </Box>
          )}

          {error && (
            <Typography
              color="error"
              align="center"
              sx={{ fontSize: '1.1rem', mt: 2 }}
            >
              {error.message || 'Đã xảy ra lỗi khi tải bài viết'}
            </Typography>
          )}

          {!loading && !error && articleByTopic && (
            <Box sx={{ mt: 3 }}>
              {articleByTopic.map((article) => (
                <ArticleCard key={article._id} {...article} />
              ))}
            </Box>
          )}

          {!loading &&
            !error &&
            articleByTopic &&
            articleByTopic.length === 0 && (
              <Typography
                align="center"
                sx={{ fontSize: '1.1rem', color: '#777', mt: 2 }}
              >
                Chủ đề <strong>{topicDetail.name}</strong> hiện không có bài
                viết nào.
              </Typography>
            )}
        </Box>
      </Box>
    </Box>
  )
}

export default NewsByTopicPage
