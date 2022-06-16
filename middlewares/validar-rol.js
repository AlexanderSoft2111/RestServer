const { request, response } = require("express")

const esAdminRol = (req = request, res = response, next) =>{
    
    //Validamos si el usuario existe
    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se requiere validar el token primero'
        });
    }
    
    const {rol, nombre} = req.usuario;
    
    //Validamos si el usuario es administrador
    if(rol !== 'ADMIN_ROL'){
        return res.status(401).json({
            msg: `${ nombre } no es administrador`
        });
    }

    next();
}

const tieneRol = ( ...roles ) => {
    return (req = request, res = response, next) => {
        
       
        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se requiere validar el token primero'
            });
        }
        
         //Validamos si el usuario tiene un rol
        if(!roles.includes(req.usuario.rol)){
            
            return res.status(401).json({
                msg: `El usuario debe tener uno de estos roles ${ roles }`
            });

        }

        next();
    }
}

module.exports = {
    esAdminRol,
    tieneRol
}