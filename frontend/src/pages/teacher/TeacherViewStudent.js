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
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  Typography,
  Avatar,
  Chip
} from '@mui/material'
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle,
  Cancel
} from '@mui/icons-material'
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject
} from '../../components/attendanceCalculator'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { PurpleButton } from '../../components/buttonStyles'
import { StyledTableCell, StyledTableRow } from '../../components/styles'

const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28'];

const CustomPieChart = ({ data }) => {
  return (
<Box sx={{ 
  height: 400, 
  width: '100%', 
  mt: 4,
  position: 'relative'
}}>
  <Typography variant="h6" gutterBottom align="center">
    Tổng quan điểm danh
  </Typography>
  <ResponsiveContainer width="100%" height="100%">
    <PieChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={true}
        outerRadius={100} // Giảm bán kính để chừa chỗ cho label
        innerRadius={50} // Thêm innerRadius để tạo donut chart
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
          const RADIAN = Math.PI / 180;
          // Tính toán vị trí chính xác hơn
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
          
          return (
            <text
              x={x}
              y={y}
              fill="#333"
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                pointerEvents: 'none'
              }}
            >
              {`${(percent * 100).toFixed(0)}%`}
            </text>
          );
        }}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip 
        formatter={(value) => [`${value}%`, 'Tỷ lệ']}
        contentStyle={{
          borderRadius: '8px',
          padding: '8px 12px',
          border: 'none',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          fontSize: '14px'
        }}
      />
      <Legend 
        layout="horizontal"
        verticalAlign="bottom"
        align="center"
        wrapperStyle={{
          paddingTop: '30px',
          fontSize: '14px'
        }}
        formatter={(value) => (
          <span style={{ 
            color: '#333',
            padding: '0 10px',
            whiteSpace: 'nowrap'
          }}>
            {value}
          </span>
        )}
      />
    </PieChart>
  </ResponsiveContainer>
</Box>
  );
};

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
    { name: 'Có mặt', value: overallAttendancePercentage },
    { name: 'Vắng mặt', value: overallAbsentPercentage }
  ]

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6">Đang tải...</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Student Info Card */}
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardHeader
                  title="Thông tin sinh viên"
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    '& .MuiCardHeader-title': {
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }
                  }}
                />
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ width: 80, height: 80, mr: 2 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {userDetails.name}
                      </Typography>
                      <Typography color="textSecondary">
                        Mã SV: {userDetails.rollNum}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Lớp:</strong> {sclassName.sclassName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Trường:</strong> {studentSchool.schoolName}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Attendance Summary Card */}
              <Card elevation={3} sx={{ mt: 3 }}>
                <CardHeader
                  title="Tổng quan điểm danh"
                  sx={{ 
                    bgcolor: 'secondary.main', 
                    color: 'white',
                    '& .MuiCardHeader-title': {
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }
                  }}
                />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography>
                      <Chip 
                        icon={<CheckCircle />} 
                        label={`Có mặt: ${overallAttendancePercentage.toFixed(2)}%`} 
                        color="success" 
                        variant="outlined"
                      />
                    </Typography>
                    <Typography>
                      <Chip 
                        icon={<Cancel />} 
                        label={`Vắng mặt: ${overallAbsentPercentage.toFixed(2)}%`} 
                        color="error" 
                        variant="outlined"
                      />
                    </Typography>
                  </Box>
                  <CustomPieChart data={chartData} />
                </CardContent>
              </Card>
            </Grid>

            {/* Attendance Details */}
            <Grid item xs={12} md={8}>
              <Card elevation={3}>
                <CardHeader
                  title="Chi tiết điểm danh"
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    '& .MuiCardHeader-title': {
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }
                  }}
                />
                <CardContent>
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
                                <TableContainer component={Paper} key={index} sx={{ mb: 3 }}>
                                  <Table>
                                    <TableHead>
                                      <StyledTableRow>
                                        <StyledTableCell>Môn học</StyledTableCell>
                                        <StyledTableCell align="center">Có mặt</StyledTableCell>
                                        <StyledTableCell align="center">Tổng buổi</StyledTableCell>
                                        <StyledTableCell align="center">Tỷ lệ</StyledTableCell>
                                        <StyledTableCell align="center">Hành động</StyledTableCell>
                                      </StyledTableRow>
                                    </TableHead>

                                    <TableBody>
                                      <StyledTableRow>
                                        <StyledTableCell>{subName}</StyledTableCell>
                                        <StyledTableCell align="center">
                                          <Chip 
                                            label={present} 
                                            color="success" 
                                            size="small"
                                          />
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                          {sessions}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                          <Chip 
                                            label={`${subjectAttendancePercentage}%`}
                                            color={
                                              subjectAttendancePercentage >= 80 
                                                ? 'success' 
                                                : subjectAttendancePercentage >= 50 
                                                ? 'warning' 
                                                : 'error'
                                            }
                                          />
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                          <Button
                                            variant="outlined"
                                            onClick={() => handleOpen(subId)}
                                            endIcon={
                                              openStates[subId] 
                                                ? <KeyboardArrowUp /> 
                                                : <KeyboardArrowDown />
                                            }
                                          >
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
                                                Lịch sử điểm danh
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
                                                          <Chip 
                                                            label={data.status}
                                                            color={data.status === 'Present' ? 'success' : 'error'}
                                                            size="small"
                                                          />
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
                                </TableContainer>
                              )
                            } else {
                              return null
                            }
                          }
                        )}

                        <Box display="flex" justifyContent="space-between" mt={3}>
                          <PurpleButton
                            variant="contained"
                            onClick={() =>
                              navigate(
                                `/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`
                              )
                            }
                          >
                            Điểm danh
                          </PurpleButton>
                        </Box>
                      </>
                    )}
                </CardContent>
              </Card>

              {/* Marks Section */}
              <Card elevation={3} sx={{ mt: 3 }}>
                <CardHeader
                  title="Điểm thành phần"
                  sx={{ 
                    bgcolor: 'secondary.main', 
                    color: 'white',
                    '& .MuiCardHeader-title': {
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }
                  }}
                />
                <CardContent>
                  {subjectMarks &&
                    Array.isArray(subjectMarks) &&
                    subjectMarks.length > 0 && (
                      <>
                        {subjectMarks.map((result, index) => {
                          if (result.subName.subName === teachSubject) {
                            return (
                              <TableContainer component={Paper} key={index}>
                                <Table>
                                  <TableHead>
                                    <StyledTableRow>
                                      <StyledTableCell>Môn học</StyledTableCell>
                                      <StyledTableCell align="center">Điểm</StyledTableCell>
                                    </StyledTableRow>
                                  </TableHead>
                                  <TableBody>
                                    <StyledTableRow>
                                      <StyledTableCell>
                                        {result.subName.subName}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        <Chip 
                                          label={result.marksObtained}
                                          color={
                                            result.marksObtained >= 8 
                                              ? 'success' 
                                              : result.marksObtained >= 5 
                                              ? 'warning' 
                                              : 'error'
                                          }
                                        />
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            )
                          } else if (!result.subName || !result.marksObtained) {
                            return null
                          }
                          return null
                        })}
                      </>
                    )}
                  <Box display="flex" justifyContent="flex-end" mt={3}>
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
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  )
}

export default TeacherViewStudent