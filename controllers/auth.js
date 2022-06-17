const { response, request } = require("express");
const bscrypt = require('bcryptjs');


//Importando el usuario para hacer la referencia de mi modelo
const Usuario = require('../models/usuario');
const { generaJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-validator");

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

const googleSingIn = async(req = request, res = response) => {

    const {id_token} = req.body;

    try {
        const {nombre,img,correo} = await googleVerify(id_token);

        //Buscamos el usuario
        let usuario = await Usuario.findOne({correo});

        //Crear el usuario
        if(!usuario){
            const data = {
                nombre,
                correo,
                password: ':p',
                img, 
                google: true,
                rol: 'USER_ROL'
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Verificar en caso de que el usuario haya sido borrado
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Contacte al administrador - usuario bloqueado'
            });
        }

        //Generar JWT y regresa el token
        const token = await generaJWT(usuario.id);
        
        res.json({
            usuario,
            token
        });
    
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'token no se pudo verificar'
        });
    }
}

module.exports = {
    authPost,
    googleSingIn
}