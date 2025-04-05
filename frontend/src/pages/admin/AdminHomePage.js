import { Container, Grid, Paper, Typography } from '@mui/material';
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);

    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} md={6} lg={3}>
                    <StatsCard elevation={3}>
                        <CardImage src={Students} alt="Students" />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Tổng Số Sinh Viên
                            </Typography>
                            <StatsNumber
                                start={0}
                                end={numberOfStudents}
                                duration={2.5}
                                separator=","
                            />
                        </CardContent>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <StatsCard elevation={3}>
                        <CardImage src={Classes} alt="Classes" />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Tổng Số Lớp Học
                            </Typography>
                            <StatsNumber
                                start={0}
                                end={numberOfClasses}
                                duration={5}
                                separator=","
                            />
                        </CardContent>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <StatsCard elevation={3}>
                        <CardImage src={Teachers} alt="Teachers" />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Tổng Số Giảng Viên
                            </Typography>
                            <StatsNumber
                                start={0}
                                end={numberOfTeachers}
                                duration={2.5}
                                separator=","
                            />
                        </CardContent>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <StatsCard elevation={3}>
                        <CardImage src={Fees} alt="Fees" />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Doanh Thu
                            </Typography>
                            <StatsNumber
                                start={0}
                                end={23000}
                                duration={2.5}
                                prefix="₫"
                                separator=","
                                suffix=" VND"
                            />
                        </CardContent>
                    </StatsCard>
                </Grid>

                {/* Notice Section */}
                <Grid item xs={12}>
                    <Paper sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: 3
                    }}>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

// Styled Components
const StatsCard = styled(Paper)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px !important;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1) !important;
  }
`;

const CardImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 16px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  justify-content: space-between;
`;

const StatsNumber = styled(CountUp)`
  font-size: 2rem;
  font-weight: 500;
  color: #1976d2;
  margin-top: 8px;
`;

export default AdminHomePage;