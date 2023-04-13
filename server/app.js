const express = require("express");

const path = require("path");
const middleware = express.static(path.join(__dirname, './../public'));
const app = express();
app.use(middleware);
app.use(express.json());
let mysql = require('mysql');


let connection = mysql.createConnection({
    host: '172.22.80.1',
    user: 'Valery',
    password: 'Mysql123123123!',
    database: 'todolist'
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});



app.post("/order", (req, res, next) => {
    let post = { description: req.body.description };
    connection.query('INSERT INTO todolists SET ?', post, function (error, result, fields) {
        if (error) throw err;
        console.log("1 record inserted");
    })
});

app.post("/remove", (req, res, next) => {
    connection.query('DELETE FROM todolists WHERE id = ?', req.body.item, function (error, result, fields) {
        if (error) throw err;
        console.log("1 record delated");
    })
});


app.post("/change", (req, res, next) => {
    // console.log(req);
    let param = [
        req.body.change,
        req.body.id
    ]
    connection.query('UPDATE todolists SET description = ? WHERE id = ?', param,
        function (error, result) {
            res.redirect('/orders')
            if (error) throw err;
            console.log("1 record update");
        })
});



app.get("/orders", (req, res, next) => {
    connection.query('SELECT id, description FROM todolists', function (error, results, fields) {
        if (error) throw error;
        res.status(200).json(results);
        console.log(results);
    });

});



const port = process.env.PORT || 3000;
app.listen(port, (error) => {

    if (error) {
        console.log('[ERROR] Error start server. \r\n' + error);
        return;
    }
    if (process.env.NODE_ENV === 'production') {
        console.log('[INFO] Server start listening on ' + process.env.HOST_PROD);
    } else {
        console.log('[INFO] Server start listening on localhost:' + port);
    }
    console.log('[INFO] Node environment: ' + process.env.NODE_ENV);
});
