import React from 'react';
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Home from './pages/Home';
import {AdminLogin, AdminLayout, AdminHome} from './pages/Admin';
import {ManagementLogin, ManagementLayout, ManagementHome} from './pages/Management';
import {StudentLogin, StudentLayout, StudentHome, StudentDashboard, StudentComplaint} from './pages/Student';

function App() {
  return (
    <div className='App'>
      <ToastContainer position='top-center' autoClose={1000}/>
      <Routes>
        <Route exact path='/' element={ <Home/> } />
        <Route path='/student/login' element={ <StudentLogin/> } />
        <Route path='/student' element={<StudentLayout/>} >
        <Route exact index element={<StudentHome/>}/>
        <Route path='/student/dashboard' element={<StudentDashboard/>}/>
        <Route path='/student/complaint' element={<StudentComplaint/>}/>
        </Route>
        <Route path='/management/login' element={ <ManagementLogin/> } />
        <Route path='/management' element={<ManagementLayout/>} >
        <Route exact index element={<ManagementHome/>}/>
        </Route>
        <Route path='/admin/login' element={ <AdminLogin/> } />
        <Route path='/admin' element={<AdminLayout/>} >
        <Route exact index element={<AdminHome/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;