import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle'
import { deleteUser } from '../../../redux/userRelated/userHandle'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { Paper, Box, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import TableTemplate from '../../../components/TableTemplate'
import { BlueButton, GreenButton } from '../../../components/buttonStyles'
import SpeedDialTemplate from '../../../components/SpeedDialTemplate'
import Popup from '../../../components/Popup'

const ShowSubjects = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { subjectsList, loading, error, response } = useSelector(
    (state) => state.sclass
  )
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, 'AllSubjects'))
  }, [currentUser._id, dispatch])

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')

  const deleteHandler = (deleteID, address) => {
    setMessage(`Đang xoá môn học...`)
    setShowPopup(true)

    dispatch(deleteUser(deleteID, address))
      .then(() => {
        setMessage('Xoá môn học thành công!')
        dispatch(getSubjectList(currentUser._id, 'AllSubjects'))
      })
      .catch(() => {
        setMessage('Đã xảy ra lỗi khi xoá môn học.')
      })
  }

  const subjectColumns = [
    { id: 'subName', label: 'Tên môn học', minWidth: 170 },
    { id: 'sessions', label: 'Số tiết học', minWidth: 170 },
    { id: 'sclassName', label: 'Tên lớp', minWidth: 170 }
  ]

  const subjectRows = subjectsList.map((subject) => {
    return {
      subName: subject.subName,
      sessions: subject.sessions,
      sclassName: subject.sclassName.sclassName,
      sclassID: subject.sclassName._id,
      id: subject._id
    }
  })

  const SubjectsButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, 'Subject')}>
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)
          }
        >
          Xem
        </BlueButton>
      </>
    )
  }

  const actions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: 'Thêm môn học mới',
      action: () => navigate('/Admin/subjects/chooseclass')
    },
    {
      icon: <DeleteIcon color="error" />,
      name: 'Xóa tất cả môn học',
      action: () => deleteHandler(currentUser._id, 'Subjects')
    }
  ]

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {response ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '16px'
              }}
            >
              <GreenButton
                variant="contained"
                onClick={() => navigate('/Admin/subjects/chooseclass')}
              >
                THÊM MÔN HỌC
              </GreenButton>
            </Box>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {Array.isArray(subjectsList) && subjectsList.length > 0 && (
                <TableTemplate
                  buttonHaver={SubjectsButtonHaver}
                  columns={subjectColumns}
                  rows={subjectRows}
                />
              )}
              <SpeedDialTemplate actions={actions} />
            </Paper>
          )}
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  )
}

export default ShowSubjects
