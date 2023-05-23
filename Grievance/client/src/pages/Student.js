import React, {useState, useEffect} from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from'@fortawesome/free-solid-svg-icons';
import emailjs from '@emailjs/browser';

export function StudentLogin() {

    const navigate = useNavigate();
    const [regno, setRegNo] = useState('');
    const [dob, setDob] = useState('');

    const studentLoginSubmit = (e) => {
        e.preventDefault();
        if(regno === '' || dob === '') {
            toast.error('All Fields are Required !');
        }
        else {
            axios.post('http://localhost:5000/studentlogin', {
                regno: regno,
                dob: dob,
            }).then((response) => {
                if(response.data.messagesuccess) {
                    localStorage.setItem('authorization','Bearer '+response.data.result);
                    toast.success(response.data.messagesuccess);
                    setTimeout(() => {
                    navigate('/student');
                    }, 1500);
                }
                else {
                    toast.error(response.data.messagefailed);
                }
            });
        }
    };

    return (
        <div className='login-background'>
            <div className="login-content">
                <form className='form' autoComplete='off' onSubmit={studentLoginSubmit}>
                    <img src={require('../images/student.png')} alt="Student"/>
                    <h1>STUDENT</h1><br></br>
                    <div id='group'>
                        <label htmlFor='regno'>Register No</label>
                        <input type='text' id='regno' name='regno' placeholder='Register No' onChange={(e) => setRegNo(e.target.value)} />
                    </div>
                    <div id='group'>
                        <label htmlFor='dob'>DOB</label>
                        <input type='text' id='dob' name='dob' placeholder='DD-MM-YYYY' onChange={(e) => setDob(e.target.value)} />
                    </div>
                    <br></br>
                    <input type='submit' value='LOGIN'/>
                </form>
            </div>
        </div>
    )
}

export function StudentLayout() {

    const navigate = useNavigate();
            
    const logout = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <>
        <nav className='layout'>
            <input type='checkbox' id='check'/>
            <label htmlFor='check' className='checkbtn'>
            <FontAwesomeIcon icon={faBars} />
            </label>
            <label className='logo'>Grievance</label>
            <ul>
                <li><Link to='/student'>Home</Link></li>
                <li><Link to='/student/dashboard'>Dashboard</Link></li>
                <li><Link to='/student/complaint' className='complaint'>Complaint</Link></li>
                <li onClick={logout}><button>Logout</button></li>
            </ul>
        </nav>
        <Outlet/>
        </>
    )
}


export function StudentHome() {

    const [complaint, setComplaint] = useState([]);
    const loadComplaint = async () => {
        const response = await axios.get('http://localhost:5000/studenthome');
        setComplaint(response.data);
    };

    useEffect(() => {
        loadComplaint();
    }, []);

    let user = localStorage.getItem('authorization').split(' ')[1];
    const decoded = jwt_decode(user);

    return(
        <div className='home-container'>
            <h1 className='student-name'>Welcome {decoded.sname}</h1><br/><br/>
            <div className='card-topic'>
                <h3 style={{width:'5%'}}>SNO</h3>
                <h3 style={{width:'10%'}}>Dept</h3>
                <h3 style={{width:'70%'}}>Complaint Details</h3>
                <h3 style={{width:'15%'}}>Status</h3>
            </div>

            <div>
                {complaint.map((item, index) => {
                    return(
                        <>
                        <div className='flip-card'>
                            <div className='flip-card-inner' key={item.id}>
                                <div className='flip-card-front'>
                                    <p style={{width:'5%'}}>{index+1}</p>
                                    <p style={{width:'10%'}}>{item.dept}</p>
                                    <p style={{width:'70%'}}>{item.title}</p>
                                    <p style={{width:'15%'}}>{item.status}</p>
                                </div>
                                <div className='flip-card-back'>
                                    <h4><b>Description</b></h4><hr/> 
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        </div>
                        </>
                    )
                })}
            </div>
        </div>
    )
};

