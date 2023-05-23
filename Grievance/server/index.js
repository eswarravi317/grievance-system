const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const alphanumeric = require('alphanumeric-id');
const cron = require('node-cron');

dotenv.config();

let date_time = new Date();
let date = ("0" + date_time.getDate()).slice(-2);
let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
let year = date_time.getFullYear();
let hours = date_time.getHours();
let minutes = date_time.getMinutes();
let seconds = date_time.getSeconds();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
    cors({
        origin: ['http://localhost:3000'],
        method: ['GET', 'POST'],
        credentials: true,
    })
);

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'grievance'
});

db.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server');
});

app.post('/studentlogin', (req, res) => {
    const regno = req.body.regno;
    const dob = req.body.dob;
    const sqlStudentLogin = "SELECT * FROM student WHERE regno=? AND dob=?";
    db.query(sqlStudentLogin, [regno, dob], (error, result) => {
        if(error) {
            res.send({error: error});
        }
        if(result.length > 0) {
            const sno = result[0].sno;
            const sname = result[0].name;
            const semail = result[0].email;

            let jwtSecretKey = process.env.JWT_SECRET_KEY;

            const data = {
                sno: sno,
                sname: sname,
                semail: semail,
            }
            const token = jwt.sign(data, jwtSecretKey,{expiresIn: '1m'});
            res.json({messagesuccess: 'Authenticated as '+sname, result: token});
        }
        else {
            res.send({messagefailed: 'Invalid Credentials !'});
        }
    });
});

app.get('/studenthome', (req,res) => {
    const sqlGet = 'SELECT * FROM complaint';
    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});

app.post('/studentdashboard', (req,res) => {
    const email = req.body.email;
    const sqlGet = 'SELECT * FROM complaint WHERE email=?';
    db.query(sqlGet, [email], (error, result) => {
        res.send(result);
    });
});

app.post('/managementhome', (req,res) => {
    const dept = req.body.dept;
    const sqlGet = 'SELECT * FROM complaint WHERE dept=?';
    db.query(sqlGet, [dept], (error, result) => {
        if(result.length > 0) {
            res.send(result);
        }
    });
});

cron.schedule('* * *  January,February,March,April,May,June,July,August,September,October,November,December Thursday', () => {
    app.post('/notifydepartment', (req,res) => {
        const dept = req.body.dept;
        const sqlGet = "SELECT * FROM complaint WHERE dept=? AND status='Processing'";
        db.query(sqlGet, [dept], (error, data) => {
            if(data.length > 0) {
                res.send(data);
            }
        });
    });
});

app.get('/adminlab', (req,res) => {
    const sqlGet = "SELECT * FROM complaint WHERE dept='Laboratory'";
    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});
app.get('/adminlibrary', (req,res) => {
    const sqlGet = "SELECT * FROM complaint WHERE dept='Library'";
    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});
app.get('/adminsports', (req,res) => {
    const sqlGet = "SELECT * FROM complaint WHERE dept='Sports'";
    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});
app.get('/admincanteen', (req,res) => {
    const sqlGet = "SELECT * FROM complaint WHERE dept='Canteen'";
    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});
app.get('/adminhostel', (req,res) => {
    const sqlGet = "SELECT * FROM complaint WHERE dept='Hostel'";
    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});

app.post('/studentcomplaint', (req, res) => {

    const title = req.body.title;
    const description = req.body.description;
    const department = req.body.department;
    const studentName = req.body.studentName;
    const studentEmail = req.body.studentEmail;
    var status = 'Processing';
    var creationtime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    var updationtime = creationtime;

    if(department == 'Laboratory') {
        var complaintid = 'LB-'+alphanumeric(8);
    }
    if(department == 'Library') {
        var complaintid = 'LI-'+alphanumeric(8);
    }
    if(department == 'Sports') {
        var complaintid = 'SP-'+alphanumeric(8);
    }
    if(department == 'Canteen') {
        var complaintid = 'CTN-'+alphanumeric(8);
    }
    if(department == 'Hostel') {
        var complaintid = 'HTL-'+alphanumeric(8);
    }

    const sqlStudentComplaint = 'INSERT INTO complaint (complaintid, title, description, dept, name, email, status, creationtime, updationtime) VALUES (?,?,?,?,?,?,?,?,?)';
    db.query(sqlStudentComplaint,[complaintid, title, description, department, studentName, studentEmail, status, creationtime, updationtime],(error,result) => {
        if(error) {
            res.send({messagefailed: 'There is an error whhile uploading complaint, Please try again...!'});
        }
        else {
            res.send({messagesubmit: 'Complaint successfully submitted, keep in track...', result: complaintid});
        }
    });
});

app.post('/managementlogin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sqlManagementLogin = "SELECT * FROM management WHERE email=? AND password=?";
    db.query(sqlManagementLogin, [email, password], (error, result) => {
        if(error) {
            res.send({error: error});
        }
        if(result.length > 0) {
            const memail = result[0].email;
            const mdepartment = result[0].department;

            let jwtSecretKey = process.env.JWT_SECRET_KEY;

            const data = {
                memail: memail,
                mdepartment: mdepartment,
            }
            const token = jwt.sign(data, jwtSecretKey,{expiresIn: '1m'});
            res.json({messagesuccess: 'Authentication Successful', result: token});
        }
        else {
            res.send({messagefailed: 'Invalid Credentials !'});
        }
    });
});

app.post('/adminlogin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sqlAdminLogin = 'SELECT * FROM admin WHERE email=? AND password=?';
    db.query(sqlAdminLogin, [email, password], (error, result) => {
        if(error) {
            res.send({error: error});
        }
        if(result.length > 0) {
            const aemail = result[0].email;

            let jwtSecretKey = process.env.JWT_SECRET_KEY;

            const data = {
                aemail: aemail,
            }
            const token = jwt.sign(data, jwtSecretKey,{expiresIn: '1m'});
            res.json({messagesuccess: 'Authentication Successful', result: token});
        }
        else {
            res.send({messagefailed: 'Invalid Credentials !'});
        }
    });
});

app.post('/statusid', (req, res) => {
    const complaintid = req.body.id;
    const sqlStatus = 'SELECT status FROM complaint WHERE complaintid=?';
    db.query(sqlStatus, [complaintid], (error, result) => {
        if(error) {
            res.send({error: error});
        }
        if(result.length > 0) {
            if(result[0].status === 'Resolved') {
                res.json({querysuccess: 'Query is Resolved'});
            }
            if(result[0].status === 'Processing') {
                res.json({queryprocess: 'Query is Under Processing'});
            }
        }
        if(result.length <= 0) {
            res.send({queryfailed: 'Invalid Complaint ID'});
        }
    });
});

app.post('/updatecomplaint', (req, res) => {
    const status = req.body.status;
    const complaint = req.body.complaint;
    const sqlStatusUpdate = 'update complaint set status=? where complaintid=?';
    db.query(sqlStatusUpdate, [status, complaint], (error, result) => {
        if(error) {
            res.send({statusfailed: 'There is an error while updating status'});
        }
        else {
            res.send({statussuccess: 'Status updated successfully'});
        }
    });
});

let PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('Server is running on',+PORT);
});