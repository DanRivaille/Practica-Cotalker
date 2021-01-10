function reducirDatos(intervaloMinutos) {
	const MINUTO_EN_MS = 60000;
	const intervaloMs = MINUTO_EN_MS * intervaloMinutos;
	const cantidadLogs = db.logs.count();
	let counter = 0;
	const mapa = new Map();
	
	db.logs.find().forEach(log => {
		const clave = obtenerClave(log);
		const fechaActual = Date.parse(log.date);
		const fechaGuardada = mapa.get(clave);

		if(fechaGuardada != null) {
			if((fechaActual - fechaGuardada) >= intervaloMs) {
				insertarLog(log);
				mapa.put(clave, fechaActual);
			}
		} else {
			insertarLog(log);
			mapa.put(clave, fechaActual);
		}

		counter++;

		if((counter % 10000) == 0) {
			print(`${counter} - ${cantidadLogs}: ${counter * 100 / cantidadLogs}%`)
		}
	});

	print(`${cantidadLogs} - ${cantidadLogs}: 100.0%`)
}

function insertarLog(log) {
	log.date = new Date(log.date);
	db.registros.insert(log);
}

function obtenerClave(log) {
	return `${log.companyId}-${log.userId}`;
}
