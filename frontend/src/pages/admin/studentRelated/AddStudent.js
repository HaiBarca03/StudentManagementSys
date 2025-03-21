import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress } from '@mui/material';
import "../../../css/addStudent.css";

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [formData, setFormData] = useState({
        name: '',
        rollNum: '',
        password: '',
        className: '',
        sclassName: '',
        major: 'Công nghệ thông tin',
        schoolEntryDay: '',
        statusField: 'Đang học',
        nation: 'Kinh',
        religion: 'Phật',
        nationality: 'Việt Nam',
        typeOfTraining: 'Chính quy',
        trainingLevel: 'Đại học'
    });

    const adminID = currentUser._id;
    const role = "Student";
    const attendance = [];

    useEffect(() => {
        if (situation === "Class") {
            setFormData(prev => ({ ...prev, sclassName: params.id }));
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (formData.sclassName === "") {
            setMessage("Please select a classname");
            setShowPopup(true);
        } else {
            setLoader(true);
            dispatch(registerUser({ ...formData, adminID, role, attendance }, role));
        }
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
        } else if (status === 'failed' || status === 'error') {
            setMessage(status === 'failed' ? response : "Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={submitHandler}>
                <h2 className="register-title">Add Student</h2>
                <div className="form-columns">
                    <div className="left-column">
                        <label>Name</label>
                        <input name="name" type="text" value={formData.name} onChange={changeHandler} required />

                        {situation === "Student" && (
                            <>
                                <label>Class</label>
                                <select name="className" value={formData.className} onChange={changeHandler} required>
                                    <option value="">Select Class</option>
                                    {sclassesList.map((classItem) => (
                                        <option key={classItem._id} value={classItem.sclassName}>
                                            {classItem.sclassName}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        <label>Roll Number</label>
                        <input name="rollNum" type="number" value={formData.rollNum} onChange={changeHandler} required />

                        <label>Password</label>
                        <input name="password" type="password" value={formData.password} onChange={changeHandler} required />

                        <label>Major</label>
                        <select name="major" value={formData.major} onChange={changeHandler}>
                            {["Công nghệ thông tin", "Quản trị kinh doanh", "Kế toán", "Du lịch", "Ngôn ngữ Anh", "Kỹ thuật ô tô", "Kỹ thuật điện", "Cơ điện tử", "Thiết kế đồ hoạ"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="right-column">
                        <label>School Entry Day</label>
                        <input name="schoolEntryDay" type="date" value={formData.schoolEntryDay} onChange={changeHandler} required />

                        <label>Status</label>
                        <select name="statusField" value={formData.statusField} onChange={changeHandler}>
                            {["Đang học", "Đã học xong", "Đã nghỉ học", "Đã chuyển trường"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <label>Nation</label>
                        <select name="nation" value={formData.nation} onChange={changeHandler}>
                            {["Kinh", "Mường", "Tày", "Nùng"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <label>Religion</label>
                        <select name="religion" value={formData.religion} onChange={changeHandler}>
                            {["Phật", "Cao đài", "Hồi giáo", "Kito", "Tin lành"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <label>Nationality</label>
                        <select name="nationality" value={formData.nationality} onChange={changeHandler}>
                            {["Việt Nam", "Lào", "Campuchia", "Thái Lan", "Indonesia"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button className="register-button" type="submit" disabled={loader}>
                    {loader ? <CircularProgress size={24} color="inherit" /> : 'Add'}
                </button>
            </form>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default AddStudent;
