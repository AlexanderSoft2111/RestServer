//Importacion del metodo router de express
const {Router} = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeproductoId, existeCategoriaId } = require('../helpers/bd-validators');
const { validarJWT, esAdminRol } = require('../middlewares');

const { validarCampos } = require('../middlewares/validarCampos');


const router = Router();

//Obtener todas las categorias - publico
router.get('/',obtenerProductos);

//Obtener categoria por id - publico validar existeCategoria -personalizado middleware
router.get('/:id',[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeproductoId),
    validarCampos
],obtenerProducto);

//Crear una prodcto - cualquier persona con un token valido
router.post('/',[
 validarJWT,
 check('nombre', 'El nombre es obligario').not().isEmpty(),
 check('categoria','No es un id de mongo valido').isMongoId(),
 check('categoria').custom(existeCategoriaId),
 validarCampos   
],crearProducto);

//Actualizar producto - privado cualquier rol
router.put('/:id',[
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeproductoId),
    validarCampos
],actualizarProducto);

//Eliminar producto - privado solo el admin
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom( existeproductoId ),
    validarCampos
],borrarProducto);


module.exports = router;