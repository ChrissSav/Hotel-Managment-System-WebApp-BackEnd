const express = require('express');
const mysql = require('mysql');
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
    employees = await GetAllEmployees();
    if (employees==false){
        res.send("error");
    }else{
        res.send(employees);
    }
    
});


function GetAllEmployees(){
    return new Promise((resolve,reject)=>{
        sql = "SELECT * FROM employees;"
        db.query(sql,(err, result) => {
            if (err){
                console.log("GetALLEmployees");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (result);
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
    employees = await GetAllCostumers();
    if (employees==false){
        res.send("error");
    }else{
        res.send(employees);
    }
    
});


function GetAllCostumers(){
    return new Promise((resolve,reject)=>{
        sql = "SELECT * FROM costumers;"
        db.query(sql,(err, result) => {
            if (err){
                console.log("GetAllCostumers");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (result);
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






//Prices
app.put("/prices", (req,res) => {
    res.send("Επεξεργασια τιμών");
});