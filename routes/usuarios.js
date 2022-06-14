//Importacion del metodo router de express
const {Router} = require('express');
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
router.put('/:id', usuariosPut);

//Método post para crear datos y colocamon un nombre para recibir los parametros por la url
router.post('/', usuariosPost);

//Método delete para eliminar datos
router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;

