//Colocando las importaciones de un mismo lugar para importarlas en una sola

const validarCampos = require('../middlewares/validarCampos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRol = require('../middlewares/validar-rol');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRol
}