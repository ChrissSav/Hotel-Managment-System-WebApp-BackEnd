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

