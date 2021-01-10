# Practica-Cotalker
Aplicacion web que muestra informacion de las llamadas a red realizadas a un servidor.

## Configuracion inicial de la Base de datos
Lo primero que se tiene que hacer es importar la base de datos, para ello se descarga el csv con los logs del siguiente link:
https://s3.amazonaws.com/cotalker-us/cotalker/log.practica.2.csv.zip

Se levanta el servicio de la DB de Mongo
```sh
$ sudo service mongodb start
```
Una vez descargado el zip con los logs y con el servicio mongodb arriba, se descomprime y se ejecuta el siguiente comando en la misma carpeta:
```sh
$ mongoimport --db=Servidor --collection=logs --type=csv --file=log.practica.2.csv --fields="companyId,userId,methodApi,timeMs,date,source"
```

Este comando sirve para importar los datos del csv a la base de datos MongoDB. Como se puede apreciar, los logs quedaran cargados en la base de datos "Servidor", en la colecion "logs".

Luego de importar los datos, lo que se hara sera reducir la cantidad de datos a procesar, para realizar esto en la terminal se ejecuta Mongo Shell:

```sh
> load("/Practica-Cotalker/Database/scriptDB.js");
true
> reducirDatos(15); 
```

Luego de ingresar estas instrucciones, se empezara a ejecutar el script que sirve para reducir la densidad de los datos, esto disminuira notablemente la cantidad de datos a procesar.

Antes de ejecuar el script, los logs se encontraban en la coleccion "logs", pero despues de ejecutarlo, la coleccion con la que se trabajara, osea la que contienen los datos preprocesados sera "registros"
