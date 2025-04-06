import React, { useEffect, useState } from 'react'
import { 
Container, 
Grid, 
Paper, 
Typography, 
Box, 
useTheme,
Chip,
CircularProgress
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator'
import { getUserDetails } from '../../redux/userRelated/userHandle'
import SeeNotice from '../../components/SeeNotice'
import CountUp from 'react-countup'
import Subject from "../../assets/subjects.svg"
import Assignment from "../../assets/assignment.svg"
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const StudentHomePage = () => {
    const dispatch = useDispatch()
    const theme = useTheme()

    const { userDetails, currentUser, loading, response } = useSelector((state) => state.user)
    const { subjectsList } = useSelector((state) => state.sclass)

    const [subjectAttendance, setSubjectAttendance] = useState([])
    const [activeIndex, setActiveIndex] = useState(null)

    const classID = currentUser?.sclassName?._id || ""

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getUserDetails(currentUser._id, "Student"))
            if (classID) {
                dispatch(getSubjectList(classID, "ClassSubjects"))
            }
        }
    }, [dispatch, currentUser?._id, classID])

    const numberOfSubjects = subjectsList?.length || 0

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || [])
        }
    }, [userDetails])

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance)
    const overallAbsentPercentage = 100 - overallAttendancePercentage

    const chartData = [
        { name: 'Có mặt', value: overallAttendancePercentage, color: theme.palette.success.main },
        { name: 'Vắng mặt', value: overallAbsentPercentage, color: theme.palette.error.main }
    ]

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    color: 'white'
                }}>
                    <Typography variant="body2">{payload[0].name}: {payload[0].value.toFixed(1)}%</Typography>
                </Box>
            )
        }
        return null
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* First row - Statistics cards */}
                <Grid container item spacing={2} sx>
                {/* Thẻ Môn học */}
                <Grid container spacing={2} sx={{ maxWidth: 600, marginTop: 0}} >

                <Grid item xs={12} sm={12} md={12} lg={12} >
                    <Paper elevation={3} sx={{
                        p: 2,
                        borderRadius: 2,
                        height: '100%',
                        minHeight: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                        },
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        background: `linear-gradient(to right, ${theme.palette.primary.light}08, ${theme.palette.background.paper})`,
                        mb: 2 // Add margin bottom to separate from next card
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                backgroundColor: `${theme.palette.primary.light}20`,
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 1.5
                            }}>
                                <img src={Subject} alt="Subjects" style={{ width: 24, height: 24 }} />
                            </Box>
                            <Typography variant="subtitle1" fontWeight="500">Môn học</Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Tổng số môn
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <CountUp 
                                    start={0} 
                                    end={numberOfSubjects} 
                                    duration={1.8}
                                    style={{
                                        fontSize: '1.6rem',
                                        fontWeight: 'bold',
                                        color: theme.palette.primary.main,
                                        lineHeight: 1
                                    }}
                                />
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                        fontSize: '0.75rem',
                                        bgcolor: `${theme.palette.primary.light}15`,
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1
                                    }}
                                >
                                    {numberOfSubjects > 0 ? 'Đang học' : 'Chưa có'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Thẻ Bài tập */}
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Paper elevation={3} sx={{
                        p: 2,
                        borderRadius: 2,
                        height: '100%',
                        minHeight: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                        },
                        borderLeft: `4px solid ${theme.palette.secondary.main}`,
                        background: `linear-gradient(to right, ${theme.palette.secondary.light}08, ${theme.palette.background.paper})`
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                backgroundColor: `${theme.palette.secondary.light}20`,
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 1.5
                            }}>
                                <img src={Assignment} alt="Assignments" style={{ width: 24, height: 24 }} />
                            </Box>
                            <Typography variant="subtitle1" fontWeight="500">Bài tập</Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Tổng số bài
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <CountUp 
                                    start={0} 
                                    end={15} 
                                    duration={1.8}
                                    style={{
                                        fontSize: '1.6rem',
                                        fontWeight: 'bold',
                                        color: theme.palette.secondary.main,
                                        lineHeight: 1
                                    }}
                                />
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                        fontSize: '0.75rem',
                                        bgcolor: `${theme.palette.secondary.light}15`,
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1
                                    }}
                                >
                                    {15 > 0 ? 'Đang có' : 'Chưa có'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                </Grid>     
        {/* Second row - Chart */}
<Grid item xs={12} md={6} lg={6} sx={{ minHeight: { xs: 450, md: 400 } }}>
  <Paper elevation={3} sx={{
    p: { xs: 1.5, md: 3 },
    borderRadius: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderTop: `4px solid ${theme.palette.info.main}`
  }}>
    {/* Header section */}
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'flex-start', sm: 'center' },
      mb: 2,
      gap: 1.5
    }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 'bold',
        color: theme.palette.text.primary,
        fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' }
      }}>
        THỐNG KÊ ĐIỂM DANH
      </Typography>
      
      {!loading && !response && subjectAttendance?.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap'
        }}>
          <Chip 
            label={`Có mặt: ${overallAttendancePercentage.toFixed(1)}%`}
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
          <Chip 
            label={`Vắng mặt: ${overallAbsentPercentage.toFixed(1)}%`}
            size="small"
            color="error"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      )}
    </Box>

    {/* Main content area */}
    <Box sx={{ 
      flex: 1,
      minHeight: 300,
      overflow: 'auto',
      py: 1
    }}>
      {response ? (
        <Box sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <Typography variant="body1" color="text.secondary">
            Không tìm thấy dữ liệu điểm danh
          </Typography>
        </Box>
      ) : loading ? (
        <Box sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress color="info" />
        </Box>
      ) : subjectAttendance?.length > 0 ? (
        <Box sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 3 }
        }}>
          {/* Pie Chart */}
          <Box sx={{ 
            flex: 1,
            minHeight: { xs: 200, sm: 250 },
            position: 'relative'
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    index
                  }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                        }}
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke={theme.palette.background.paper}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  wrapperStyle={{ zIndex: 1000 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Details section */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: { xs: 1, md: 2 },
            p: { xs: 1, md: 2 },
            overflow: 'auto'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ 
              mb: 1,
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}>
              CHI TIẾT ĐIỂM DANH
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1
            }}>
              {chartData.map((item, index) => (
                <Box key={index} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: { xs: 1, md: 1.5 },
                  borderRadius: 1,
                  backgroundColor: `${item.color}10`,
                  borderLeft: `4px solid ${item.color}`
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      flexShrink: 0
                    }} />
                    <Typography variant="body1" sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold" sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    ml: 1
                  }}>
                    {item.value.toFixed(1)}%
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ mt: { xs: 1, md: 2 } }}>
              <Typography variant="body2" color="text.secondary" sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                Tổng số buổi học: {subjectAttendance.length}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <Typography variant="body1" color="text.secondary">
            Chưa có dữ liệu điểm danh
          </Typography>
        </Box>
      )}
    </Box>
  </Paper>                    
</Grid>
                </Grid>          
                {/* Third row - Notice */}
                <Grid item xs={12}>
                    <Paper sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        height: '100%',
                        borderTop: `4px solid ${theme.palette.warning.main}`
                    }}>
                        <Typography variant="h5" sx={{ 
                            fontWeight: 'bold',
                            color: theme.palette.text.primary,
                            mb: 1
                        }}>
                        </Typography>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default StudentHomePage