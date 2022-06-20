const {request, response } = require('express');
const { Categoria } = require('../models');

//ObtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {
    const {limite = 5,desde = 0} = req.query;
    const query = {estado: true}

    //Ejecutamos las dos promesas al mismo tiempo ya que ninguna depende de la otra el resultado y ganamos tiempo de ejecuciòn
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        categorias
    });
    
}


//ObtenerCategoria - populate
const obtenerCategoria = async(req = request, res = response) => {
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');
    
    if(!categoria){
       return res.status(400).json({
            msg: 'No se encontro ninguna categoria con el id'
        });
    }

    res.status(200).json({
        categoria
    });

}

const crearCategoria = async(req = request, res = response) => {
    //Extraemos el nombre capitalizados
    const nombre = req.body.nombre.toUpperCase();

    //Buscamos si ya existe en la BD en las categorias
    const categoriaDB = await Categoria.findOne({nombre});

    //Verificamos si la categoria ya existe
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }
    
    //Construimos la data que queremos guardar
    const data = {
        nombre,
        estado: true,
        usuario: req.usuario._id //Guardamos el id del usuario que ya tenemos en la req gracias a la validacion del JWR
    }

    //Enviamos la informacion para crear la categoria
    const categoria = new Categoria(data);

    //Guardamos en la BD
    await categoria.save();

    //Mensaje de respuesta
    res.status(201).json(categoria);


}

//ActualizarCategoria
const actualizarCategoria = async(req = request, res = response) => {
    //Desestructuramos lo que venga en los param de la solicitud
    const {id} = req.params;

    //Desesetructuramos los datos que no queremos guardar
    const {_id,estado,...data} = req.body;
    
    //Actualizamos los datos del usuario en la BD con el id
    const categoria = await Categoria.findByIdAndUpdate(id,data);
    
    res.json({
        categoria
    });


}

//BorrarCategoria - estado = false
const borrarCategoria = async(req = request, resp = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id,{estado: false});

    resp.json({
       categoria
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}