//Importacion del metodo router de express
const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaId } = require('../helpers/bd-validators');
const { validarJWT, esAdminRol } = require('../middlewares');

const { validarCampos } = require('../middlewares/validarCampos');


const router = Router();

//Obtener todas las categorias - publico
router.get('/',obtenerCategorias);

//Obtener categoria por id - publico validar existeCategoria -personalizado middleware
router.get('/:id',[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
],obtenerCategoria);

//Crear una categoria - cualquier persona con un token valido
router.post('/',[
 validarJWT,
 check('nombre', 'El nombre es obligario').not().isEmpty(),
 validarCampos   
],crearCategoria);

//Actualizar categoria - privado cualquier rol
router.put('/:id',[
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
],actualizarCategoria);

//Eliminar categoria - privado solo el admin
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaId ),
    validarCampos
],borrarCategoria);


module.exports = router;