const { response, request } = require("express");
const bscrypt = require('bcryptjs');


//Importando el usuario para hacer la referencia de mi modelo
const Usuario = require('../models/usuario');
const { generaJWT } = require("../helpers/generar-jwt");

const authPost = async(req = request, res = response) => {

    try {
    
        const {correo, password} = req.body;

        //Validar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'El Correo / Usuario no son correctos - correo'
            });
        }
        
        //validar si el usuario esta activo
        if(!usuario.estado){
            
            return res.status(400).json({
                msg: 'El Correo / Usuario no son correctos - estado: false'
            });
        }
        
        //Validar la contraseña
        const passwordValido = bscrypt.compareSync(password, usuario.password);
        if(!passwordValido){
            
            return res.status(400).json({
                msg: 'El Correo / Usuario no son correctos - contraseña'
            });
        }

        //Generar JWT y regresa el token
        const token = await generaJWT(usuario.id);
        
        res.json({
            usuario,
            token
        })
    
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: 'Contacte al administrador'
        });
    }


}

module.exports = {
    authPost
}