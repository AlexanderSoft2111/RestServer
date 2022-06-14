const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        //Variables para refenciar express y mis variables de entornos
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares funciones que se activan cuando el servidor corre
        this.middelwares();

        //rutas
        this.routes();
    }

    middelwares(){

        //Cors | Protegiendo servidor 
        this.app.use( cors() );

        //Leer y parsear información enviada
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes(){

        //Importando rutas
        this.app.use(this.usuariosPath, require('../routes/usuarios'));

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        });
    }


}

module.exports = Server;