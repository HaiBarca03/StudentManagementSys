import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomBarChart from '../../components/CustomBarChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SubjectIcon from '@mui/icons-material/Subject';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Custom styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '0.875rem',
  [theme.breakpoints.up('md')]: {
    fontSize: '1rem'
  },
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-child td, &:last-child th': {
    borderBottom: 0
  }
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem'
  }
}));

const StudentSubjects = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { subjectsList } = useSelector((state) => state.sclass);
  const { userDetails, currentUser, loading } = useSelector((state) => state.user);
  
  const [subjectMarks, setSubjectMarks] = useState([]);
  const [selectedSection, setSelectedSection] = useState('table');

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, 'Student'));
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    if (currentUser?.sclassName?._id && subjectMarks.length === 0) {
      dispatch(getSubjectList(currentUser.sclassName._id, 'ClassSubjects'));
    }
  }, [subjectMarks, dispatch, currentUser?.sclassName?._id]);

  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const renderTableSection = () => (
    <Box sx={{ mb: 8, px: { xs: 1, sm: 3 } }}>
      <SectionHeader variant="h4" paddingTop={3}>
        <EmojiEventsIcon fontSize="large" sx={{ color: theme.palette.warning.main }} />
        Điểm Môn Học
      </SectionHeader>
      <TableContainer 
        component={Paper} 
        elevation={3} 
        sx={{ 
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`,
          overflowX: 'auto',
          '& .MuiTableCell-root': {
            borderRight: `1px solid ${theme.palette.divider}`,
            '&:last-child': {
              borderRight: 'none'
            }
          }
        }}
      >
        <Table sx={{ minWidth: 300 }}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sx={{ 
                fontWeight: 700, 
                bgcolor: theme.palette.background.default,
                borderBottom: `2px solid ${theme.palette.divider}`
              }}>
                Môn Học
              </StyledTableCell>
              <StyledTableCell sx={{ 
                fontWeight: 700, 
                bgcolor: theme.palette.background.default,
                borderBottom: `2px solid ${theme.palette.divider}`
              }}>
                Điểm
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {subjectMarks.map((result, index) =>
              result.subName && result.marksObtained ? (
                <StyledTableRow 
                  key={index}
                  sx={{
                    '&:not(:last-child)': {
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }
                  }}
                >
                  <StyledTableCell>{result.subName.subName}</StyledTableCell>
                  <StyledTableCell>{result.marksObtained}</StyledTableCell>
                </StyledTableRow>
              ) : null
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderChartSection = () => (
    <Box sx={{ mb: 8, p: { xs: 1, sm: 3 } }}>
      <SectionHeader variant="h4">
        <InsertChartIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
        Biểu Đồ Điểm Môn Học
      </SectionHeader>
      <Paper elevation={3} sx={{ p: 2, borderRadius: '12px' }}>
        <CustomBarChart 
          chartData={subjectMarks} 
          dataKey="marksObtained" 
          height={400}
        />
      </Paper>
    </Box>
  );

  const renderClassDetailsSection = () => (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 1, sm: 3 } }}>
      <SectionHeader variant="h4">
        <SchoolIcon fontSize="large" sx={{ color: theme.palette.info.main }} />
        Chi Tiết Lớp Học
      </SectionHeader>
  
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: theme.palette.text.secondary
        }}
      >
        <SubjectIcon color="action" />
        Danh Sách Môn Học
      </Typography>
  
      <TableContainer 
        component={Paper} 
        elevation={3} 
        sx={{ 
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`,
          mb: 8,
          overflowX: 'auto',
          '& .MuiTableCell-root': {
            borderRight: `1px solid ${theme.palette.divider}`,
            '&:last-child': {
              borderRight: 'none'
            }
          }
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sx={{ 
                fontWeight: 700, 
                bgcolor: theme.palette.background.default,
                borderBottom: `2px solid ${theme.palette.divider}`
              }}>
                STT
              </StyledTableCell>
              <StyledTableCell sx={{ 
                fontWeight: 700, 
                bgcolor: theme.palette.background.default,
                borderBottom: `2px solid ${theme.palette.divider}`
              }}>
                Tên Môn Học
              </StyledTableCell>
              <StyledTableCell sx={{ 
                fontWeight: 700, 
                bgcolor: theme.palette.background.default,
                borderBottom: `2px solid ${theme.palette.divider}`
              }}>
                Mã Môn Học
              </StyledTableCell>
              <StyledTableCell sx={{ 
                fontWeight: 700, 
                bgcolor: theme.palette.background.default,
                borderBottom: `2px solid ${theme.palette.divider}`
              }}>
                Số Buổi
              </StyledTableCell>
              <StyledTableCell sx={{ 
                fontWeight: 700, 
                bgcolor: theme.palette.background.default,
                borderBottom: `2px solid ${theme.palette.divider}`
              }}>
                Ngày Tạo
              </StyledTableCell>
              <StyledTableCell sx={{ 
                fontWeight: 700, 
                bgcolor: theme.palette.background.default,
                borderBottom: `2px solid ${theme.palette.divider}`
              }}>
                Ngày Cập Nhật
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {subjectsList?.map((subject, index) => (
              <StyledTableRow 
                key={subject._id} 
                hover
                sx={{
                  '&:not(:last-child)': {
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }
                }}
              >
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{subject.subName}</StyledTableCell>
                <StyledTableCell>{subject.subCode}</StyledTableCell>
                <StyledTableCell>{subject.sessions}</StyledTableCell>
                <StyledTableCell>
                  {new Date(subject.createdAt).toLocaleDateString('vi-VN')}
                </StyledTableCell>
                <StyledTableCell>
                  {new Date(subject.updatedAt).toLocaleDateString('vi-VN')}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
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
    <>
      {subjectMarks.length > 0 ? (
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
              borderTop: `1px solid ${theme.palette.divider}`,
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)'
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
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  mt: 0.5
                }
              }}
            >
              <BottomNavigationAction
                label="Bảng Điểm"
                value="table"
                icon={
                  selectedSection === 'table' ? (
                    <TableChartIcon fontSize="medium" />
                  ) : (
                    <TableChartOutlinedIcon fontSize="medium" />
                  )
                }
              />
              <BottomNavigationAction
                label="Biểu Đồ"
                value="chart"
                icon={
                  selectedSection === 'chart' ? (
                    <InsertChartIcon fontSize="medium" />
                  ) : (
                    <InsertChartOutlinedIcon fontSize="medium" />
                  )
                }
              />
            </BottomNavigation>
          </Paper>
        </>
      ) : (
        renderClassDetailsSection()
      )}
    </>
  );
};

export default StudentSubjects;