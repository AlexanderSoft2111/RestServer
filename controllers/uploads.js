
const { response } = require('express');
const {subirArchivo} = require('../helpers');
const {Usuario, Producto} = require('../models');
const  path  = require('path');
const fs = require('fs');

//Importamos y configuramos nuestras credenciales
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async(req, res = response) => {

    try {
        
        //Llamamos la funcion y le enviamos los archivos
        const nombre = await subirArchivo(req.files, undefined,'imgs');
    
        res.json({nombre});
    } catch (error) {
        res.status(400).json({error});
    }
  

}

const actualizarImg = async(req , res = response) =>{
    const {id,coleccion} = req.params;

    let modelo = '';
    
    switch (coleccion) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    });
                }
        break;
        
        case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    });
                }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            });
    }
  
    //Verificamos si existe una imagen
    if(modelo.img){

        //Creamos el path en donde se encuentra la imagen
        const uploadPathImg = path.join(__dirname, '../uploads',coleccion,modelo.img);
       
        //Verificamos si existe el path
        if(fs.existsSync(uploadPathImg)){

            //Eliminamos el archivo del path existente
            fs.unlinkSync(uploadPathImg);
          
        }
    }

    const nombre = await subirArchivo(req.files, undefined,coleccion);
    modelo.img = nombre;

    //Guardamos la imagen
    await modelo.save();

    res.json({
        modelo
    });
}

const actualizarImgCloudinary = async(req , res = response) =>{
    const {id,coleccion} = req.params;

    let modelo = '';
    
    switch (coleccion) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    });
                }
        break;
        
        case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    });
                }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            });
    }
  
    //Verificamos si existe una imagen
    if(modelo.img){

        //Separamos el enlace en un arreglo separado por el /
        const nombreArr = modelo.img.split('/');
        
        //Obtenemos el ultimo registro
        const nombre = nombreArr[nombreArr.length - 1];
        
        //separamos en un arreglo separado por el . y obtenemos el id de la imagen
        const [publicID] =  nombre.split('.');
        
        //Borramos la imagen enviando el id
        await cloudinary.uploader.destroy(publicID);
    }

    //Desestructuramos la ruta en donde esta el contenido del archivo
    const {tempFilePath} = req.files.archivo;

    //Desestructuramos el enlace y guardamos la data en cloudinary
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    //Igualamos la propiedad img al enlace de cloudinary
    modelo.img = secure_url;

    //Guardamos la imagen
    await modelo.save();

    res.json({
        modelo
    });
} 

const mostrarImagen = async(req, res = response) => {

    const {id,coleccion} = req.params;

    let modelo = '';
    
    switch (coleccion) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    });
                }
        break;
        
        case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    });
                }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            });
    }
  
    //Verificamos si existe una imagen
    if(modelo.img){
    
        //Creamos el path en donde se encuentra la imagen
        const uploadPathImg = path.join(__dirname, '../uploads',coleccion,modelo.img);
        //Verificamos si existe el path
        if(fs.existsSync(uploadPathImg)){

            //Devolvemos la imagen con el path creado
           return res.sendFile(uploadPathImg);
          
        }
    }

    const pathNoImagen = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(pathNoImagen);
}

module.exports = {
    cargarArchivo,
    actualizarImg,
    mostrarImagen,
    actualizarImgCloudinary
}