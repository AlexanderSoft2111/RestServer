const Role = require('../models/role');
const Usuario = require('../models/usuario');

const rolEsValido = async(rol = '') => {

    //Preguntamos si el rol existe en el schema de la BD
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
            throw new Error(`El rol ingresado ${rol} no existe en la BD`)
    }
}

const emailExiste = async(correo = '') => {
    
    //Validamos que el correo no exista en la instancia que vamos a crear del schema
    const emailValidado = await Usuario.findOne({correo});
 
  //Devolvemos un mensaje de error
  if(emailValidado){
    throw new Error(`El email ingresado ${correo} ya existe en la BD`);
  }
 }

 //Validamos si existe el id en la bd de mongo
 const existeById = async(id = '') => {
    
    //Validamos que id exista enviandole el id
    const idExistente = await Usuario.findById(id);
 
  //Devolvemos un mensaje de error
  if(!idExistente){
    throw new Error(`No existe el id ${id} en la BD`);
  }
 }

module.exports = {
    rolEsValido,
    emailExiste,
    existeById
}