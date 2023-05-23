import React, {useState} from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../App.css';
import {toast} from 'react-toastify';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from'@fortawesome/free-solid-svg-icons';
import emailjs from '@emailjs/browser';

export function ManagementLogin() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const managementLoginSubmit = (e) => {
        e.preventDefault();
        if(email === '' || password === '') {
            toast.error('All Fields are Required !');
        }
        else {
            axios.post('http://localhost:5000/managementlogin', {
                email: email,
                password: password,
            }).then((response) => {
                if(response.data.messagesuccess) {
                    localStorage.setItem('managementauth','Bearer '+response.data.result);
                    toast.success(response.data.messagesuccess);
                    setTimeout(() => {
                    navigate('/management');
                    }, 1500);
                }
                else {
                    toast.error(response.data.messagefailed);
                }
            });
        }
    }

    return (
        <div className='login-background'>
            <div className="login-content">
                <form className='form' autoComplete='off' onSubmit={managementLoginSubmit}>
                    <img src={require('../images/management.png')} alt="Management"/>
                    <h1>MANAGEMENT</h1><br></br>
                    <div id='group'>
                        <label htmlFor='email'>Email</label>
                        <input type='text' id='email' name='email' value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div id='group'>
                        <label>Password</label>
                        <input type='password' id='password' name='password' value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <br></br>
                    <input type='submit' value='LOGIN'/>
                </form>
            </div>
        </div>
    )
}

export function ManagementLayout() {

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
                <li><Link to='/management'>Home</Link></li>
                <li onClick={logout}><button>Logout</button></li>
            </ul>
        </nav>
        <Outlet/>
        </>
    )
}

export function ManagementHome() {

    let user = localStorage.getItem('managementauth').split(' ')[1];
    const decoded = jwt_decode(user);
    var dept = decoded.mdepartment;
    const [complaint, setComplaint] = useState([]);

    const loadComplaint = () => {
        axios.post('http://localhost:5000/managementhome', {
            dept: dept,
        }).then((response) => {
            setComplaint(response.data);
        });
        axios.post('http://localhost:5000/notifydepartment', {
            dept:dept,
        }).then((response) => {
            // var values = {
            //     count: response.data.length,
            // }
            // emailjs.send('service_dub006k', 'template_ocetcaj', values, 'yxq51-SKEGtIg_qre')
            //         .then(datas => {
            //             console.log('Success');
            //         }, error => {
            //             console.log('Failed...', error);
            // });
            console.log(response.data.length);
        });
    }
    loadComplaint();

    const [status, setStatus] = useState('');

    return(
        <div className='home-container'>
            <h1 className='panel' style={{marginBottom:'50px'}}>{dept} DEPARTMENT</h1>
            <div className='card-topic'>
                <h3 style={{width:'5%'}}>ID</h3>
                <h3 style={{width:'10%'}}>Dept</h3>
                <h3 style={{width:'70%'}}>Complaint Details</h3>
                <h3 style={{width:'15%'}}>Status</h3>
            </div>

            <div>
                {complaint.map((item, index) => {
                    var complaint = item.complaintid;
                    const statusSubmit = (e) => {
                        e.preventDefault();

                        if(status === '') {
                            toast.error('Select status of query to Update !');
                        }
                        else {
                            axios.post('http://localhost:5000/updatecomplaint', {
                                status: status,
                                complaint: complaint
                            }).then((response) => {
                                if(response.data.statussuccess) {
                                    toast.success(response.data.statussuccess);
                                }
                                else {
                                    toast.error(response.data.statusfailed);
                                }
                            });
                        }
                    }

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
                                <div className='flip-card-back' style={{display:'flex'}}>
                                    <div style={{width:'80%'}}>
                                        <h4><b>Description</b></h4><hr/> 
                                        <p>{item.description}</p>
                                    </div>
                                    <div style={{width:'20%'}}>
                                        <form method='post' encType='multipart/form-data' className='statusForm' onSubmit={statusSubmit}>
                                            <select className='status' name='status' value={status} onChange={(e) => setStatus(e.target.value)}>
                                                <option value='' hidden>--UPDATE STATUS--</option>
                                                <option value='Processing'>Processing</option>
                                                <option value='Resolved'>Resolved</option>
                                            </select>
                                            <input type='submit' value='Update'/>
                                        </form>
                                    </div>
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