//Importacion del esquema y el modelo de mongoose
const {Schema, model} = require('mongoose');

//Declaracion del schema
const usuarioSchema = Schema({
    nombre: {
        //El tipo de dato
        type: String,
        //Para indicarle que es obligatorio y el msg que debe dar en caso de que no lo coloquen
        required: [true, 'El nombre es requerido']
    },
    correo: {
        type: String,
        required: [true, 'El correo es requerido'],
        //Le indicamos que debe ser unico
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        //Para verificar que permita una de las opsiones
        emun: ['ADMIN_ROLE','USER_ROLE']
    },
    estado: {
        type: Boolean,
        //El valor por defecto
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

//Funcion para eliminar los datos que no queremos reflejar en la respuesta
//se hace con una funcion normal para poder referencia con el this.toObject al objeto del usuario
usuarioSchema.methods.toJSON = function() {

    //Desestructuramos los valores que no queremos y con el operador express unimos las otras porpiedas en otro objeto
    const {__var, password, ...usuario} = this.toObject();
    return usuario;
}

//Exportacion del esquema utilizando el model, hay que colocar el nombre del esquema en sigular para que lo pase a plural
module.exports = model( 'Usuario', usuarioSchema);

