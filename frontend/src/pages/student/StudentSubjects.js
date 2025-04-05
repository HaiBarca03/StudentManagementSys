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
import CustomBarChart from '../../components/CustomBarChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import SchoolIcon from '@mui/icons-material/School';
import SubjectIcon from '@mui/icons-material/Subject';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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
    <Box sx={{ mb: 8 }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1,
          mb: 3
        }}
      >
        <EmojiEventsIcon fontSize="large" sx={{ mt: '5', paddingTop:10 }} />
        Điểm Môn Học
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px' }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Môn Học</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Điểm</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {subjectMarks.map((result, index) =>
              result.subName && result.marksObtained ? (
                <StyledTableRow key={index}>
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
    <Box sx={{ mb: 8, p: 2 }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
      >
        <InsertChartIcon fontSize="large" />
        Biểu Đồ Điểm Môn Học
      </Typography>
      <CustomBarChart 
        chartData={subjectMarks} 
        dataKey="marksObtained" 
        height={400}
      />
    </Box>
  );

  const renderClassDetailsSection = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1,
          mb: 4
        }}
      >
        <SchoolIcon fontSize="large" />
        Chi Tiết Lớp Học
      </Typography>

      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          mb: 2
        }}
      >
        <SubjectIcon />
        Danh Sách Môn Học
      </Typography>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px', mb: 8 }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>STT</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>Tên Môn Học</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>Mã Môn Học</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>Số Buổi</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>Ngày Tạo</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>Ngày Cập Nhật</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {subjectsList?.map((subject, index) => (
              <StyledTableRow key={subject._id}>
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
                label="Bảng Điểm"
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
        renderClassDetailsSection()
      )}
    </>
  );
};

export default StudentSubjects;