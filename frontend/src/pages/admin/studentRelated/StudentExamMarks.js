import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';
import { BlueButton } from '../../../components/buttonStyles';
import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl,
    Card, CardContent, Paper, Container
} from '@mui/material';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams();

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [marksObtained, setMarksObtained] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (situation === "Student") {
            setStudentID(params.id);
            const stdID = params.id;
            dispatch(getUserDetails(stdID, "Student"));
        }
        else if (situation === "Subject") {
            const { studentID, subjectID } = params;
            setStudentID(studentID);
            dispatch(getUserDetails(studentID, "Student"));
            setChosenSubName(subjectID);
        }
    }, [situation]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(
            (subject) => subject.subName === event.target.value
        );
        setSubjectName(selectedSubject.subName);
        setChosenSubName(selectedSubject._id);
    };

    const fields = { subName: chosenSubName, marksObtained };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"));
    };

    useEffect(() => {
        if (response) {
            setLoader(false);
            setShowPopup(true);
            setMessage(response);
        }
        else if (error) {
            setLoader(false);
            setShowPopup(true);
            setMessage("error");
        }
        else if (statestatus === "added") {
            setLoader(false);
            setShowPopup(true);
            setMessage("Done Successfully");
        }
    }, [response, statestatus, error]);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress size={60} />
                </Box>
            ) : (
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Thông tin sinh viên
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Tên sinh viên: <strong>{userDetails.name}</strong>
                            </Typography>
                            {currentUser.teachSubject && (
                                <Typography variant="body1" color="text.secondary">
                                    Môn học giảng dạy: <strong>{currentUser.teachSubject?.subName}</strong>
                                </Typography>
                            )}
                        </CardContent>
                    </Card>

                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Nhập điểm cho sinh viên
                    </Typography>

                    <Box component="form" onSubmit={submitHandler} sx={{ mt: 3 }}>
                        <Stack spacing={3}>
                            {situation === "Student" && (
                                <FormControl fullWidth>
                                    <InputLabel id="subject-select-label">Chọn môn học</InputLabel>
                                    <Select
                                        labelId="subject-select-label"
                                        id="subject-select"
                                        value={subjectName}
                                        label="Chọn môn học"
                                        onChange={changeHandler}
                                        required
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {subjectsList ? (
                                            subjectsList.map((subject, index) => (
                                                <MenuItem key={index} value={subject.subName}>
                                                    {subject.subName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="Select Subject">
                                                Thêm môn học để nhập điểm
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            )}

                            <FormControl fullWidth>
                                <TextField
                                    type="number"
                                    label="Nhập điểm"
                                    value={marksObtained}
                                    required
                                    onChange={(e) => setMarksObtained(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: 0,
                                        max: 10,
                                        step: 0.1
                                    }}
                                    sx={{ borderRadius: 2 }}
                                />
                            </FormControl>
                        </Stack>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <BlueButton
                                size="large"
                                variant="contained"
                                type="submit"
                                disabled={loader}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                {loader ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Lưu điểm"
                                )}
                            </BlueButton>
                        </Box>
                    </Box>
                </Paper>
            )}

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default StudentExamMarks;