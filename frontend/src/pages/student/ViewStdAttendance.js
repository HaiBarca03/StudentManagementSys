import React, { useEffect, useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Collapse,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject
} from '../../components/attendanceCalculator';
import CustomBarChart from '../../components/CustomBarChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ViewStdAttendance = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [openStates, setOpenStates] = useState({});
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [selectedSection, setSelectedSection] = useState('table');

  const { userDetails, currentUser, loading, response, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, 'Student'));
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (userDetails) {
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId]
    }));
  };

  const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

  const subjectData = Object.entries(attendanceBySubject).map(
    ([subName, { subCode, present, sessions }]) => {
      const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
        present,
        sessions
      );
      return {
        subject: subName,
        attendancePercentage: subjectAttendancePercentage,
        totalClasses: sessions,
        attendedClasses: present
      };
    }
  );

  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const renderTableSection = () => (
    <Box sx={{ mb: 8 }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ mb: 3, paddingTop: 2 }}
      >
        Điểm Danh
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px' }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>Môn Học</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>Điểm Danh</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>Số tiết học</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>Tỷ Lệ Tham Dự</StyledTableCell>
              <StyledTableCell align="center" sx={{ fontWeight: 'bold' }}>Hành Động</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          {Object.entries(attendanceBySubject).map(
            ([subName, { present, allData, subId, sessions }], index) => {
              const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

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
                        startIcon={
                          openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                        }
                      >
                        Chi Tiết
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
                          <Typography variant="h6" gutterBottom component="div">
                            Chi Tiết Tham Dự
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <StyledTableRow>
                                <StyledTableCell>Ngày</StyledTableCell>
                                <StyledTableCell align="right">Tình Trạng</StyledTableCell>
                              </StyledTableRow>
                            </TableHead>
                            <TableBody>
                              {allData.map((data, index) => {
                                const date = new Date(data.date);
                                const dateString =
                                  date.toString() !== 'Invalid Date'
                                    ? date.toISOString().substring(0, 10)
                                    : 'Invalid Date';
                                return (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row">
                                      {dateString}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      {data.status}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              );
            }
          )}
        </Table>
      </TableContainer>
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
        Tỷ Lệ Tham Dự Tổng Thể: {overallAttendancePercentage.toFixed(2)}%
      </Typography>
    </Box>
  );

  const renderChartSection = () => (
    <Box sx={{ mb: 8, p: 2 }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ mb: 3 }}
      >
        Biểu Đồ Tham Dự
      </Typography>
      <CustomBarChart
        chartData={subjectData}
        dataKey="attendancePercentage"
        height={400}
      />
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {subjectAttendance && subjectAttendance.length > 0 ? (
        <>
          {selectedSection === 'table' && renderTableSection()}
          {selectedSection === 'chart' && renderChartSection()}

          <Paper
            sx={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0, 
              right: 0,
              zIndex: theme.zIndex.appBar,
              borderTop: `1px solid ${theme.palette.divider}`
            }}
            elevation={3}
          >
            <BottomNavigation
              value={selectedSection}
              onChange={handleSectionChange}
              showLabels
              sx={{
                '& .Mui-selected': {
                  color: theme.palette.primary.main,
                  '& .MuiBottomNavigationAction-label': {
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }
                }
              }}
            >
              <BottomNavigationAction
                label="Bảng"
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
                label="Biểu Đồ"
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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh'
        }}>
          <Typography variant="h6" align="center">
            Hiện tại bạn không có thông tin tham dự!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ViewStdAttendance;