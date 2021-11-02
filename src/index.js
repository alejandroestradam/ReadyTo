const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const domino = require('domino');
const {readFileSync} = require('fs');
const rute = __dirname;
const template = readFileSync(path.join(rute,'views', 'index.ejs')).toString();
const winObj = domino.createWindow(template);
const flash = require('connect-flash');
var session = require('express-session');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false
}));
app.use(flash());

global['window'] = winObj;
global['document'] = winObj.document;
//Mongoose conection
require('./database');
// settings
app.set('port', PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);


// middlewares

// routes
app.use(require('./routes/index'));
/*app.use((req,res, next) =>{
    app.locals.user = req.user;
})*/
// static files
app.use(express.static(path.join(__dirname, 'public')));
// listening the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
