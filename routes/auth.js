//Importacion del metodo router de express
const {Router} = require('express');
const { check } = require('express-validator');
const { authPost } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');


const router = Router();

router.post('/login',[
    check('correo','El correo debe ser válido').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],authPost);

module.exports = router;