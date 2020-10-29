const app = require('./config/server');

//En el folder routes se encuentra userRoutes.js el cual se requiere aqui y recibe el object App
require('./app/routes/index')(app); //Verificar si lo puedo mandar a server.js

//starting server

app.listen(app.get('port'),()=>{
	console.log(`server on port: ${app.get('port')}`);
})