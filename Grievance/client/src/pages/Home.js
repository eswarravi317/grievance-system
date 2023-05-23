import React from 'react';
import { Link } from "react-router-dom";
import '../App.css';

function Home() {
    return (
    <div className="home-background">
        <div className="home-content">
            <h1>Welcome to Grievance System</h1>
            <ul>
                <li><Link to="/admin/login"><img src={require('../images/admin.png')} alt="Admin"/><h2>Admin</h2></Link></li>
                <li><Link to="/management/login"><img src={require('../images/management.png')} alt="Management"/><h2>Management</h2></Link></li>
                <li><Link to="/student/login"><img src={require('../images/student.png')} alt="Student"/><h2>Student</h2></Link></li>
            </ul>
        </div>
    </div>
    );
}

export default Home;