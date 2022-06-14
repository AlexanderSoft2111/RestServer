//Importando la req y resp para darle un tipado
const {request, response} = require('express');

//metodos para exportar y realizar el llamado de las rutas
const usuariosGet = (req = request, resp = response) => {

    //Obtenemos los datos que enviemos en la url como los query
    const {q,nombre = 'sin nombre',apiKey,page = 1,limit} = req.query;
    resp.json({
        msg: 'get API - Usuarios',
        q,
        nombre,
        apiKey,
        page,
        limit
    });

}

const usuariosPut = (req = request, resp = response) => {

    //Desestructuramos lo que venga en los param de la solicitud
    const {id} = req.params;
    resp.json({
        msg: 'put API - Usuarios',
        id
    });
}

const usuariosPost = (req = request, resp = response) => {

    //Se desestructura los datos que se envian en el body
    const {nombre,edad} = req.body;

    resp.json({
        msg: 'post API - Usuarios',
        nombre,
        edad
    });
}

const usuariosPatch = (req = request, resp = response) => {
    resp.json({
        msg: 'patch API - Usuarios'
    });
}

const usuariosDelete = (req = request, resp = response) => {
    resp.json({
        msg: 'delete API - Usuarios'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}