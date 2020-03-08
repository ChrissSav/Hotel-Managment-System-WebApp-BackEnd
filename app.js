const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
let error_handling = require('./Status/error_handling');
let success_handling = require('./Status/success_handling');
var cors = require('cors');
const verify = require('./verifyToken');
const jwt = require('jsonwebtoken');
require('dotenv').config()

//CreateConection
var connDB =
 mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'user1234',
    database: 'hotel_database',
    insecureAuth : true
});

//Connection
connDB.connect((error) => {
    if(error){
        console.log("connDB.connect((error)"); 
        console.log(error);    
        connDB.connect();    
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
        connDB.query(sql,(err, result) => {
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

function ChangeFromat(date){
    var d  = date.split("-");
    var new_date = d[2]+"/"+d[1]+"/"+d[0]
    return  (new_date);
}



//GlobalFunctons----End---------------------------
//tokens
function CheckToken(token){
    return new Promise((resolve,reject)=>{
        sql = "SELECT * FROM refress_tokens where token = '"+token+"'";
        connDB.query(sql,(err, result) => {
            if (err || result.legth<1){
                console.log("CheckToken");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}

function AddToken(token){
    return new Promise((resolve,reject)=>{
        sql = "insert into refress_tokens values(?)";
        connDB.query(sql,[token],(err, result) => {
            if (err){
                console.log("AddToken");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}

function DeleteToken(token){
    return new Promise((resolve,reject)=>{
        sql = "delete from refress_tokens where token = ?";
        connDB.query(sql,[token],(err, result) => {
            if (err){
                console.log("DeleteToken");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}


app.post("/token",async (req,res) => {
    const refress_token = req.body.refress_token
    var refress_token1 = refress_token
   // console.log("1")
    if(refress_token == null) return res.sendStatus(401)
    //console.log("2")
    rf = await CheckToken(refress_token)
    if(!rf) return res.sendStatus(403)
    //console.log("3",rf)
    jwt.verify(refress_token,process.env.REFRESH_TOKEN_KEY , async (err,user)=>{
       // console.log(user,err)
        if(err) return res.sendStatus(403) 
        await DeleteToken(refress_token1);
        const access_token = generateAccessToken({user: user})
        const refress_token = jwt.sign({user: user},process.env.REFRESH_TOKEN_KEY);
        await AddToken(refress_token);
        res.send({"access_token": access_token ,"refress_token": refress_token});
    });
});
//login



///
app.post("/login/employee",async (req,res) => {
    const employee =req.body ;
    console.log(employee)
    ressu = await CheckLogin(employee.username,employee.password)
    if(ressu==false){
        res.send(error_handling("mpompa"))
    }else{
        ressu= JSON.parse(JSON.stringify(ressu[0]));
        ressu = (({ id, first_name ,last_name }) => ({ id, first_name ,last_name }))(ressu);
        const employee1 = {user: ressu};
        const access_token = generateAccessToken(employee1)
        const refress_token = jwt.sign(employee1,process.env.REFRESH_TOKEN_KEY);
        await AddToken(refress_token);
        res.send({"access_token": access_token ,"refress_token": refress_token});
        //console.log(ressu)

    }
});

function generateAccessToken(employee){
    return jwt.sign(employee,process.env.ACCESS_TOKEN_KEY,{
        expiresIn: '20s' 
        });
}

app.get("/auchCheck",verify, (req,res) => {
    res.send(success_handling("joirjgrgrg"))
});

app.get("/logout",verify, (req,res) => {
    const token = req.header("auth-token")
    //await DeleteToken(refress_token);
    console.log(token)
    // get the decoded payload and header
    //jwtBlacklist.blacklist(token);
    res.send(success_handling("joirjgrgrg"))
});




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


app.put("/employee",async (req,res) => {
    //console.log(req.body.data)
    current_employee = req.body.data
    //console.log(current_employee.birthday,ChangeFromat(current_employee.birthday))

    //console.log("Επεξεργασια employee")
   // console.log(current_room)
    if(await UpdateEmployee(current_employee)){
          res.send(success_handling(""));
    }else{
         res.send(error_handling(""));
    }
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
        connDB.query(sql,(err, result) => {
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

function CheckLogin(username,password){
    console.log(username,password)
    return new Promise((resolve,reject)=>{
        sql = "select * from employees where username=? and password =?";
        
        connDB.query(sql,[username,password],(err, result) => {
            if (err){
                console.log("CheckLogin");
                console.log(err);
                resolve (false);
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
        birthday= ChangeFromat(employee.birthday);
        sex= employee.sex;
        address= employee.address;
        city= employee.city;
        phone= employee.phone;
        amka= employee.amka;
        adt= employee.adt;
        afm= employee.afm;
        username= employee.username;
        password= employee.password;
        sql = "INSERT INTO employees (first_name,last_name,birthday,sex,address,city,phone,amka,adt,afm,username,password) " +
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?);"
        connDB.query(sql,[first_name,last_name,birthday,sex,address,city,phone,amka,adt,afm,username,password],(err, result) => {
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


function UpdateEmployee(employee){
    return new Promise((resolve,reject)=>{
        id = employee.id;
        first_name=  employee.first_name;
        last_name=  employee.last_name;
        birthday=  ChangeFromat(employee.birthday);
        sex=  employee.sex;
        address=  employee.address;
        city=  employee.city;
        phone=  employee.phone;
        amka=  employee.amka;
        adt=  employee.adt;
        afm=  employee.afm;
        username= employee.username;
        password=  employee.password ;
        sql = "UPDATE  employees set first_name = ?, last_name = ?, birthday = ?, sex = ?, address = ?, city = ?,phone =?"+
        ",amka =?,adt =?,afm =?,username =?,password=?   where id = ?"
        connDB.query(sql,[first_name , last_name , birthday , sex , address , city ,phone,
            amka ,adt ,afm,username ,password, id],(err, result) => {
           // console.log(result.affectedRows);
            if (err || result.affectedRows == 0){
                console.log("UpdateEmployee");
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
app.post("/costumer", async (req,res) => {
    costumer  =req.body.data ;
    //console.log(costumer)
    if(await RegisterCostumer(costumer)==true){
        res.send(success_handling("mpompa"))
    }else{
        res.send(error_handling("error"));

    }
});

app.put("/costumer", (req,res) => {
    res.send("Επεξεργασια πελάτη");
});

app.delete("/costumer", (req,res) => {
    res.send("Διαγραφη πελάτη");
});


app.get("/costumer/:id",async (req,res) => {
    costumer_id = req.params.id;
   // console.log("costumer_id",costumer_id)
    if (costumer_id =="!"){
        result = await GetAllFromTable("costumers");
    }else{
        result = await GetCostumerById(costumer_id);
    }
    res.send(result);
    
});


app.get("/costumer_auth/:id",async (req,res) => {
    costumer_id = req.params.id;
   // console.log("costumer_id",costumer_id)
    result = await GetCostumerById(costumer_id);
    if(result!=false){
        res.send(success_handling(result));
    }else{
        res.send(error_handling("jiorg"));
    }
    
    
});



function RegisterCostumer(costumer){
    return new Promise((resolve,reject)=>{
        last_name = costumer.last_name;
        first_name = costumer.first_name;
        birthday = costumer.birthday;
        sex = costumer.sex;
        phone = costumer.phone;
        adt =  costumer.adt;
        sql = "INSERT INTO costumers (last_name,first_name,birthday,sex,phone,adt) " +
        "VALUES (?,?,?,?,?,?);"
        connDB.query(sql,[last_name,first_name,birthday,sex,phone,adt],(err, result) => {
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



function GetCostumerById(costumer_id){
    return new Promise((resolve,reject)=>{
        sql = "";
        if (parseFloat(costumer_id)==costumer_id){
            sql = " select * from costumers where phone  like '%"+costumer_id+"%'"
        }else{
            sql = " select * from costumers where last_name  like '%"+costumer_id+"%'"
        }
        connDB.query(sql,(err, result) => {
            if (err){
                console.log("GetCostumerById");
                console.log(err);
                resolve ([]);
            }
            else{
                resolve (result);
            }
        })
    });
}

///Reservation
app.post("/reservation", async (req,res) => {
    reservation  =req.body.data ;
    //console.log(costumer)
    if(await RegisterReservaton(reservation)==true){
        res.send(success_handling("mpompa"))
    }else{
        res.send(error_handling("error"));

    }
});

app.put("/reservation", (req,res) => {
    res.send("Επεξεργασια κρατησης");
});

app.delete("/reservation", (req,res) => {
    res.send("Διαγραφη κρατησης");
});




function RegisterReservaton(reservation){

    return new Promise((resolve,reject)=>{
        date = reservation.date;
        rec_id = reservation.rec_id;
        costumer_id = reservation.costumer_id;
        room_id = reservation.room_id;
        arrival = reservation.arrival;
        departure = reservation.departure;
        num_of_abults = reservation.num_of_abults;
        num_of_minors = reservation.num_of_minors;
        parking_space = reservation.parking_space;
        diet = reservation.diet;
        cost = reservation.cost;
        sql = "INSERT INTO costumers (date,rec_id,costumer_id,room_id,arrival,departure,num_of_abults,"+
            "num_of_minors,parking_space,diet,cost) VALUES (?,?,?,?,?,?,?,?,?,?,?);"
        connDB.query(sql,[date,rec_id,costumer_id,room_id,arrival,departure,num_of_abults,
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
        connDB.query(sql,[air_condition,pool,wifi ,only_breakfast,half_board, full_diet,
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
});

app.put("/room",async (req,res) => {
    current_room = req.body.room
    console.log("Επεξεργασια δωματιου")
   // console.log(current_room)
    if(await UpdateRoom(current_room)){
          res.send(success_handling(""));
    }else{
         res.send(error_handling(""));
    }
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
        connDB.query(sql,[room_id],(err, result) => {
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
        connDB.query(sql,(err, result) => {
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
        connDB.query(sql,[type,num_of_beds,air_condition,pool,wifi,price],(err, result) => {
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


function UpdateRoom(room){
    return new Promise((resolve,reject)=>{
        type = room.type;
        num_of_beds= room.num_of_beds;
        air_condition= room.air_condition;
        pool= room.pool;
        wifi= room.wifi;
        price= room.price;  
        id = room.id  
        sql = "UPDATE  rooms set type = ?, num_of_beds = ?, air_condition = ?, pool = ?, wifi = ?, price = ? where id = ?"
        connDB.query(sql,[type,num_of_beds,air_condition,pool,wifi,price,id],(err, result) => {
           // console.log(result.affectedRows);
            if (err || result.affectedRows ==0){
                console.log("UpdateRoom");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}

//cookies

function RegisterCookie(cookie){
    return new Promise((resolve,reject)=>{
        sql = "insert into cookies values(?)"
        connDB.query(sql,[cookie],(err, result) => {
           // console.log(result.affectedRows);
            if (err){
                console.log("RegisterCookie");
                console.log(err);
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}













function handle_mysql_disconnect(_connDB){ 
_connDB.on('error', function(error){
     if(!error.fatal)  return;
     if(error.code !== 'PROTOCOL_CONNECTION_LOST')  throw error;

     process_log.warn("re-connecting with mysql server!");

     connDB = mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'user1234',
        database: 'hotel_database',
        insecureAuth : true
    });

     handle_mysql_disconnect(connDB);
     connDB.connect();
 });
}

handle_mysql_disconnect(connDB);