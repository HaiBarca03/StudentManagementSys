import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getClassDetails,
  getClassStudents,
  getSubjectList
} from '../../../redux/sclassRelated/sclassHandle'
import { deleteUser } from '../../../redux/userRelated/userHandle'
import { Box, Container, Typography, Tab, IconButton } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { resetSubjects } from '../../../redux/sclassRelated/sclassSlice'
import {
  BlueButton,
  GreenButton,
  PurpleButton
} from '../../../components/buttonStyles'
import TableTemplate from '../../../components/TableTemplate'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import SpeedDialTemplate from '../../../components/SpeedDialTemplate'
import Popup from '../../../components/Popup'
import DeleteIcon from '@mui/icons-material/Delete'
import PostAddIcon from '@mui/icons-material/PostAdd'

const ClassDetails = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    subjectsList,
    sclassStudents,
    sclassDetails,
    loading,
    error,
    response,
    getresponse
  } = useSelector((state) => state.sclass)

  const classID = params.id

  useEffect(() => {
    dispatch(getClassDetails(classID, 'Sclass'))
    dispatch(getSubjectList(classID, 'ClassSubjects'))
    dispatch(getClassStudents(classID))
  }, [dispatch, classID])

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')

  const deleteHandler = (deleteID, address) => {
    setShowPopup(true)
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getClassStudents(classID))
      dispatch(resetSubjects())
      dispatch(getSubjectList(classID, 'ClassSubjects'))
    })
  }

  const subjectColumns = [
    { id: 'name', label: 'Tên môn học', minWidth: 170 },
    { id: 'code', label: 'Mã môn học', minWidth: 100 }
  ]

  const subjectRows =
    subjectsList &&
    subjectsList.length > 0 &&
    subjectsList.map((subject) => {
      return {
        name: subject.subName,
        code: subject.subCode,
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
          onClick={() => {
            navigate(`/Admin/class/subject/${classID}/${row.id}`)
          }}
        >
          Xem
        </BlueButton>
      </>
    )
  }

  const subjectActions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: 'Thêm môn học mới',
      action: () => navigate('/Admin/addsubject/' + classID)
    },
    {
      icon: <DeleteIcon color="error" />,
      name: 'Xóa tất cả môn học',
      action: () => deleteHandler(classID, 'SubjectsClass')
    }
  ]

  const ClassSubjectsSection = () => {
    return (
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
              onClick={() => navigate('/Admin/addsubject/' + classID)}
            >
              Thêm môn học
            </GreenButton>
          </Box>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Danh sách môn học :
            </Typography>

            <TableTemplate
              buttonHaver={SubjectsButtonHaver}
              columns={subjectColumns}
              rows={subjectRows}
            />
            <SpeedDialTemplate actions={subjectActions} />
          </>
        )}
      </>
    )
  }

  const studentColumns = [
    { id: 'name', label: 'Tên sinh viên', minWidth: 170 },
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
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, 'Student')}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate('/Admin/students/student/' + row.id)}
        >
          Xem
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate('/Admin/students/student/attendance/' + row.id)
          }
        >
          Điểm danh
        </PurpleButton>
      </>
    )
  }

  const studentActions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: 'Thêm sinh viên mới',
      action: () => navigate('/Admin/class/addstudents/' + classID)
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: 'Xóa tất cả sinh viên',
      action: () => deleteHandler(classID, 'StudentsClass')
    }
  ]

  const ClassStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '16px'
              }}
            >
              <GreenButton
                variant="contained"
                onClick={() => navigate('/Admin/class/addstudents/' + classID)}
              >
                Thêm sinh viên
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Danh sách sinh viên :
            </Typography>

            <TableTemplate
              buttonHaver={StudentsButtonHaver}
              columns={studentColumns}
              rows={studentRows}
            />
            <SpeedDialTemplate actions={studentActions} />
          </>
        )}
      </>
    )
  }

  const ClassTeachersSection = () => {
    return <>Giảng viên</>
  }

  const ClassDetailsSection = () => {
    const numberOfSubjects = subjectsList.length
    const numberOfStudents = sclassStudents.length

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Thông Tin Lớp Học
        </Typography>
        <Typography variant="h5" gutterBottom>
          Đây là lớp học {sclassDetails && sclassDetails.sclassName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Số lượng môn học : {numberOfSubjects}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Số lượng sinh viên : {numberOfStudents}
        </Typography>
        {getresponse && (
          <GreenButton
            variant="contained"
            sx={{
              marginRight: '16px'
            }}
            onClick={() => navigate('/Admin/class/addstudents/' + classID)}
          >
            Thêm sinh viên
          </GreenButton>
        )}
        {response && (
          <GreenButton
            variant="contained"
            onClick={() => navigate('/Admin/addsubject/' + classID)}
          >
            Thêm môn học
          </GreenButton>
        )}
      </>
    )
  }

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChange}
                  sx={{
                    position: 'fixed',
                    width: '100%',
                    bgcolor: 'background.paper',
                    zIndex: 1
                  }}
                >
                  <Tab label="Chi tiết" value="1" />
                  <Tab label="Môn học" value="2" />
                  <Tab label="Sinh viên" value="3" />
                  <Tab label="Giảng viên" value="4" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: '3rem', marginBottom: '4rem' }}>
                <TabPanel value="1">
                  <ClassDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <ClassSubjectsSection />
                </TabPanel>
                <TabPanel value="3">
                  <ClassStudentsSection />
                </TabPanel>
                <TabPanel value="4">
                  <ClassTeachersSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
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

export default ClassDetails
