const dbConnection = require('../../config/dbConnection');
module.exports = app => {
	const connection = dbConnection();
	app.get('/',(req,res)=>{
		res.render('index');
	});
//---------------------------------------*Registro y vista del alumno*----------------------------------------------/
	app.get('/registroAlumno',(req,res)=>{
		res.render('alumno/registroAlumno');
	});

	app.get('/listadoAlumnos',(req,res)=>{
			connection.query("SELECT idalumno, folio, nombre, DATE_FORMAT(fechaNacimiento, '%d-%b-%Y') as fechaNacimiento FROM alumno", (err, result)=>{
				//console.log(result);
				res.render('alumno/listadoAlumnos', {
					result
				});
			});	
	});
	//Agregado para filtrar el listado de alumnos
	app.post('/listadoAlumnosFiltrado',(req,res)=>{
		//const tipoAlumno = req.params.tipoAlumno;
		const tipoAlumno = req.body.tipoAlumno;
		console.log(tipoAlumno);
		if (tipoAlumno == 'General'){
			connection.query("SELECT idalumno, folio, nombre, DATE_FORMAT(fechaNacimiento, '%d-%b-%Y') as fechaNacimiento FROM alumno", (err, result)=>{
				console.log(result);
				res.render('alumno/listadoAlumnos', {
					result
				});
			});
		}else{
			connection.query("SELECT idalumno, folio, nombre, DATE_FORMAT(fechaNacimiento, '%d-%b-%Y') as fechaNacimiento FROM alumno WHERE tipoAlumno = ?",tipoAlumno, (err, result)=>{
				console.log(result);
				res.render('alumno/listadoAlumnos', {
					result
				});
			});
		}			
});

	app.post('/registroAlumno',(req,res)=>{
		let sampleFile = req.files.foto;
		console.log(sampleFile);
		const beforefoto = `/Users/Jose/Desktop/Cendi/src/public/imagesAlumnos/${req.files.foto.name}`;
		sampleFile.mv(beforefoto, function(err){
			if (err) throw err;
		});
		console.log(beforefoto);

		const {folio, nombre, sexo, domicilio, fechaNacimiento, tipoRH, alergia, fechaIngreso, tipoAlumno, nne} = req.body;
		const foto = req.files.foto.name;

		connection.query('INSERT INTO alumno SET?', {
			folio,
			nombre,
			sexo,
			domicilio,
			fechaNacimiento,
			tipoRH,
			alergia,
			fechaIngreso,
			foto,
			tipoAlumno,
			nne
			}, (err, result) =>{
				//console.log(result);
				if (err) throw err;
				console.log(req.body);
				res.redirect('/listadoAlumnos');
				 
		});
	});

	app.get('/antecedenteClinicoAlumno',(req,res)=>{
		res.render('alumno/antecedenteClinicoAlumno');
		//Una vez obtenido los datos y guardado el registro mandamos al trabajo 
	});
//---------------------------------------* Update del alumno *-----------------------------------------------------/

	app.get('/editar/:idalumno', (req,res)=>{
		const idalumno = req.params.idalumno;
		console.log(idalumno);
		connection.query("SELECT *, DATE_FORMAT(fechaNacimiento, '%Y-%m-%d') as fechaNacimiento, DATE_FORMAT(fechaIngreso, '%Y-%m-%dT%H:%i') as fechaIngreso FROM alumno WHERE idalumno = ? ",idalumno, (err, result)=>{
			console.log(err,'---', result);

			if (err) throw err;
			res.render('alumno/editarAlumno', {
				alumno: result
			});
		});		
	});

	app.post('/actualizarAlumno/:idalumno', (req,res)=>{
		const idalumno = req.params.idalumno;

		let sampleFile = req.files.foto;
		//Si no se edita la foto esta vendra con valor undefined.
		if(sampleFile != undefined){
			console.log(sampleFile);
			const beforefoto = `/Users/Jose/Desktop/Cendi/src/public/imagesAlumnos/${req.files.foto.name}`;
			sampleFile.mv(beforefoto, function(err){
				if (err) throw err;
			});
	
			const foto = req.files.foto.name; 
			console.log(foto);
	
			
			connection.query('UPDATE alumno SET foto = ? WHERE idalumno = ?',[req.files.foto.name,idalumno],(err,resp) =>{
				if (err) throw err;
				//resp.status(200).send('Actualizado con exito.');
			});	
		}
				
		const {folio, nombre, sexo, domicilio, fechaNacimiento, tipoRH, alergia, fechaIngreso, tipoAlumno, nne} = req.body;
		console.log(req.body);
		connection.query('UPDATE alumno SET ? WHERE idalumno = ?',[req.body,idalumno], (err,resp)=>{
				if (err) throw err;
				console.log(req.body);
				//resp.status(200).send('Actualizado con exito.');
	 			res.redirect('/listadoAlumnos');	

			});
	 	});
//---------------------------------------* Delete del Alumno *----------------------------------------------/
	app.post('/eliminar/:idalumno', (req,res)=>{
		const idalumno = req.params.idalumno;
		console.log(idalumno);
		connection.query("DELETE FROM alumno WHERE idalumno = ? ",idalumno, (err, result)=>{
			console.log(err,'---', result);
			return (err) ? res.status(500).send({error: 'Error al eliminar.!'}) : res.redirect('/listadoAlumnos');
		});		
	});


//---------------------------------------* Registro y vista del tutor *----------------------------------------------/
	app.get('/registroTutor',(req,res)=>{
		
		connection.query('SELECT idalumno,nombre FROM alumno', (err, result)=>{
			//console.log(result);
			if (err) throw err;
			res.render('tutor/registroTutor',{
				alumno : result //result[0].nombre
			});
		});
	});

	app.get('/listadoTutor',(req,res)=>{
		connection.query("SELECT idtutor,parentesco, nombre, telefono FROM tutor", (err, result)=>{
			console.log(result);
			res.render('tutor/listadoTutor', {
				result
			});
		});
	});

//Agregado para filtrar el listado de alumnos
app.post('/listadoTutorFiltrado',(req,res)=>{	
	const parentesco = req.body.parentesco;
	console.log(parentesco);
	if (parentesco == 'General'){
		connection.query("SELECT idtutor,parentesco, nombre, telefono FROM tutor", (err, result)=>{
			console.log(result);
			res.render('tutor/listadoTutor', {
				result
			});
		});
	}else{
		connection.query("SELECT idtutor,parentesco, nombre, telefono FROM tutor WHERE parentesco = ?",parentesco, (err, result)=>{
			console.log(result);
			res.render('tutor/listadoTutor', {
				result
			});
		});
	}			
});

	app.post('/registroTutor',(req,res)=>{

		let sampleFile = req.files.foto;
		console.log(sampleFile);
		
		const beforefoto = `/Users/Jose/Desktop/Cendi/src/public/imagesTutores/${req.files.foto.name}`;
		sampleFile.mv(beforefoto, function(err){
			if (err) throw err;
		});
		console.log(beforefoto);

		const {parentesco, nombre, domicilio, fechaNacimiento, telefono, correo, escolaridad, alumno_idalumno} = req.body;
		const foto = req.files.foto.name;

		
		console.log(parentesco);
		
		connection.query('INSERT INTO tutor SET?', {
			parentesco,
			nombre,
			domicilio,
			fechaNacimiento,
			telefono,
			correo,
			foto,
			escolaridad,
			alumno_idalumno
			
		}, (err, result) => {
			if (err) throw err;
			console.log(req.body.parentesco);
			if (req.body.parentesco == 'Madre'){
				res.redirect('/antecedenteClinicoMadre');
			}else if (req.body.parentesco == 'Padre'){
				res.redirect('/trabajo');
			}
			else{
				res.redirect('/registroTutor');
			}
			
			console.log(req.body);
		});
	});

/*------------------------------------------- Update del Tutor------------------------------------------------------------ */

app.get('/editarTutor/:idtutor', (req,res)=>{
	const idtutor = req.params.idtutor;
	console.log(idtutor);
	connection.query("SELECT *, DATE_FORMAT(fechaNacimiento, '%Y-%m-%d') as fechaNacimiento  FROM tutor WHERE idtutor = ? ",idtutor, (err, result)=>{
		console.log(err,'---', result);

		if (err) throw err;
		res.render('tutor/editarTutor', {
			tutor: result
		});
	});
	/*
	connection.query('SELECT idalumno,nombre FROM alumno', (err, result)=>{
		//console.log(result);
		if (err) throw err;
		res.render('tutor/editarTutor',{
			alumno : result //result[0].nombre
		});
	});	
	*/		
});

app.post('/actualizarTutor/:idtutor', (req,res)=>{
	const idtutor = req.params.idtutor;
	let sampleFile = req.files.foto;
	if (sampleFile != undefined){
		console.log(sampleFile);
		const beforefoto = `/Users/Jose/Desktop/Cendi/src/public/imagesTutores/${req.files.foto.name}`;
		sampleFile.mv(beforefoto, function(err){
			if (err) throw err;
		});
	
		const foto = req.files.foto.name; 
		console.log(foto);
	
		
		connection.query('UPDATE tutor SET foto = ? WHERE idtutor = ?',[req.files.foto.name,idtutor],(err,resp) =>{
			if (err) throw err;
		});	
	}

	const {parentesco, nombre, fechaNacimiento, domicilio, telefono, correo, escolaridad,alumno_idalumno} = req.body;
	console.log(req.body);
	connection.query('UPDATE tutor SET ? WHERE idtutor = ?',[req.body,idtutor], (err,resp)=>{
			if (err) throw err;
			console.log(req.body);
			 res.redirect('/listadoTutor');	
		});
	 });

//---------------------------------------* Delete del Tutor *----------------------------------------------/
app.post('/eliminarTutor/:idTutor', (req,res)=>{
	const idTutor = req.params.idTutor;
	console.log(idTutor);
	connection.query("DELETE FROM tutor WHERE idTutor = ? ",idTutor, (err, result)=>{
		console.log(err,'---', result);
		return (err) ? res.status(500).send({error: 'Error al eliminar.!'}) : res.redirect('/listadoTutor');
	});		
});	 


/*------------------------------------------------------------------------------------------------------------------------ */
	app.get('/antecedenteClinicoMadre',(req,res)=>{
		res.render('tutor/antecedenteClinicoMadre');
		//Una vez obtenido los datos y guardado el registro mandamos al trabajo 
	});
/*----------------------------------------------Registro y vista del profesor--------------------------------------------*/

	app.get('/registroProfesor', (req,res)=>{
		res.render('profesor/registroProfesor');
	});

	app.get('/listadoProfesor',(req,res)=>{
		connection.query("SELECT idprofesor, folio, nombre, DATE_FORMAT(fechaNacimiento, '%d-%b-%Y') as fechaNacimiento FROM profesor", (err, result)=>{
			console.log(result);
			res.render('profesor/listadoProfesor', {
				result
			});
		});
	});
	app.post('/registroProfesor',(req,res)=>{
		let sampleFile = req.files.foto;
		console.log(sampleFile);
		const beforefoto = `/Users/Jose/Desktop/Cendi/src/public/imagesProfesores/${req.files.foto.name}`;
		sampleFile.mv(beforefoto, function(err){
			if (err) throw err;
		});
		console.log(beforefoto);

		const {folio, nombre, sexo, domicilio, fechaNacimiento, fechaIngreso} = req.body;
		const foto = req.files.foto.name;

		connection.query('INSERT INTO profesor SET?', {
			folio,
			nombre,
			sexo,
			domicilio,
			fechaNacimiento,
			fechaIngreso,
			foto
			}, (err, result) =>{
				//console.log(result);
				if (err) throw err;
				console.log(req.body);
	 			res.redirect('/registroProfesor');
		});
	});
//---------------------------------------* Update del Profesor *-----------------------------------------------------/

app.get('/editarProfesor/:idprofesor', (req,res)=>{
	const idprofesor = req.params.idprofesor;
	console.log(idprofesor);
	connection.query("SELECT *, DATE_FORMAT(fechaNacimiento, '%Y-%m-%d') as fechaNacimiento, DATE_FORMAT(fechaIngreso, '%Y-%m-%dT%H:%i') as fechaIngreso FROM profesor WHERE idprofesor = ? ",idprofesor, (err, result)=>{
		console.log(err,'---', result);

		if (err) throw err;
		res.render('profesor/editarProfesor', {
			profesor: result
		});
	});		
});

/* ---------------------------------------------------ACTUALIZACION DEL PROFESOR ----------------------------------------------------------*/
app.post('/actualizarProfesor/:idprofesor', (req,res)=>{
	const idprofesor = req.params.idprofesor;
	let sampleFile = req.files.foto;
	if (sampleFile != undefined){
		console.log(sampleFile);
		const beforefoto = `/Users/Jose/Desktop/Cendi/src/public/imagesProfesores/${req.files.foto.name}`;
		sampleFile.mv(beforefoto, function(err){
			if (err) throw err;
		});
	
		const foto = req.files.foto.name; 
		console.log(foto);
	
		
		connection.query('UPDATE profesor SET foto = ? WHERE idprofesor = ?',[req.files.foto.name,idprofesor],(err,resp) =>{
			if (err) throw err;
		});	
	}
			
	const {folio, nombre, sexo, domicilio, fechaNacimiento, fechaIngreso} = req.body;
	console.log(req.body);
	connection.query('UPDATE profesor SET ? WHERE idprofesor = ?',[req.body,idprofesor], (err,resp)=>{
			if (err) throw err;
			console.log(req.body);
			 res.redirect('/listadoProfesor');	

		});
	 });


//---------------------------------------* Delete del Profesor *----------------------------------------------/
app.post('/eliminarProfesor/:idprofesor', (req,res)=>{
	const idprofesor = req.params.idprofesor;
	console.log(idprofesor);
	connection.query("DELETE FROM profesor WHERE idprofesor = ? ",idprofesor, (err, result)=>{
		console.log(err,'---', result);
		return (err) ? res.status(500).send({error: 'Error al eliminar.!'}) : res.redirect('/listadoProfesor');
	});		
});


/*----------------------------------------------Registro y vista de la Sala--------------------------------------------*/

	app.get('/registroSala', (req,res)=>{
		connection.query('SELECT idprofesor,nombre FROM profesor', (err, result)=>{
			//console.log(result);
			if (err) throw err;
			res.render('sala/registroSala',{
				profesor : result //result[0].nombre
			});
		});
	});

	app.post('/registroSala',(req,res)=>{

		const {nombre,idprofesor} = req.body;
		console.log('nombre ' + nombre);
		console.log('profesorID ' + idprofesor);
		connection.query('INSERT INTO SALA SET?', {
			nombre,
			idprofesor
			}, (err, result) =>{
				console.log(result);
				if (err) throw err;
				console.log(req.body);
	 			res.redirect('/registroSala');
		});
	});


	app.get('/listadoSala',(req,res)=>{
		//Se acomodara en otra ventana ya para no batallar en donde se vera la lista (listadoSala)
		/*connection.query("SELECT idSala, nombre, idprofesor FROM sala", (err, result)=>{*/
		connection.query("SELECT s.idSala as idsala, s.nombre as nombreSala, p.nombre as nombreProfesor FROM sala s join profesor p on s.idprofesor = p.idprofesor", (err, result)=>{
			console.log(result);
			if (err) throw err;
			res.render('sala/listadoSala', {
				sala : result 
			});
		});		
	});

	app.get('/editarSala/:idsala', (req,res)=>{
		const idsala = req.params.idsala;
		console.log(idsala);
		connection.query("SELECT idsala,nombre FROM sala WHERE idsala = ? ",idsala, (err, result)=>{
			console.log(err,'---', result);
	
			if (err) throw err;
			res.render('sala/editarSala', {
				sala: result
			});
		});		
	});	

	app.post('/actualizarSala/:idsala', (req,res)=>{
		const idsala = req.params.idsala;
				
		//const {nombre,idprofesor} = req.body;
		const {nombre} = req.body;
		if(!req.body.nombre){
			return res.send(500, 'Need a password');
		  };
		console.log(req.body);
		connection.query('UPDATE sala SET ? WHERE idsala = ?',[req.body,idsala], (err,resp)=>{
				if (err) throw err;
				console.log(req.body);
				//resp.status(200).send('Actualizado con exito.');
	 			res.redirect('/listadoSala');	

			});
		 });
		 
		 app.post('/eliminarSala/:idsala', (req,res)=>{
			const idsala = req.params.idsala;
			console.log(idsala);
			connection.query("DELETE FROM sala WHERE idsala = ? ",idsala, (err, result)=>{
				console.log(err,'---', result);
				return (err) ? res.status(500).send({error: 'Error al eliminar.!'}) : res.redirect('/listadoSala');
			});		
		});

/*----------------------------------------------------------------------------------------------------------------- */

	app.get('/trabajo',(req,res)=>{
		res.render('tutor/trabajo');
	});

/*--------------------------------------------Control Peso Talla--------------------------------------------------- */
	app.get('/pesoTalla',(req,res)=>{
		//res.render('alumno/pesoTalla');
		//connection.query("SELECT *,DATE_FORMAT(fecha, '%d-%b-%Y') as fecha FROM pesotalla", (err, result)=>{
		connection.query("SELECT a.nombre,pt.peso,pt.talla,pt.pesoideal,pt.observacion,DATE_FORMAT(fecha, '%d-%b-%Y') as fecha FROM pesotalla pt join alumno a on pt.idalumno = a.idalumno", (err, result)=>{
			//console.log(result);
			if (err) throw err;
			res.render('alumno/pesoTalla',{
				alumno : result //result[0].nombre
			});
		});	
	});

	app.post('/controlPesoTalla',(req,res)=>{
		const {peso, talla, pesoIdeal, observacion, fecha} = req.body;
		let nombre = req.body.nombre;
		var idalumno = ""; 
		connection.query('SELECT idalumno FROM alumno WHERE nombre = ? ',nombre, (err, result)=>{
			//console.log(err,'---', result);
			if (err) throw err;
			
			//res.render('alumno/pesoTalla', {
				result
			//});
			
			idalumno = result[0].idalumno;
			//console.log(idalumno);

			connection.query('INSERT INTO pesotalla SET?', {
				peso,
				talla,
				pesoIdeal,
				observacion,
				fecha,
				idalumno
				
			}, (err,result)=>{
				res.redirect('/pesoTalla');
			});				
		});	
	});		

/*----------------------------------------------Dental Optico---------------------------------------------------------- */
	app.get('/dentalOptico',(req,res)=>{
		//res.render('alumno/dentalOptico');
		connection.query("select a.nombre, do.dxdental, do.dxoptico, do.observacion, DATE_FORMAT(fecha,'%d-%b-%Y') as fecha from dentaloptico do join alumno a on do.idalumno = a.idalumno", (err, result)=>{
			//console.log(result);
			if (err) throw err;
			res.render('alumno/dentalOptico',{
				alumno : result //result[0].nombre
			});
		});		
	});

	app.post('/controlDentalOptico',(req,res)=>{
		const {dxdental, dxoptico, observacion, fecha} = req.body;
		let nombre = req.body.nombre;
		var idalumno = ""; 
		connection.query('SELECT idalumno FROM alumno WHERE nombre = ? ',nombre, (err, result)=>{
			//console.log(err,'---', result);
			if (err) throw err;
			
			//res.render('alumno/pesoTalla', {
				result
			//});
			
			idalumno = result[0].idalumno;
			//console.log(idalumno);

			connection.query('INSERT INTO dentaloptico SET?', {
				dxdental,
				dxoptico,
				observacion,
				fecha,
				idalumno				
			}, (err,result)=>{
				res.redirect('/dentalOptico');
			});				
		});	
	});		
/*----------------------------------------------Vacunacion---------------------------------------------------------- */
	app.get('/vacunas',(req,res)=>{
		//res.render('alumno/vacunas');
		connection.query("select a.nombre, v.tipovacuna, DATE_FORMAT(fecha,'%d-%b-%Y') as fecha from vacuna v join alumno a on v.idalumno = a.idalumno", (err, result)=>{
			//console.log(result);
			if (err) throw err;
			res.render('alumno/vacunas',{
				alumno : result //result[0].nombre
			});
		});			
	});

	app.post('/controlVacunas',(req,res)=>{
		const {tipovacuna, fecha} = req.body;
		let nombre = req.body.nombre;
		var idalumno = ""; 
		connection.query('SELECT idalumno FROM alumno WHERE nombre = ? ',nombre, (err, result)=>{
			//console.log(err,'---', result);
			if (err) throw err;
			
			//res.render('alumno/pesoTalla', {
				result
			//});
			
			idalumno = result[0].idalumno;
			//console.log(idalumno);

			connection.query('INSERT INTO vacuna SET?', {
				tipovacuna,
				fecha,
				idalumno				
			}, (err,result)=>{
				res.redirect('/vacunas');
			});				
		});	
	});	
	
/*-------------------------------------------Pase Medico---------------------------------------------------------- */
app.get('/paseMedico',(req,res)=>{
	res.render('alumno/paseMedico');	
});

app.get('/paseMedicoSuspension',(req,res)=>{
	res.render('alumno/paseMedicoSuspension');	
});

app.get('/morbilidad',(req,res)=>{
	res.render('alumno/morbilidad');	
});

app.get('/diario',(req,res)=>{
	res.render('alumno/diario');	
});

app.post('/paseMedico',function(req,res){
	var nombre = req.body.nombre;
  const atencion = req.body.atencion;
	const sintomas = req.body.sintomas;
	const tipoPase = req.body.tipoPase;
	const nombreTutor = req.body.nombreTutor;
	const dias = req.body.dias;
	const observacion = req.body.observacion;
	const sala = req.body.sala;
	var pase = '';
	var alumnoSr = '';

	var fecha = req.body.fecha;
    const fs = require('fs');
    const PDFDocument = require('pdfkit');
		//const pdf = new PDFDocument;
	if (tipoPase != "Normal"){
		pase = 'PASE DE SUSPENSIÓN'
		alumnoSr = 'SR.(A): ' + `${nombreTutor}`
	}else{
		pase = 'PASE MEDICO DEL NIÑO'
		alumnoSr = 'NOMBRE DEL NIÑO: ' + nombre

	}
	pdf = new PDFDocument({
        //size: 'LEGAL', 
        layout: 'portrait',
				size: 'legal', 
				margin: 5,     
        info: {    
             Title: 'PASE MEDICO',
             Author: 'Departamento Medico',
        }  
		});
		pdf.fontSize(25)
				.font('Helvetica-Oblique')
				.text('Centro de Desarrollo Infantil No.4' , 120, 40);
		pdf.fontSize(15)
				.font('Helvetica')
				.text('CLAVE 08.DD10006X' , 240, 70);
		pdf.fontSize(20)
				.font('Helvetica')
				.text(pase , 190, 90);
		pdf.fontSize(10)
				.font('Helvetica')
				.text('CD. JUAREZ CHIH. A ' +fecha, 450, 135);
		pdf.fontSize(12)
				.font('Helvetica-Bold')
				.text(alumnoSr, 50, 170);
		pdf.fontSize(12)
				.font('Helvetica-Bold')
				.text('SALA: ' + `${sala}`, 400, 170);
		if(tipoPase == "Normal"){
			pdf.fontSize(12)
			.font('Helvetica-BoldOblique')
			.text('NECESITA ATENCION MÉDICA DE: ' + ` *${atencion}*`, 50, 210);
			pdf.fontSize(12)
			.font('Helvetica-Bold')
			.text('SINTOMAS PRESENTADOS: ', 50, 250);
			pdf.fontSize(12)
			.font('Helvetica-Bold')
			.text(`*${sintomas}`, 50, 270);
			pdf.fontSize(10)
			.font('Helvetica')
			.text('Dra. Ma. Asunción Ruiz Reyes',240, 340);
			pdf.fontSize(10)
			.font('Helvetica')
			.text('___________________________________', 210, 365);
			pdf.fontSize(10)
			.font('Helvetica')
			.text('*Responsable de Área Médica*', 240, 380);			
		}else{
			pdf.fontSize(12)
			.font('Helvetica-BoldOblique')
			.text('Me permito informar que su hijo (a): ' + nombre, 50, 190);
			pdf.fontSize(12)
			.font('Helvetica-Bold')
			.text('Ha presentado este dia durante su permanencia en el Centro de Desarrollo Infantil, los siguientes sintomas: '+`*${sintomas}`, 50, 205);
			pdf.fontSize(12)
			.font('Helvetica-Bold')
			.text('Por lo que se le ruega, sirvase llevarlo a su domicilio o clinica para su atencion.', 50, 260);			
			pdf.fontSize(12)
			.font('Helvetica-Bold')
			.text('*No traerlo al centro durante '+ `${dias}` + ' dias necesarios para su recuperacion, a partir de esta fecha.', 50, 275);
			pdf.fontSize(12)
			.font('Helvetica-Bold')
			.text('*Observaciones: ' + `${observacion}`, 50, 290);
			pdf.fontSize(10)
			.font('Helvetica')
			.text('Dra. Ma. Asunción Ruiz Reyes',100, 380);
			pdf.fontSize(10)
			.font('Helvetica')
			.text('___________________________________', 70, 405);
			pdf.fontSize(10)
			.font('Helvetica')
			.text('*Responsable de Área Médica*', 100, 420);
			
			pdf.fontSize(10)
			.font('Helvetica')
			.text('PROFRA. MA. EMMA ESCAMILLA AGUILAR',380, 380);
			pdf.fontSize(10)
			.font('Helvetica')
			.text('___________________________________', 380, 405);
			pdf.fontSize(10)
			.font('Helvetica')
			.text('*DIRECTORA DEL CENDI No. 4*', 400, 420);
		}

/*------------------------------ SEGUNDA PARTE ---------------------------------------------------*/
		pdf.fontSize(25)
				.font('Helvetica-Oblique')
				.text('PARA SER LLENADO POR SU MEDICO' , 85, 470);

		pdf.fontSize(15)
				.font('Helvetica')
				.text('FAVOR DE INDICAR SUS EXPRESIONES DIAGNOSTICAS' , 110, 495);
		pdf.fontSize(10)
				.font('Helvetica')
				.text('___________________________________________________________________________________________', 50, 525);
		pdf.fontSize(10)
				.font('Helvetica')
				.text('___________________________________________________________________________________________', 50, 560);
		pdf.fontSize(10)
				.font('Helvetica')
				.text('___________________________________________________________________________________________', 50, 595);
		pdf.fontSize(10)
				.font('Helvetica-Bold')
				.text('SELECCIONE LA CASILLA CORRESPONDIENTE', 85, 630);
		pdf.fontSize(12)
				.font('Helvetica')
				.list(['NECESITA ATENCION ESPECIALIZADA'], 85, 650);				
		pdf.fontSize(12)
				.font('Helvetica')
				.list(['ACUDIR NUEVAMENTE A CONSULTA SE RESOLVIO EL PROBLEMA'], 85, 670);				
		pdf.fontSize(12)
				.font('Helvetica')
				.list(['NO ACUDIR AL CENDI HASTA SU TOTAL RECUPERACIÓN'], 85, 690);				
		pdf.fontSize(12)
				.font('Helvetica')
				.list(['SE RESOLVIO EL PROBLEMA'], 85, 710);				
		pdf.fontSize(10)
				.font('Helvetica-Bold')
				.text('FIRMA Y SELLO',270, 790);
		pdf.fontSize(10)
				.font('Helvetica')
				.text('___________________________________', 210, 815);
		pdf.fontSize(10)
				.font('Helvetica-Oblique')
				.text('*Desierto de los leones sn Fracc. Dunas Tel. y Fax. (656) 2 24-50-15*', 165, 835);
      // Stream contents to a file
     pdf.pipe(fs.createWriteStream('/users/Jose/Desktop/ReportesMedicos/'+nombre+'.pdf')).on('finish', function () {
		console.log('Archivo creado satisfactoriamente ....');
		
		//res.status(200).send('PDF Generado con exito.');
		//res.redirect('/paseMedico');
		res.render('alumno/paseMedico');		
		});
		
    pdf.end();

});

}	
