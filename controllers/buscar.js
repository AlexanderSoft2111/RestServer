const { request, response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

//Funcion para buscar el usuario y utilizando el res devolvermos la información
const buscarUsuario = async(termino = '', res = response) => {

    //Sentencia para verificar si el termino ingresado es un id de mongo
    const esMongoId = ObjectId.isValid(termino); 

    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        res.json({
            results: (usuario) ? [usuario] : [] //si existe el usuario lo devolvemos como arreglo, caso contrario un arreglo vacio
        });
    }
    
    //Convertimos el termino para que sea una expresion keysensitive y pueda ser una busqueda mas flexible
    const regexp = new RegExp( termino, 'i'); 

    const usuarios = await Usuario.find({
        //podemos enviarle expresiones de busqueda de sql
        $or: [{nombre: regexp}, {correo: regexp}],
        $and: [{estado: true}]
    });
    
    res.json({
        results: usuarios
    });

}
const buscarCategoria = async(termino = '', res = response) => {

    //Sentencia para verificar si el termino ingresado es un id de mongo
    const esMongoId = ObjectId.isValid(termino); 

    if(esMongoId){
        const categoria = await Categoria.findById(termino);
        res.json({
            results: (categoria) ? [categoria] : [] //si existe el usuario lo devolvemos como arreglo, caso contrario un arreglo vacio
        });
    }
    
    //Convertimos el termino para que sea una expresion keysensitive y pueda ser una busqueda mas flexible
    const regexp = new RegExp( termino, 'i'); 

    const categorias = await Categoria.find({
        //podemos enviarle expresiones de busqueda de sql
        $and: [{nombre: regexp},{estado: true}]
    });
    
    res.json({
        results: categorias
    });

}
const buscarProducto = async(termino = '', res = response) => {

    //Sentencia para verificar si el termino ingresado es un id de mongo
    const esMongoId = ObjectId.isValid(termino); 

    if(esMongoId){
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        res.json({
            results: (producto) ? [producto] : [] //si existe el usuario lo devolvemos como arreglo, caso contrario un arreglo vacio
        });
    }
    
    //Convertimos el termino para que sea una expresion keysensitive y pueda ser una busqueda mas flexible
    const regexp = new RegExp( termino, 'i'); 

    const productos = await Producto.find({nombre: regexp},{estado: true})
                                     populate('categoria','nombre');
    
    res.json({
        results: productos
    });

}

const buscar = (req = request, res = response) => {
    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){

       return res.status(400).json({
                msg: `Estas son las colecciones permitidas ${coleccionesPermitidas}`
            });
    }

    switch (coleccion) {
            case 'usuarios':
            buscarUsuario(termino,res);
            break;
        
            case 'categorias':
            buscarCategoria(termino,res);
            break;
        
            case 'productos':
            buscarProducto(termino,res);
            break;
    
        default:
            res.status(500).json({
                msg: 'Me olvide de hacer esta busqueda'
            });
            break;
    }
}

module.exports = {
    buscar
}