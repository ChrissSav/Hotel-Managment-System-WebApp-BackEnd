const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
let error_handling = require('./Status/error_handling');
let success_handling = require('./Status/success_handling');
var cors = require('cors')

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
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));




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
app.post("/employee",async (req,res) => {
    employee  =req.body.data ;
    console.log(employee)
    if(await RegisterEmpolyee(employee)==true){
        res.send(success_handling("mpompa"))
    }else{
        res.send(error_handling("error"));

    }
});


app.put("/employee", (req,res) => {
    res.send("Καταχωρηση χρηστη");
});

app.delete("/employee", (req,res) => {
    res.send("Διαγραφη χρηστη");
});





app.get("/employee/:id",async (req,res) => {
    employee_id = req.params.id;
  //  console.log("employee_id",employee_id)
    if (employee_id =="!" || employee_id ==="!"){
       
        result = await GetAllFromTable("employees");
    }else{
        result = await GetEmployeeById(employee_id);
    }
    res.send(result);
    
});

function GetEmployeeById(employee_id){
    return new Promise((resolve,reject)=>{
        sql = "";
        if (parseFloat(employee_id)==employee_id){
            sql = " select * from employees where afm  like '%"+employee_id+"%'"
        }else{
            sql = " select * from employees where last_name  like '%"+employee_id+"%'"
        }
        db.query(sql,(err, result) => {
            if (err){
                console.log("GetEmployeeById");
                console.log(err);
                resolve ([]);
            }
            else{
                resolve (result);
            }
        })
    });
}




function RegisterEmpolyee(employee){
    return new Promise((resolve,reject)=>{
        first_name = employee.first_name;
        last_name= employee.last_name;
        brithday= employee.brithday;
        sex= employee.sex;
        address= employee.address;
        city= employee.city;
        phone= employee.phone;
        amka= employee.amka;
        adt= employee.adt;
        afm= employee.afm;
        username= employee.username;
        password= employee.password;
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
    res.send("Επεξεργασια πελάτη");
});

app.delete("/costumer", (req,res) => {
    res.send("Διαγραφη πελάτη");
});


app.get("/costumer/:id",async (req,res) => {
    costumer_id = req.params.id;
    console.log("costumer_id",costumer_id)
    if (costumer_id ==0 || costumer_id =="0"){
       
        result = await GetAllFromTable("costumers");
    }else{
        result = await GetRoomById(room_id);
    }
    res.send(result);
    
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
    res.send("Επεξεργασια κρατησης");
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
    updated_prices = req.body.prices
    if(UpdatePrices(updated_prices)==true){
        res.send(success_handling(""));
    }else{
        res.send(error_handling(""));
    }
    
});

app.get("/prices",async (req,res) => {
    result = await GetAllFromTable("prices")
    if(result==false){
        res.send(error_handling("error"))
    }else{
        res.send(result[0])
    }
});



function UpdatePrices(prices){
    return new Promise((resolve,reject)=>{
        air_condition= parseInt(prices.air_condition)
        pool=prices.pool
        wifi= prices.wifi
        only_breakfast= prices.only_breakfast
        half_board= prices.half_board
        full_diet= prices.full_diet
        parking= prices.parking
        normal= prices.normal
        family= prices.family
        price_of_bed= prices.price_of_bed
        tax= parseInt(prices.tax)
        //console.log(air_condition,pool,wifi ,only_breakfast,half_board, full_diet,
      //      parking,normal,family,price_of_bed,tax)
        sql = "update prices set air_condition=?,pool=?,wifi=? ,only_breakfast=?,half_board=?"+
        " ,full_diet=?,parking=?,normal=?,family=?,price_of_bed=?,tax=? where id =1";
        db.query(sql,[air_condition,pool,wifi ,only_breakfast,half_board, full_diet,
            parking,normal,family,price_of_bed,tax],(err, result) => {
            if (err){
                console.log("UpdatePrices");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}
//Rooms
app.post("/room", async (req,res) => {
    create_room = req.body.room
    console.log("Καταχωρηση δωματιου")
    console.log(create_room)
    if(await CreateRoom(create_room)){
          res.send(success_handling(""));
    }else{
         res.send(error_handling(""));
    }
    res.send(error_handling(""));
});

app.put("/room", (req,res) => {
    
    res.send("Επεξεργασια δωματιου");
});

app.delete("/room", (req,res) => {
    res.send("Διαγραφη δωματιου");
});


app.get("/room/:id", async (req,res) => {
    room_id = req.params.id;
    //console.log("room_id",room_id)
    if (room_id ==0 || room_id =="0"){
       
        result = await GetAllFromTable("rooms");
    }else{
        result = await GetRoomById(room_id);
    }
    res.send(result);
    
   
});



app.get("/rooms", async (req,res) => {
    rooms = await GetAllFromTable("rooms");
    if (rooms==false){
        res.send("error");
    }else{
        res.send(rooms);
    }
});

app.get("/room_max_id", async (req,res) => {
    max = await GetRoomMaxId();
    res.send(success_handling(max+1));

});

function GetRoomById(room_id){
    return new Promise((resolve,reject)=>{
        sql = "select * from rooms where id = ?";
        db.query(sql,[room_id],(err, result) => {
            if (err){
                console.log("GetRoomById");
                console.log(err);
                resolve ([]);
            }
            else{
                resolve (result);
            }
        })
    });
}

function GetRoomMaxId(){
    return new Promise((resolve,reject)=>{
        sql = "select MAX(id) as id from rooms ";
        db.query(sql,(err, result) => {
            if (err){
                console.log("GetRoomMaxId");
                console.log(err);
                resolve (0);
            }
            else{
                resolve (result[0].id);
            }
        })
    });
}


function CreateRoom(body){
    return new Promise((resolve,reject)=>{
        type = body.type;
        num_of_beds= body.num_of_beds;
        air_condition= body.air_condition;
        pool= body.pool;
        wifi= body.wifi;
        price= body.price;    
        sql = "insert into rooms (type,num_of_beds,air_condition,pool,wifi,price) values (?,?,?,?,?,?);"
        db.query(sql,[type,num_of_beds,air_condition,pool,wifi,price],(err, result) => {
            if (err){
                console.log("CreateRoom");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}