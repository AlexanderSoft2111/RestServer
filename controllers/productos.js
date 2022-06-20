const {request, response } = require('express');
const { Producto, Categoria } = require('../models');

//ObtenerCategorias - paginado - total - populate
const obtenerProductos = async(req = request, res = response) => {
    const {limite = 5,desde = 0} = req.query;
    const query = {estado: true}

    //Ejecutamos las dos promesas al mismo tiempo ya que ninguna depende de la otra el resultado y ganamos tiempo de ejecuciòn
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario','nombre')//Nos muestra los datos relacionados expandiendolos
            .populate('categoria','nombre')
    ]);

    res.status(200).json({
        total,
        productos
    });
    
}


//ObtenerProducto ID - populate
const obtenerProducto = async(req = request, res = response) => {
    const {id} = req.params;
    const producto = await Producto.findById(id)
                           .populate('categoria','nombre')
                           .populate('usuario', 'nombre');

    
    if(!producto){
       return res.status(400).json({
            msg: 'No se encontro ningun producto con el id'
        });
    }

    res.status(200).json({
        producto
    });

}

const crearProducto = async(req = request, res = response) => {
    //Extraemos el nombre capitalizados
    const {estado,usuario,...body} = req.body;
    
    //Buscamos si ya existe en la BD en las categorias
    const productoDB = await Producto.findOne({nombre: body.nombre});

  
    //Verificamos si el producto ya existe
    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        });
    }
    
    //Construimos la data que queremos guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id, //Guardamos el id del usuario que ya tenemos en la req gracias a la validacion del JWR
    }

    //Enviamos la informacion para crear la categoria
    const producto = new Producto(data);

    //Guardamos en la BD
    await producto.save();

    //Mensaje de respuesta
    res.status(201).json(producto);


}


const actualizarProducto = async(req = request, res = response) => {
    //Desestructuramos lo que venga en los param de la solicitud
    const {id} = req.params;

    //Desesetructuramos los datos que no queremos guardar
    const {_id,estado,...data} = req.body;
    
    //Actualizamos los datos del usuario en la BD con el id
    const producto = await Producto.findByIdAndUpdate(id,data, {new: true});
    
    res.json({
        producto
    });


}

const borrarProducto = async(req = request, resp = response) => {
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id,{estado: false});

    resp.json({
       producto
    });
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}