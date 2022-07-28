const express = require('express');
var mysql = require('mysql');
const app = express();
var bodyParser = require('body-parser');
const path = require('path');
const { Router } = require('express');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'education-app'
});

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
connection.connect((err) => {
    if (err) {
        // Return error if present
        console.log("Error occurred", err);
    } else {
        // Create database
        console.log("Connected to MySQL Server");

    }
});

// Create application/x-www-form-urlencoded parser  
var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.post('/add_teacher', urlencodedParser, function (req, res) {
    // Prepare output in JSON format  
    try
    {
        var teacherName = req.body.infos.teacherName;
        var teacherSurname = req.body.infos.teacherSurname;
        var teacherPhone = req.body.infos.teacherPhone;
        var teacherBranch = req.body.infos.teacherBranch;
        var teacherDays = req.body.days;
        var teacherHours = req.body.dayHours;
        console.log(teacherHours);
        var sql = "INSERT INTO teacher (phone, name, surname, branch, days) VALUES ('"+teacherPhone+"','"+ teacherName +"', '"+ teacherSurname+"', '"+ teacherBranch +"', '"+ JSON.stringify(teacherDays) +"');";
        var sql2 = " INSERT INTO teacherdates (teacherPhone) VALUES ('"+teacherPhone+"');";
        
        /*Object.entries(teacherHours).forEach(value => {
            var update_sql = "UPDATE teacherdates SET ("+value+"+'"+teacherhours+"') ";
            console.log("\n" +value);
        });*/
        var update_queries =[];
        for (let [key, value] of Object.entries(teacherHours)) {
             update_queries.push("UPDATE teacherdates SET "+key+"='"+value+"' WHERE teacherPhone = '" + teacherPhone +"'");
            /*connection.query(update_sql, function (err, results) {
                console.log(update_sql);  
            })*/
        }
        update_queries.forEach(value => {
            connection.query(value, function (err, results) {
                console.log(value);  
            })
        });
        connection.query(sql2, function(err, results){
            console.log(sql2);
            connection.query(sql, function (err, results) {
                console.log(sql);
                if (err) 
                {
                    res.status(500).send(err.message);
                }
                else 
                {
                    res.send(results);
                }    
            })
        })
    }catch(e)
    {
        res.status(500).send("Error sql");
    }
})
app.post('/getTeachers', (req, res) => {
    console.log("Kayıt");
    let sql = "SELECT * FROM teacher";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    })

});

app.get('/404', (req, res) => {
    res.render('404');

});

app.get('/success', (req, res) => {
    res.render('success');

});

app.get('/create-student', (req, res) => {
    res.render('create-student');

});

app.get('/create-teacher', (req, res) => {
    res.render('create-teacher');

});

app.get('/index', (req, res) => {
    res.render('index');

});

app.get('/sidebar', (req, res) => {
    res.render('sidebar');

});

app.get('/student-list', (req, res) => {
    res.render('student-list');

});

app.get('/teacher-list', (req, res) => {
    res.render('teacher-list');

});

app.get('/', (req, res) => {
    res.render('index');

});

app.listen(5600, '127.0.0.1');

