import React from 'react'
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
const trendingDiscussions = [
  {
    id: 1,
    title: 'Data Subject access request procedure',
    date: '31 Aug, 2018'
  },
  {
    id: 2,
    title: 'Data Subject access request procedure',
    date: '29 Aug, 2018'
  },
  {
    id: 3,
    title: 'Data Subject access request procedure',
    date: '21 Aug, 2018'
  }
]
const TrenddingPost = () => {
  const navigate = useNavigate()

  const handleClick = (id) => {
    navigate(`/forum/post/${id}`)
  }
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          padding: 2,
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        <Typography variant="h6" gutterBottom>
          Trending Discussion
        </Typography>
        <List>
          {trendingDiscussions.map((discussion) => (
            <ListItem
              key={discussion.id}
              onClick={() => handleClick(discussion.id)}
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <Avatar>P</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={discussion.title}
                secondary={discussion.date}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  )
}

export default TrenddingPost
