import React, {useState, useEffect} from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../App.css';
import {toast} from 'react-toastify';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faBell} from'@fortawesome/free-solid-svg-icons';


export function AdminLogin() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const adminLoginSubmit = (e) => {
        e.preventDefault();
        if(email === '' || password === '') {
            toast.error('All Fields are Required !');
        }
        else {
            axios.post('http://localhost:5000/adminlogin', {
                email: email,
                password: password,
            }).then((response) => {
                if(response.data.messagesuccess) {
                    localStorage.setItem('adminauth','Bearer '+response.data.result);
                    toast.success(response.data.messagesuccess);
                    setTimeout(() => {
                    navigate('/admin');
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
                <form className='form' autoComplete='off' onSubmit={adminLoginSubmit}>
                    <img src={require('../images/admin.png')} alt="Admin"/>
                    <h1>ADMIN</h1><br></br>
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

export function AdminLayout() {

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
                <li><Link to='/admin'>Home</Link></li>
                <li onClick={logout}><button>Logout</button></li>
            </ul>
        </nav>
        <Outlet/>
        </>
    )
};

export function AdminHome() {

    const [labcomplaint, setLabComplaint] = useState([]);
    const [librarycomplaint, setLibraryComplaint] = useState([]);
    const [sportscomplaint, setSportsComplaint] = useState([]);
    const [canteencomplaint, setCanteenComplaint] = useState([]);
    const [hostelcomplaint, setHostelComplaint] = useState([]);
    const Complaint = async () => {
        const labresponse = await axios.get('http://localhost:5000/adminlab');
        setLabComplaint(labresponse.data);
        const libraryresponse = await axios.get('http://localhost:5000/adminlibrary');
        setLibraryComplaint(libraryresponse.data);
        const sportsresponse = await axios.get('http://localhost:5000/adminsports');
        setSportsComplaint(sportsresponse.data);
        const canteenresponse = await axios.get('http://localhost:5000/admincanteen');
        setCanteenComplaint(canteenresponse.data);
        const hostelresponse = await axios.get('http://localhost:5000/adminhostel');
        setHostelComplaint(hostelresponse.data);
    };

    useEffect(() => {
        Complaint();
    }, []);

    return(
        <div className='home-container'>
            <h1 className='panel'>ADMINISTRATIVE PANEL</h1>
            <div className='dept-topic'>
                <h3>Laboratory Management</h3>
                <FontAwesomeIcon icon={faBell} style={{marginTop:'30px', cursor:'pointer', color:'brown'}}/>
            </div>
            <div className='card-topic'>
                <h3 style={{width:'5%'}}>ID</h3>
                <h3 style={{width:'10%'}}>Dept</h3>
                <h3 style={{width:'70%'}}>Complaint Details</h3>
                <h3 style={{width:'15%'}}>Status</h3>
            </div>
            <div>
                {labcomplaint.map((item, index) => {
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
            <div className='dept-topic'>
                <h3>Library Department</h3>
                <FontAwesomeIcon icon={faBell} style={{marginTop:'30px', cursor:'pointer', color:'brown'}}/>
            </div>
            <div className='card-topic'>
                <h3 style={{width:'5%'}}>ID</h3>
                <h3 style={{width:'10%'}}>Dept</h3>
                <h3 style={{width:'70%'}}>Complaint Details</h3>
                <h3 style={{width:'15%'}}>Status</h3>
            </div>
            <div>
                {librarycomplaint.map((item, index) => {
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
            <div className='dept-topic'>
                <h3>Sports Department</h3>
                <FontAwesomeIcon icon={faBell} style={{marginTop:'30px', cursor:'pointer', color:'brown'}}/>
            </div>
            <div className='card-topic'>
                <h3 style={{width:'5%'}}>ID</h3>
                <h3 style={{width:'10%'}}>Dept</h3>
                <h3 style={{width:'70%'}}>Complaint Details</h3>
                <h3 style={{width:'15%'}}>Status</h3>
            </div>
            <div>
                {sportscomplaint.map((item, index) => {
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
            <div className='dept-topic'>
                <h3>Canteen Department</h3>
                <FontAwesomeIcon icon={faBell} style={{marginTop:'30px', cursor:'pointer', color:'brown'}}/>
            </div>
            <div className='card-topic'>
                <h3 style={{width:'5%'}}>ID</h3>
                <h3 style={{width:'10%'}}>Dept</h3>
                <h3 style={{width:'70%'}}>Complaint Details</h3>
                <h3 style={{width:'15%'}}>Status</h3>
            </div>
            <div>
                {canteencomplaint.map((item, index) => {
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
            <div className='dept-topic'>
                <h3>Hostel Department</h3>
                <FontAwesomeIcon icon={faBell} style={{marginTop:'30px', cursor:'pointer', color:'brown'}}/>
            </div>
            <div className='card-topic'>
                <h3 style={{width:'5%'}}>ID</h3>
                <h3 style={{width:'10%'}}>Dept</h3>
                <h3 style={{width:'70%'}}>Complaint Details</h3>
                <h3 style={{width:'15%'}}>Status</h3>
            </div>
            <div>
                {hostelcomplaint.map((item, index) => {
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