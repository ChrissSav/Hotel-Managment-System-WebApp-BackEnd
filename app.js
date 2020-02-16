const express = require('express');
const mysql = require('mysql');
//CreateConection

const db =
 mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'user1234',
    database: 'fellowtraveller',
    insecureAuth : true
});

//Connection
db.connect((error) => {
    if(error){
        console.log("db.connect((error)"); 
        console.log(error);    
        db.connect();    
    }
    else{
        console.log('Mysql connected');
    }
})


const app = express();

app.listen('5023', () => {
    console.log("on port 5023")
});

app.get('', (req,res) => {
    res.send("Καλώς ήρθατε στο Api του Hotel Managment System");
});






///Empolyees
app.post("/employee", (req,res) => {
    res.send("Καταχωρηση χρηστη");
});

app.put("/employee", (req,res) => {
    res.send("Καταχωρηση χρηστη");
});

app.delete("/employee", (req,res) => {
    res.send("Διαγραφη χρηστη");
});


///Reservation
app.post("/reservation", (req,res) => {
    res.send("Καταχωρηση κρατησης");
});

app.put("/reservation", (req,res) => {
    res.send("Καταχωρηση κρατησης");
});

app.delete("/reservation", (req,res) => {
    res.send("Διαγραφη κρατησης");
});

//Prices
app.put("/prices", (req,res) => {
    res.send("Επεξεργασια τιμών");
});