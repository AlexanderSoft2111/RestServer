const {Schema, model} = require('mongoose');

const productoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        //Hacemos referencia la id del esquema de usuario
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        //Hacemos referencia la id del esquema de usuario
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {type: String},
    disponible: {type: Boolean, default: true}
});

//Funcion para eliminar los datos que no queremos reflejar en la respuesta
//se hace con una funcion normal para poder referencia con el this.toObject al objeto del usuario
productoSchema.methods.toJSON = function() {

    //Desestructuramos los valores que no queremos y con el operador express unimos las otras porpiedas en otro objeto
    const {__v, estado,...data} = this.toObject();
    return data;
}


module.exports = model('Producto',productoSchema);