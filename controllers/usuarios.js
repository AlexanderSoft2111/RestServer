//Importando la req y resp para darle un tipado
const {request, response} = require('express');
const bscrypt = require('bcryptjs');


//Importando el usuario para hacer la referencia de mi modelo
const Usuario = require('../models/usuario');

//metodos para exportar y realizar el llamado de las rutas
const usuariosGet = async(req = request, resp = response) => {
    
    //Obtenemos los datos que enviemos en la url como los query
    //const {q,nombre = 'sin nombre',apiKey,page = 1,limit} = req.query;
    const {limite = 5,desde = 0} = req.query;

    //Podemos filtrar enviando en el find la expresion, en este caso queremos todos los usuarios con el estado true
    const query = {estado: true}
    //Obtenemos todos los usuarios y establecemos un limite y desde, tenemos que transformar a numeros los datos obtenidos de la query que nos devuelven como strign
    //const usuarios = await Usuario.find(query)
    //        .skip(Number(desde))
    //        .limit(Number(limite));
    
    //Para obtener el numero de registros
    //const total = await Usuario.countDocuments(query);

    //Ejecutamos las dos promesas al mismo tiempo ya que ninguna depende de la otra el resultado y ganamos tiempo de ejecuciòn
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    resp.json({
        msg: 'get API - Usuarios',
        total,
        usuarios
/*         q,
        nombre,
        apiKey,
        page,
        limit */
    });
    
}

const usuariosPost = async(req = request, resp = response) => {

    //Se desestructura los datos que se envian en el body
    const {nombre,correo,rol,password} = req.body;

    //Hacemos la instancaia para enviar los datos al Schema
    const usuario = new Usuario({nombre,correo,rol,password});

    //Encriptamos la contraseña con el numero de salto y haciendo el hash
    const salt = bscrypt.genSaltSync();
    usuario.password = bscrypt.hashSync(usuario.password,salt);

    //Guardamos en la base de datos
    await usuario.save();
    resp.json({
        msg: 'post API - Usuarios',

        //Imprimimos los datos del usuario
        usuario
    });
}

const usuariosPut = async(req = request, resp = response) => {

    //Desestructuramos lo que venga en los param de la solicitud
    const {id} = req.params;

    //Desesetructuramos los datos que no queremos guardar
    const {_id,password,google,correo,...resto} = req.body;
    
    //Si envia el password quiere decir que quiere volver a guardar la contraseña
    if(password){

        //Encriptamos la contraseña con el numero de salto y haciendo el hash
        const salt = bscrypt.genSaltSync();
        resto.password = bscrypt.hashSync(password,salt);
    }

    //Actualizamos los datos del usuario en la BD con el id
    const usuario = await Usuario.findByIdAndUpdate(id,resto);
    
    resp.json({
        msg: 'put API - Usuarios',
        usuario
    });
}

const usuariosDelete = async(req = request, resp = response) => {
    const {id} = req.params;

    //Eliminar de forma fisica de la bd
    //const usuario = await Usuario.findByIdAndDelete(id);

    //Actualizar el estado
    const usuario = await Usuario.findByIdAndUpdate(id,{estado: false});

    resp.json(usuario);
}

const usuariosPatch = (req = request, resp = response) => {
    resp.json({
        msg: 'patch API - Usuarios'
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}