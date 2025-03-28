import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Paper,
  Table,
  TableBody,
  TableHead,
  Typography,
} from '@mui/material';
import CustomBarChart from '../../components/CustomBarChart';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const StudentSubjects = () => {
  const dispatch = useDispatch();
  const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
  const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, 'Student'));
    }
  }, [dispatch, currentUser?._id]);

  if (response) console.log(response);
  if (error) console.log(error);

  const [subjectMarks, setSubjectMarks] = useState([]);
  const [selectedSection, setSelectedSection] = useState('table');

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    if (!subjectMarks.length && currentUser?.sclassName?._id) {
      dispatch(getSubjectList(currentUser.sclassName._id, 'ClassSubjects'));
    }
  }, [subjectMarks, dispatch, currentUser?.sclassName?._id]);

  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const renderTableSection = () => (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Điểm Môn Học
      </Typography>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Môn Học</StyledTableCell>
            <StyledTableCell>Điểm</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {subjectMarks.map((result, index) => (
            result.subName && result.marksObtained ? (
              <StyledTableRow key={index}>
                <StyledTableCell>{result.subName.subName}</StyledTableCell>
                <StyledTableCell>{result.marksObtained}</StyledTableCell>
              </StyledTableRow>
            ) : null
          ))}
        </TableBody>
      </Table>
    </>
  );

  const renderChartSection = () => <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />;

  const renderClassDetailsSection = () => (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Chi tiết lớp học
      </Typography>
      <Typography variant="h5" gutterBottom>
        Bạn hiện đang ở trong lớp {sclassDetails?.sclassName}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Và đây là những chủ đề:
      </Typography>
      {subjectsList?.map((subject, index) => (
        <Typography key={index} variant="subtitle1">
          {subject.subName} ({subject.subCode})
        </Typography>
      ))}
    </Container>
  );

  return (
    <>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div>
          {subjectMarks.length > 0 ? (
            <>
              {selectedSection === 'table' && renderTableSection()}
              {selectedSection === 'chart' && renderChartSection()}
              <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                  <BottomNavigationAction
                    label="Table"
                    value="table"
                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                  />
                  <BottomNavigationAction
                    label="Chart"
                    value="chart"
                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                  />
                </BottomNavigation>
              </Paper>
            </>
          ) : (
            renderClassDetailsSection()
          )}
        </div>
      )}
    </>
  );
};

export default StudentSubjects;
