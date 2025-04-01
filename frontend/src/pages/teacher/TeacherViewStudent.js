import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails } from '../../redux/userRelated/userHandle'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  Table,
  TableBody,
  TableHead,
  Typography
} from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject
} from '../../components/attendanceCalculator'
import CustomPieChart from '../../components/CustomPieChart'
import { PurpleButton } from '../../components/buttonStyles'
import { StyledTableCell, StyledTableRow } from '../../components/styles'

const TeacherViewStudent = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const { currentUser, userDetails, response, loading, error } = useSelector(
    (state) => state.user
  )

  const address = 'Student'
  const studentID = params.id
  const teachSubject = currentUser.teachSubject?.subName
  const teachSubjectID = currentUser.teachSubject?._id

  useEffect(() => {
    dispatch(getUserDetails(studentID, address))
  }, [dispatch, studentID])

  const [sclassName, setSclassName] = useState('')
  const [studentSchool, setStudentSchool] = useState('')
  const [subjectMarks, setSubjectMarks] = useState('')
  const [subjectAttendance, setSubjectAttendance] = useState([])

  const [openStates, setOpenStates] = useState({})

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId]
    }))
  }

  useEffect(() => {
    if (userDetails) {
      setSclassName(userDetails.sclassName || '')
      setStudentSchool(userDetails.school || '')
      setSubjectMarks(userDetails.examResult || '')
      setSubjectAttendance(userDetails.attendance || [])
    }
  }, [userDetails])

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance)
  const overallAbsentPercentage = 100 - overallAttendancePercentage

  const chartData = [
    { name: 'Present', value: overallAttendancePercentage },
    { name: 'Absent', value: overallAbsentPercentage }
  ]

  return (
    <>
      {loading ? (
        <>
          <div>Loading...</div>
        </>
      ) : (
        <Box sx={{ m: 10 }}>
          <Box sx={{ mb: 4 }}>
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title="Thông tin sinh viên"
                sx={{ bgcolor: '#f5f5f5' }}
              />
              <CardContent>
                <Typography variant="body1">
                  <strong>Họ tên:</strong> {userDetails.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Mã sinh viên:</strong> {userDetails.rollNum}
                </Typography>
                <Typography variant="body1">
                  <strong>Lớp:</strong> {sclassName.sclassName}
                </Typography>
                <Typography variant="body1">
                  <strong>Trường:</strong> {studentSchool.schoolName}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <h3>Điểm danh:</h3>
          {subjectAttendance &&
            Array.isArray(subjectAttendance) &&
            subjectAttendance.length > 0 && (
              <>
                {Object.entries(
                  groupAttendanceBySubject(subjectAttendance)
                ).map(
                  ([subName, { present, allData, subId, sessions }], index) => {
                    if (subName === teachSubject) {
                      const subjectAttendancePercentage =
                        calculateSubjectAttendancePercentage(present, sessions)

                      return (
                        <Table key={index}>
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell>Môn học</StyledTableCell>
                              <StyledTableCell>Hiện tại</StyledTableCell>
                              <StyledTableCell>Tổng tiết học</StyledTableCell>
                              <StyledTableCell>Tỉ lệ</StyledTableCell>
                              <StyledTableCell align="center">
                                Hành động
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableHead>

                          <TableBody>
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
                                          <StyledTableCell>
                                            Ngày
                                          </StyledTableCell>
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
                                              ? date
                                                  .toISOString()
                                                  .substring(0, 10)
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
                        </Table>
                      )
                    } else {
                      return null
                    }
                  }
                )}
                <div>
                  Tỷ lệ đi học: {overallAttendancePercentage.toFixed(2)}%
                </div>

                <CustomPieChart data={chartData} />
              </>
            )}
          <br />
          <br />
          <Button
            variant="contained"
            onClick={() =>
              navigate(
                `/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`
              )
            }
          >
            Điểm danh
          </Button>
          <br />
          <br />
          <br />
          <h3>Điểm thành phần:</h3>
          {subjectMarks &&
            Array.isArray(subjectMarks) &&
            subjectMarks.length > 0 && (
              <>
                {subjectMarks.map((result, index) => {
                  if (result.subName.subName === teachSubject) {
                    return (
                      <Table key={index}>
                        <TableHead>
                          <StyledTableRow>
                            <StyledTableCell>Môn học</StyledTableCell>
                            <StyledTableCell>Điểm</StyledTableCell>
                          </StyledTableRow>
                        </TableHead>
                        <TableBody>
                          <StyledTableRow>
                            <StyledTableCell>
                              {result.subName.subName}
                            </StyledTableCell>
                            <StyledTableCell>
                              {result.marksObtained}
                            </StyledTableCell>
                          </StyledTableRow>
                        </TableBody>
                      </Table>
                    )
                  } else if (!result.subName || !result.marksObtained) {
                    return null
                  }
                  return null
                })}
              </>
            )}
          <PurpleButton
            variant="contained"
            onClick={() =>
              navigate(
                `/Teacher/class/student/marks/${studentID}/${teachSubjectID}`
              )
            }
          >
            Chấm điểm
          </PurpleButton>
          <br />
          <br />
          <br />
        </Box>
      )}
    </>
  )
}

export default TeacherViewStudent
