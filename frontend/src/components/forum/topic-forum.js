import React, { useState, useRef, useEffect } from 'react'
import { AppBar, Toolbar, Box, Typography, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTopic } from '../../redux/forumRelated/forumHandle'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'

const TopicForum = () => {
  const scrollContainerRef = useRef(null)
  const [showBackButton, setShowBackButton] = useState(false)
  const dispatch = useDispatch()
  const { forumList, loading, error, response } = useSelector(
    (state) => state.forum
  )
  useEffect(() => {
    dispatch(getAllTopic())
  }, [dispatch])
  const topics = Array.isArray(forumList)
    ? forumList.map((topic) => topic.name)
    : []

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      setShowBackButton(scrollContainerRef.current.scrollLeft > 0)
    }
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll)
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll)
      }
    }
  }, [])

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' })
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' })
    }
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        {showBackButton ? (
          <IconButton onClick={scrollLeft}>
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
        ) : (
          <Typography variant="h6" sx={{ mr: 2, cursor: 'pointer' }}>
            🏠
          </Typography>
        )}

        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            flexGrow: 1,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            whiteSpace: 'nowrap'
          }}
        >
          {topics.map((topic, index) => (
            <Typography
              key={index}
              sx={{
                px: 2,
                cursor: 'pointer',
                flexShrink: 0,
                '&:hover': { color: 'blue' }
              }}
            >
              {topic}
            </Typography>
          ))}
        </Box>

        {/* Scroll Right Button */}
        <IconButton onClick={scrollRight}>
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default TopicForum
