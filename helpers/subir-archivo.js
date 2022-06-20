const path = require('path');
const {v4: uuidv4} = require('uuid')

const subirArchivo = (files, extensiones = ['png','jpg','jpeg','gif','JPG'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        
    // Desestructuramos el archivo que viene del file y le indicamos en donde debe guardarse
    const {archivo} = files;

    //Cortamos el nombre por el caracter de punto
    const nombreCortado = archivo.name.split('.');

    //Luego obtemos la extension del nombre cortado en la ultima posición
    const extension = nombreCortado[nombreCortado.length - 1];


    //Validamos si la extención existe en el arrego
    if(!extensiones.includes(extension)){

        return reject(`La extensión ${extension} no es válida`);
        
    }

    //Concatenamos el id creado mas la extensión
    const nombreTemp = uuidv4() + '.' + extension;

    const uploadPath = path.join( __dirname, '../uploads',carpeta, nombreTemp);
  
    // con el método mv le decimos que guarde el archivo en la ruta y hacemos la validación en caso que haya un error
    archivo.mv(uploadPath, (err) => {
      if (err){

          console.log(err)
          return reject({err});
          
      }
  
      resolve(nombreTemp);

    });
    })
}

module.exports = {
    subirArchivo
}