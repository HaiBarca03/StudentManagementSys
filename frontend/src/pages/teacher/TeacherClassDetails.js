import { useEffect } from 'react'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getClassStudents } from '../../redux/sclassRelated/sclassHandle'
import {
  Paper,
  Box,
  Typography,
  ButtonGroup,
  Button,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Container,
  Stack,
  Skeleton,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { BlackButton, BlueButton } from '../../components/buttonStyles'
import TableTemplate from '../../components/TableTemplate'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { People, Class, Assignment, Grade } from '@mui/icons-material'

const TeacherClassDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const { sclassStudents, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  )

  const { currentUser } = useSelector((state) => state.user)
  const classID = currentUser.teachSclass?._id
  const subjectID = currentUser.teachSubject?._id

  useEffect(() => {
    dispatch(getClassStudents(classID))
  }, [dispatch, classID])

  if (error) {
    console.log(error)
  }

  const studentColumns = [
    { id: 'name', label: 'Họ tên', minWidth: 170 },
    { id: 'rollNum', label: 'Mã sinh viên', minWidth: 100 }
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      id: student._id
    }
  })

  const StudentsButtonHaver = ({ row }) => {
    const options = [
      { label: 'Điểm danh', icon: <Assignment fontSize="small" /> },
      { label: 'Nhập điểm', icon: <Grade fontSize="small" /> }
    ]

    const [open, setOpen] = React.useState(false)
    const anchorRef = React.useRef(null)
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    const handleClick = () => {
      if (selectedIndex === 0) {
        handleAttendance()
      } else if (selectedIndex === 1) {
        handleMarks()
      }
    }

    const handleAttendance = () => {
      navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`)
    }
    const handleMarks = () => {
      navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)
    }

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index)
      setOpen(false)
      if (index === 0) handleAttendance()
      else if (index === 1) handleMarks()
    }

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen)
    }

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return
      }
      setOpen(false)
    }

    return (
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        <BlueButton
          variant="contained"
          size={isMobile ? 'small' : 'medium'}
          onClick={() => navigate('/Teacher/class/student/' + row.id)}
        >
          {isMobile ? 'Chi tiết' : 'Xem thêm'}
        </BlueButton>
        
        <ButtonGroup
          variant="contained"
          ref={anchorRef}
          aria-label="student actions"
          size={isMobile ? 'small' : 'medium'}
        >
          <Button 
            onClick={handleClick}
            startIcon={options[selectedIndex].icon}
          >
            {isMobile ? options[selectedIndex].label.substring(0, 3) : options[selectedIndex].label}
          </Button>
          <BlackButton
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            onClick={handleToggle}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </BlackButton>
        </ButtonGroup>
        
        <Popper
          sx={{ zIndex: 1 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper elevation={3}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option.label}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {option.icon}
                          <span>{option.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Stack>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={400} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Class color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" fontWeight="bold">
              Chi tiết lớp học
            </Typography>
            <Chip 
              label={`${sclassStudents?.length || 0} sinh viên`} 
              icon={<People />}
              color="primary"
              variant="outlined"
            />
          </Stack>

          {getresponse ? (
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy sinh viên nào trong lớp này
              </Typography>
            </Paper>
          ) : (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Danh sách sinh viên
              </Typography>

              {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
                <Box sx={{ overflowX: 'auto' }}>
                  <TableTemplate
                    buttonHaver={StudentsButtonHaver}
                    columns={studentColumns}
                    rows={studentRows}
                  />
                </Box>
              )}
            </Paper>
          )}
        </Box>
      )}
    </Container>
  )
}

export default TeacherClassDetails