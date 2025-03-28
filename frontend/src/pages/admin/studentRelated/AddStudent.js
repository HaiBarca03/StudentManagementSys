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
                <h2 className="register-title">Thêm Sinh Viên</h2>
                <div className="form-columns">
                    <div className="left-column">
                        <label>Họ và tên</label>
                        <input name="name" type="text" value={formData.name} onChange={changeHandler} required />

                        {situation === "Student" && (
                            <>
                                <label>Lớp</label>
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

                        <label>Mã sinh viên</label>
                        <input name="rollNum" type="number" value={formData.rollNum} onChange={changeHandler} required />

                        <label>Mật khẩu</label>
                        <input name="password" type="password" value={formData.password} onChange={changeHandler} required />

                        <label>Chuyên ngành</label>
                        <select name="major" value={formData.major} onChange={changeHandler}>
                            {["Công nghệ thông tin", "Quản trị kinh doanh", "Kế toán", "Du lịch", "Ngôn ngữ Anh", "Kỹ thuật ô tô", "Kỹ thuật điện", "Cơ điện tử", "Thiết kế đồ hoạ"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="right-column">
                        <label>Ngày nhập học</label>
                        <input name="schoolEntryDay" type="date" value={formData.schoolEntryDay} onChange={changeHandler} required />

                        <label>Trạng thái</label>
                        <select name="statusField" value={formData.statusField} onChange={changeHandler}>
                            {["Đang học", "Đã học xong", "Đã nghỉ học", "Đã chuyển trường"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <label>Dân tộc</label>
                        <select name="nation" value={formData.nation} onChange={changeHandler}>
                            {["Kinh", "Mường", "Tày", "Nùng"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <label>Tôn giáo</label>
                        <select name="religion" value={formData.religion} onChange={changeHandler}>
                            {["Phật", "Cao đài", "Hồi giáo", "Kito", "Tin lành"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <label>Quốc gia</label>
                        <select name="nationality" value={formData.nationality} onChange={changeHandler}>
                            {["Việt Nam", "Lào", "Campuchia", "Thái Lan", "Indonesia"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button className="register-button" type="submit" disabled={loader}>
                    {loader ? <CircularProgress size={24} color="inherit" /> : 'Thêm'}
                </button>
            </form>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default AddStudent;
