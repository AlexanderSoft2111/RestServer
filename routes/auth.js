//Importacion del metodo router de express
const {Router} = require('express');
const { check } = require('express-validator');
const { authPost, googleSingIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');


const router = Router();

router.post('/login',[
    check('correo','El correo debe ser válido').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],authPost);

router.post('/google',[
    check('id_token', 'El id no debe ser vácio').not().isEmpty(),
    validarCampos
],googleSingIn);

module.exports = router;