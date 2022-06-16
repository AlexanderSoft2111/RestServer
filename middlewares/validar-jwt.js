const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

//Función para validar token
const validarJWT = async(req = request, res = response, next) =>{

    //Obtenemos el valor que enviamos en el header con su nombre
    const token = req.header('x-token');
    
    //Si no hay token devolvemos el error
    if(!token){
        return res.status(401).json({
            msg: 'No se encontro el token'
        });
    }

    try {
        //Obtenemos y verifacamos el token enviando
       const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);
       
       //Enviamos el usuairo a la request para poderlo extraer
       const usuario  = await Usuario.findById(uid);
       
       //Verificar si el usuario existe en la BD
       if(!usuario){
             
            return res.status(401).json({
                msg: 'Token no válido / usuario no eiste en BD'
            });
       }
       //Verificar si el usuario tiene un estado en true
       if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no válido / usuario con estado: false'
            });
       }

       req.usuario = usuario;
       //Si todo es correcto ejecutamos la siguiente acción
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'El token no es válido'
        });
    }


}

module.exports = {
    validarJWT
}