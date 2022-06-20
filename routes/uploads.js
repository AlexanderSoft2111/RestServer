//Importacion del metodo router de express
const {Router} = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImg, mostrarImagen, actualizarImgCloudinary } = require('../controllers/uploads');
const { coleccionValida } = require('../helpers');
const { validarArchivo } = require('../middlewares');

const { validarCampos } = require('../middlewares/validarCampos');


const router = Router();


router.post('/',validarArchivo,cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivo,
    check('id', 'Debe ser un id de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionValida(c, ['usuarios','productos'])),
    validarCampos
],actualizarImgCloudinary);
//actualizarImg

router.get('/:coleccion/:id',[
    check('id', 'Debe ser un id de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionValida(c, ['usuarios','productos'])),
    validarCampos
],mostrarImagen);




module.exports = router;