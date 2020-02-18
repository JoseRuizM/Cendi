const mysql = require('mysql');

module.exports = () =>{
	return mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'',
		database: 'dbCendiPrueba'

	});
}


//Se entra en cmd y para correr querys entramos asi: mysql -u root (enter)