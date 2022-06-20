const {Schema, model} = require('mongoose');

const categoriaSchema = Schema({
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
    }
});

//Funcion para eliminar los datos que no queremos reflejar en la respuesta
//se hace con una funcion normal para poder referencia con el this.toObject al objeto del usuario
categoriaSchema.methods.toJSON = function() {

    //Desestructuramos los valores que no queremos y con el operador express unimos las otras porpiedas en otro objeto
    const {__v, estado,...data} = this.toObject();
    return data;
}


module.exports = model('Categoria',categoriaSchema);