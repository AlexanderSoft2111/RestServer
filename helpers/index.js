
const bdValidators = require('./bd-validators');
const generarJWT = require('./generar-jwt');
const googleValidar = require('./google-validator');
const subirArchivo = require('./subir-archivo');

module.exports = {
    //para exportar todas las funciones que contienen
    ...bdValidators,
    ...generarJWT,
    ...googleValidar,
    ...subirArchivo
}