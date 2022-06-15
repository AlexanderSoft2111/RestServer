//Importamos express-validator para verificar los errores
const {validationResult} = require('express-validator');

//Un middleware siempre tiene un tercer argumentos next para que continue el siguiente si todo sale bien
const validarCampos = (req, resp, next) => {
    //Atrapamos los errores que vienen en la req y emitimos el msg
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return resp.status(400).json(errors);
    }

    next();
}

module.exports = {validarCampos}