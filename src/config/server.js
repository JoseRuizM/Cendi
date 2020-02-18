/*Configuracion del servidor de express*/

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
//const PDFDocument = require('pdfkit');
//const fs = require('fs');
const app = express();


//settings
app.set('port',process.env.PORT || 3002);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../app/views'));



//static files 
app.use(express.static(path.join(__dirname,'../public')));

//middlewares
app.use(fileUpload());
app.use(bodyParser.json());//Nos permite convert a JSON los datos que nos envie el nav (antes de que llegue al serv). (escuche datos)
app.use(bodyParser.urlencoded({extended:false})); //Envia el nav data mediante url con form

module.exports = app; /*exportar para que lo use index.js*/