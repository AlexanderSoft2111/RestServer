//Importacion del metodo router de express
const {Router} = require('express');
const { check } = require('express-validator');

const { rolEsValido, emailExiste, existeById } = require('../helpers/bd-validators');
const { validarCampos } = require('../middlewares/validarCampos');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');


//Llamando las funciones de router
const router = Router();

//Método get para obtener datos y importando las funciones desde el controlador

router.get('/', usuariosGet);

//Método put para actualizar datos
router.put('/:id', [
        check('id').isMongoId(),
        check('id').custom( existeById ),
        validarCampos
],usuariosPut);

//Método post para crear datos y colocamon un nombre para recibir los parametros por la url
//Cuando se manda tres argumentos, el segundo siempre es el middleware, en este caso es de express validator
router.post('/',[
        //para mandar varias validaciones lo hacemos como un arreglo
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom( emailExiste ),
        check('password', 'La contraseña debe tener minimo 6 letras').isLength({min: 6}),
        //check('rol', 'El rol no es válido').isIn(['ADMIN_ROL','USER_ROL']),
        //Realizamos una validacion personalizada contra los valores de una base de datos, en donde tenemos que crear el schema para validarlo
        check('rol').custom( rolEsValido ),
        validarCampos //midleware personalizado para validar información
], usuariosPost);

//Método delete para eliminar datos
router.delete('/:id',[
        check('id').isMongoId(),
        check('id').custom( existeById ),
        validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;

