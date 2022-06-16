const jwt = require('jsonwebtoken');

//Funcion para generar el JWT
const generaJWT = (uid = '') => {
    
    return new Promise((resolve, reject) => {
        
        //Indicamos los datos que tendran el payload
        const payload = {uid};
        
        //Le indicamos el payload, la clave de acceso y el tiempo de expiración
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '4h'
        },(err,token) => {
            
            //Le indicamos en caso de que sea error o correcto lo que tiene que devolver
            if(err){
                console.log(err);
               reject('No se pudo generar el token');
            } else {

                resolve(token);
            }
        });
    })
}

module.exports = {
    generaJWT
}