const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
let error_handling = require('./Status/error_handling');
let success_handling = require('./Status/success_handling');
//CreateConection

const db =
 mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'user1234',
    database: 'hotel_database',
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



//GlobalFunctons----------------------------------
function GetAllFromTable(table_name){
    return new Promise((resolve,reject)=>{
        sql = "SELECT * FROM "+table_name
        db.query(sql,(err, result) => {
            if (err){
                console.log("GetAllFromTable");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (result);
            }
        })
    });
}






//GlobalFunctons----End---------------------------

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




app.get("/employees",async (req,res) => {
    employees = await GetAllFromTable("employees");
    if (employees==false){
        res.send(error_handling(""));
    }else{
        res.send(employees);
    }
    
});

function RegisterEmpolyee(first_name,last_name,brithday,sex,address,city,phone,amka,adt,afm,username,password){
    return new Promise((resolve,reject)=>{
        sql = "INSERT INTO employees (first_name,last_name,brithday,sex,address,city,phone,amka,adt,afm,username,password) " +
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?);"
        db.query(sql,[first_name,last_name,brithday,sex,address,city,phone,amka,adt,afm,username,password],(err, result) => {
            if (err){
                console.log("RegisterEmpolyee");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}


///Costumers
app.post("/costumer", (req,res) => {
    res.send("Καταχωρηση πελάτη");
});

app.put("/costumer", (req,res) => {
    res.send("Καταχωρηση πελάτη");
});

app.delete("/costumer", (req,res) => {
    res.send("Διαγραφη πελάτη");
});


app.get("/costumers",async (req,res) => {
    employees = await GetAllFromTable("costumers");
    if (employees==false){
        res.send("error");
    }else{
        res.send(employees);
    }
    
});



function RegisterCostumer(last_name,first_name,birthday,sex,phone,adt){
    return new Promise((resolve,reject)=>{
        sql = "INSERT INTO costumers (last_name,first_name,birthday,sex,phone,adt) " +
        "VALUES (?,?,?,?,?,?);"
        db.query(sql,[last_name,first_name,birthday,sex,phone,adt],(err, result) => {
            if (err){
                console.log("RegisterCostumer");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}


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




function RegisterReservaton(date,rec_id,costumer_id,room_id,arrival,departure,num_fo_abults,
    num_of_minors,parking_space,diet,cost){
    return new Promise((resolve,reject)=>{
        sql = "INSERT INTO costumers (date,rec_id,costumer_id,room_id,arrival,departure,num_fo_abults,"+
            "num_of_minors,parking_space,diet,cost) " +
        "VALUES (?,?,?,?,?,?,?,?,?,?,?);"
        db.query(sql,[date,rec_id,costumer_id,room_id,arrival,departure,num_fo_abults,
            num_of_minors,parking_space,diet,cost],(err, result) => {
            if (err){
                console.log("RegisterCostumer");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}


//Prices
app.put("/prices", (req,res) => {
    res.send("Επεξεργασια τιμών");
});