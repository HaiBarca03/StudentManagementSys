import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteUser,
  getUserDetails,
  updateUser
} from '../../../redux/userRelated/userHandle'
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle'
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableHead,
  Typography,
  Avatar,
  Grid,
  Tab,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Card,
  CardContent,
  TextField
} from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Delete as DeleteIcon
} from '@mui/icons-material'
import {
  removeStuff,
  updateStudent,
  updateStudentFields
} from '../../../redux/studentRelated/studentHandle'
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject
} from '../../../components/attendanceCalculator'
import CustomBarChart from '../../../components/CustomBarChart'
import CustomPieChart from '../../../components/CustomPieChart'
import { StyledTableCell, StyledTableRow } from '../../../components/styles'

import InsertChartIcon from '@mui/icons-material/InsertChart'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import TableChartIcon from '@mui/icons-material/TableChart'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import Popup from '../../../components/Popup'
import UpdateStudent from './UpdateStudent'

const ViewStudent = () => {
  const [showTab, setShowTab] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const { userDetails, response, loading, error } = useSelector(
    (state) => state.user
  )

  const studentID = params.id
  const address = 'Student'
  useEffect(() => {
    dispatch(getUserDetails(studentID, address))
  }, [dispatch, studentID])

  useEffect(() => {
    if (
      userDetails &&
      userDetails.sclassName &&
      userDetails.sclassName._id !== undefined
    ) {
      dispatch(getSubjectList(userDetails.sclassName._id, 'ClassSubjects'))
    }
  }, [dispatch, userDetails])
  if (response) {
    console.log(response)
  } else if (error) {
    console.log(error)
  }

  const [name, setName] = useState('')
  const [rollNum, setRollNum] = useState('')
  const [password, setPassword] = useState('')
  const [sclassName, setSclassName] = useState('')
  const [studentSchool, setStudentSchool] = useState('')
  const [subjectMarks, setSubjectMarks] = useState('')
  const [subjectAttendance, setSubjectAttendance] = useState([])

  const [openStates, setOpenStates] = useState({})

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId]
    }))
  }

  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [selectedSection, setSelectedSection] = useState('table')
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection)
  }

  const fields =
    password === '' ? { name, rollNum } : { name, rollNum, password }

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || '')
      setRollNum(userDetails.rollNum || '')
      setSclassName(userDetails.sclassName || '')
      setStudentSchool(userDetails.school || '')
      setSubjectMarks(userDetails.examResult || '')
      setSubjectAttendance(userDetails.attendance || [])
    }
  }, [userDetails])

  const submitHandler = (event) => {
    event.preventDefault()
    dispatch(updateUser(fields, studentID, address))
      .then(() => {
        dispatch(getUserDetails(studentID, address))
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const setUserDetails = (e) => {}

  const deleteHandler = () => {
    setShowPopup(true)

    dispatch(deleteUser(studentID, address)).then(() => {
      navigate(-1)
    })
  }

  const removeHandler = (id, deladdress) => {
    dispatch(removeStuff(id, deladdress)).then(() => {
      dispatch(getUserDetails(studentID, address))
    })
  }

  const removeSubAttendance = (subId) => {
    dispatch(
      updateStudentFields(studentID, { subId }, 'RemoveStudentSubAtten')
    ).then(() => {
      dispatch(getUserDetails(studentID, address))
    })
  }

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance)
  const overallAbsentPercentage = 100 - overallAttendancePercentage

  const chartData = [
    { name: 'Present', value: overallAttendancePercentage },
    { name: 'Absent', value: overallAbsentPercentage }
  ]

  const subjectData = Object.entries(
    groupAttendanceBySubject(subjectAttendance)
  ).map(([subName, { subCode, present, sessions }]) => {
    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
      present,
      sessions
    )
    return {
      subject: subName,
      attendancePercentage: subjectAttendancePercentage,
      totalClasses: sessions,
      attendedClasses: present
    }
  })

  const StudentAttendanceSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3>Điểm danh</h3>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Môn học</StyledTableCell>
                <StyledTableCell>Sô tiết hiện tại</StyledTableCell>
                <StyledTableCell>Tổng số tiết</StyledTableCell>
                <StyledTableCell>Tỉ lệ tham gia</StyledTableCell>
                <StyledTableCell align="center">Hành động</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
              ([subName, { present, allData, subId, sessions }], index) => {
                const subjectAttendancePercentage =
                  calculateSubjectAttendancePercentage(present, sessions)
                return (
                  <TableBody key={index}>
                    <StyledTableRow>
                      <StyledTableCell>{subName}</StyledTableCell>
                      <StyledTableCell>{present}</StyledTableCell>
                      <StyledTableCell>{sessions}</StyledTableCell>
                      <StyledTableCell>
                        {subjectAttendancePercentage}%
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => handleOpen(subId)}
                        >
                          {openStates[subId] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                          Chi tiết
                        </Button>
                        <IconButton onClick={() => removeSubAttendance(subId)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                        <Button
                          variant="contained"
                          sx={styles.attendanceButton}
                          onClick={() =>
                            navigate(
                              `/Admin/subject/student/attendance/${studentID}/${subId}`
                            )
                          }
                        >
                          Thay đổi
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openStates[subId]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Chi tiết điểm danh
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <StyledTableRow>
                                  <StyledTableCell>Ngày</StyledTableCell>
                                  <StyledTableCell align="right">
                                    Trạng thái
                                  </StyledTableCell>
                                </StyledTableRow>
                              </TableHead>
                              <TableBody>
                                {allData.map((data, index) => {
                                  const date = new Date(data.date)
                                  const dateString =
                                    date.toString() !== 'Invalid Date'
                                      ? date.toISOString().substring(0, 10)
                                      : 'Invalid Date'
                                  return (
                                    <StyledTableRow key={index}>
                                      <StyledTableCell
                                        component="th"
                                        scope="row"
                                      >
                                        {dateString}
                                      </StyledTableCell>
                                      <StyledTableCell align="right">
                                        {data.status}
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                )
              }
            )}
          </Table>
          <div>
            Tỉ lệ phần trăm tham gia tiết học:{' '}
            {overallAttendancePercentage.toFixed(2)}%
          </div>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => removeHandler(studentID, 'RemoveStudentAtten')}
          >
            Xoá tất cả
          </Button>
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate('/Admin/students/student/attendance/' + studentID)
            }
          >
            Điểm danh
          </Button>
        </>
      )
    }
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart
            chartData={subjectData}
            dataKey="attendancePercentage"
          />
        </>
      )
    }
    return (
      <>
        {subjectAttendance &&
        Array.isArray(subjectAttendance) &&
        subjectAttendance.length > 0 ? (
          <>
            {selectedSection === 'table' && renderTableSection()}
            {selectedSection === 'chart' && renderChartSection()}

            <Paper
              sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Table"
                  value="table"
                  icon={
                    selectedSection === 'table' ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Chart"
                  value="chart"
                  icon={
                    selectedSection === 'chart' ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate('/Admin/students/student/attendance/' + studentID)
            }
          >
            Điểm danh
          </Button>
        )}
      </>
    )
  }

  const StudentMarksSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3>Điểm môn học</h3>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Môn học</StyledTableCell>
                <StyledTableCell>Điểm</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {subjectMarks.map((result, index) => {
                if (!result.subName || !result.marksObtained) {
                  return null
                }
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                  </StyledTableRow>
                )
              })}
            </TableBody>
          </Table>
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate('/Admin/students/student/marks/' + studentID)
            }
          >
            Nhập điểm
          </Button>
        </>
      )
    }
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
        </>
      )
    }
    return (
      <>
        {subjectMarks &&
        Array.isArray(subjectMarks) &&
        subjectMarks.length > 0 ? (
          <>
            {selectedSection === 'table' && renderTableSection()}
            {selectedSection === 'chart' && renderChartSection()}

            <Paper
              sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Table"
                  value="table"
                  icon={
                    selectedSection === 'table' ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Chart"
                  value="chart"
                  icon={
                    selectedSection === 'chart' ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate('/Admin/students/student/marks/' + studentID)
            }
          >
            Nhập điểm
          </Button>
        )}
      </>
    )
  }

  const StudentDetailsSection = () => {
    const [showTab, setShowTab] = useState(false)

    return (
      <Card
        sx={{
          maxWidth: 700,
          margin: 'auto',
          mt: 5,
          p: 3,
          boxShadow: 5,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={4} display="flex" justifyContent="center">
              {userDetails.images && userDetails.images.length > 0 && (
                <Avatar
                  src={userDetails.images[0].url}
                  alt="Student"
                  sx={{ width: 120, height: 120, border: '3px solid #1976d2' }}
                />
              )}
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold', color: '#1976d2' }}
              >
                {userDetails.name}
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ fontStyle: 'italic' }}
              >
                {userDetails.major} | {userDetails.trainingLevel}{' '}
                {userDetails.typeOfTraining}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Typography>
                <strong>Mã sinh viên:</strong> {userDetails.rollNum}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Lớp:</strong> {userDetails?.sclassName?.sclassName}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Trường:</strong> {userDetails?.school?.schoolName}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Trạng thái:</strong> {userDetails.status}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Quốc tịch:</strong> {userDetails.nationality}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Tôn giáo:</strong> {userDetails.religion}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Giới tính:</strong>{' '}
                {userDetails.sex === 'male' ? 'Nam' : 'Nữ'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Ngày sinh:</strong>{' '}
                {new Date(userDetails.dateOfBirth).toLocaleDateString('vi-VN')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Địa chỉ:</strong> {userDetails.address}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Email:</strong> {userDetails.email}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Số điện thoại:</strong> {userDetails.phone}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="error"
            sx={{ mt: 3, borderRadius: 2 }}
            onClick={deleteHandler}
          >
            Xoá
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 3, ml: 2, borderRadius: 2 }}
            onClick={() => setShowTab(!showTab)}
          >
            {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />} Cập nhật
          </Button>

          <Collapse in={showTab} timeout="auto" unmountOnExit>
            <UpdateStudent studentID={studentID} userDetails={userDetails} />
          </Collapse>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {loading ? (
        <>
          <div>Loading...</div>
        </>
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
                  <Tab label="Điểm danh" value="2" />
                  <Tab label="Điểm" value="3" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: '3rem', marginBottom: '4rem' }}>
                <TabPanel value="1">
                  <StudentDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <StudentAttendanceSection />
                </TabPanel>
                <TabPanel value="3">
                  <StudentMarksSection />
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

export default ViewStudent

const styles = {
  attendanceButton: {
    marginLeft: '20px',
    backgroundColor: '#270843',
    '&:hover': {
      backgroundColor: '#3f1068'
    }
  },
  styledButton: {
    margin: '20px',
    backgroundColor: '#02250b',
    '&:hover': {
      backgroundColor: '#106312'
    }
  }
}
