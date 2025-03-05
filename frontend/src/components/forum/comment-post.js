import React, { useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Button,
  TextField
} from '@mui/material'

const CommentPost = ({ comments }) => {
  const [replies, setReplies] = useState({})

  const handleReplyChange = (commentId, value) => {
    setReplies({ ...replies, [commentId]: value })
  }

  const handleReplySubmit = (commentId) => {
    if (replies[commentId]) {
      console.log(`Replying to comment ${commentId}:`, replies[commentId])
      setReplies({ ...replies, [commentId]: '' })
    }
  }

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>
      {comments.map((comment) => (
        <Card key={comment.id} sx={{ marginBottom: 2, padding: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Avatar sx={{ marginRight: 1 }}>{comment.author[0]}</Avatar>
              <Typography variant="body2">
                {comment.author} - {comment.date}
              </Typography>
            </Box>
            <Typography variant="body1">{comment.text}</Typography>

            {/* Reply Input */}
            <Box mt={2}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Write a reply..."
                value={replies[comment.id] || ''}
                onChange={(e) => handleReplyChange(comment.id, e.target.value)}
              />
              <Button
                onClick={() => handleReplySubmit(comment.id)}
                variant="contained"
                sx={{ mt: 1 }}
              >
                Reply
              </Button>
            </Box>

            {/* Show Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <Box mt={2} pl={4} borderLeft="2px solid #ccc">
                {comment.replies.map((reply, index) => (
                  <Card key={index} sx={{ marginBottom: 1, padding: 1 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" marginBottom={1}>
                        <Avatar sx={{ marginRight: 1 }}>
                          {reply.author[0]}
                        </Avatar>
                        <Typography variant="body2">
                          {reply.author} - {reply.date}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{reply.text}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default CommentPost
