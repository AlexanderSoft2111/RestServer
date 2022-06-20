const { response } = require("express");

const validarArchivo = (req, res = response, next) =>{

      //preguntamos si no esta vacio el archivo que se envia
      if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).send('No hay archivos que subir.');
        }

        next();

}

module.exports = {
    validarArchivo
}