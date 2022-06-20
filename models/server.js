const express = require('express');
const cors = require('cors');
const { dbConection } = require('../db/config');

class Server {

    constructor() {
        //Variables para refenciar express y mis variables de entornos
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth:       '/api/auth',
            buscar:       '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios:   '/api/usuarios'
        }

        //conectar a la base de datos
        this.conectarDB();
        
        //Middlewares funciones que se activan cuando el servidor corre
        this.middelwares();

        //rutas
        this.routes();
    }

    async conectarDB() {
        await dbConection();
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
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        });
    }


}

module.exports = Server;