export function StudentDashboard() {

    let user = localStorage.getItem('authorization').split(' ')[1];
    const decoded = jwt_decode(user);
    var email = decoded.semail;

    const [id, setId] = useState('');
    const [complaint, setComplaint] = useState([]);

    const loadComplaint = () => {
        axios.post('http://localhost:5000/studentdashboard', {
            email: email,
        }).then((response) => {
            setComplaint(response.data);
        });
    }
    loadComplaint();

    const idSubmit = (e) => {
        e.preventDefault();
        if(id === '') {
            toast.error('Complaint ID is required');
        }
        else {
            axios.post('http://localhost:5000/statusid', {
                id: id
            }).then((response) => {
                if(response.data) {
                    toast.success(response.data.querysuccess);
                    toast.warning(response.data.queryprocess);
                }
                if(response.data.queryfailed) {
                    toast.error(response.data.queryfailed);
                }
            });
        }
    };

    return(
        <div className='home-container'>
            <form className='search-query' autoComplete='off' onSubmit={idSubmit}>
                <input type='search' placeholder='Complaint ID' title='Input Complaint ID' name='id' className='searchquery' onChange={(e) => setId(e.target.value)}/><br/>
                <input type='submit' value='GET STATUS'/>
            </form>
            <div className='card-topic'>
                <h3 style={{width:'5%'}}>SNO</h3>
                <h3 style={{width:'15%'}}>Complaint ID</h3>
                <h3 style={{width:'10%'}}>Dept</h3>
                <h3 style={{width:'55%'}}>Complaint Details</h3>
                <h3 style={{width:'15%'}}>Status</h3>
            </div>

            <div>
                {complaint.map((item, index) => {
                    return(
                        <>
                        <div className='flip-card'>
                            <div className='flip-card-inner' key={item.id}>
                                <div className='flip-card-front'>
                                    <p style={{width:'5%'}}>{index+1}</p>
                                    <p style={{width:'15%'}}>{item.complaintid}</p>
                                    <p style={{width:'10%'}}>{item.dept}</p>
                                    <p style={{width:'55%'}}>{item.title}</p>
                                    <p style={{width:'15%'}}>{item.status}</p>
                                </div>
                                <div className='flip-card-back'>
                                    <h4><b>Description</b></h4><hr/> 
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        </div>
                        </>
                    )
                })}
            </div>
        </div>
    )
};

export function StudentComplaint () {
    var user = localStorage.getItem('authorization').split(' ')[1];
    const decoded = jwt_decode(user);
    var stuName = decoded.sname;
    var stuEmail = decoded.semail;
    let maskedName = "User don't want to show his/her Identity";
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [department, setDepartment] = useState('');
    var [studentName, setStudentName] = useState('');
    var studentEmail = stuEmail;
    const navigateComplaint = useNavigate();
    const [checked, setChecked] = useState(false);

    studentName = checked ? maskedName : stuName;

    const handleMask = () => {
        setChecked(!checked);
    };

    const studentComplaintSubmit = (e) => {
        e.preventDefault();
        
        if(title === '' || description === '' || department === '' || studentName === '') {
            toast.error('All Fields are Required !');
        }
        else {
            axios.post('http://localhost:5000/studentcomplaint', {
                title: title,
                description: description,
                department: department,
                studentName: studentName,
                studentEmail: studentEmail
            }).then((response) => {
                if(response.data.messagesubmit) {
                    toast.success(response.data.messagesubmit);
                    
                    var values = {
                        studentName: studentName,
                        studentEmail: studentEmail,
                        complaintid: response.data.result,
                    }
                    // emailjs.send('service_dub006k', 'template_hfftk8a', values, 'yxq51-SKEGtIg_qre')
                    // .then(datas => {
                    //     console.log('Success');
                    // }, error => {
                    //     console.log('Failed...', error);
                    // });

                    emailjs.send('service_c35hwna', 'template_fpg43bc', values, 'user_WVArauJxHUJHjRVCch5vT')
                    .then(datas => {
                        console.log('Success');
                    }, error => {
                        console.log('Failed...', error);
                    });
                    
                    setTimeout(() => {
                        navigateComplaint('/student/dashboard');
                    }, 1000);
                }
                else {
                    toast.error(response.data.messagefailed);
                }
            });
        }
    }

    return(
        <div className="complaint-container">
            <h3>Complaint Form</h3>
            <form method='post' autoComplete='off' encType='multipart/form-data' onSubmit={studentComplaintSubmit}>
                <label htmlFor='department'>Department *</label>
                <select id="department" name="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value='' hidden>--SELECT DEPT--</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Library">Library</option>
                    <option value="Sports">Sports</option>
                    <option value='Canteen'>Canteen</option>
                    <option value='Hostel'>Hostel</option>
                </select>
                <label htmlFor='title'>Title *</label>
                <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"/>
                <label htmlFor='description'>Description *</label>
                <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write description..."></textarea>
                <label htmlFor='name'>From User *</label>
                <input type="text" id="name" name="name" value={studentName}  onChange={(e) => setStudentName(e.target.value)} placeholder="Name" disabled/>
                <input type="checkbox" id="mask" name="mask" onChange={handleMask}/>
                <label htmlFor='mask'> Mask my Identity (Optional)</label><br/><br/>
                <input type="submit" value="Post"/>
            </form>
        </div>
    );
};