import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import ArticleCard from '../../components/forum/article-card'
import { getNewsByUser } from '../../redux/forumRelated/forumHandle'
import HeadForum from '../../components/forum/head-forum'

const MyArticlePage = () => {
  const dispatch = useDispatch()
  const { newsByUser, loading, error } = useSelector((state) => state.forum)
  const [statusFilter, setStatusFilter] = useState('all')
  const fetchArticles = () => {
    dispatch(getNewsByUser(statusFilter))
  }
  useEffect(() => {
    if (statusFilter === 'all') {
      dispatch(getNewsByUser())
    } else {
      dispatch(getNewsByUser(statusFilter))
    }
  }, [dispatch, statusFilter])

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value)
  }

  return (
    <Box>
      <HeadForum />

      <Box sx={{ p: 5, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '70%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Typography variant="h4" gutterBottom>
              Bài viết của tôi
            </Typography>

            <Box sx={{ maxWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="true">Đã duyệt</MenuItem>
                  <MenuItem value="false">Chưa duyệt</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Typography color="error" align="center">
              {error.message || 'Đã xảy ra lỗi khi tải bài viết'}
            </Typography>
          )}
          {!loading && !error && newsByUser && newsByUser.data && (
            <Box>
              {newsByUser.data.map((article) => (
                <ArticleCard
                  key={article._id}
                  {...article}
                  onDeleteSuccess={fetchArticles}
                />
              ))}
            </Box>
          )}

          {!loading &&
            !error &&
            newsByUser &&
            newsByUser.data &&
            newsByUser.data.length === 0 && (
              <Typography align="center">Bạn chưa có bài viết nào.</Typography>
            )}
        </Box>
      </Box>
    </Box>
  )
}

export default MyArticlePage
