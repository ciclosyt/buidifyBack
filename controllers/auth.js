const {  response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



//crear nuevo usuario
const crearUser = async(req, res= response) => {

    
    const { name, email, password } = req.body;

    try {

     //verificar email

     const usuario = await Usuario.findOne({ email });

     if( usuario ) {
         return res.status(400).json({
             ok: false,
             msg: 'El user ya existe con ese email'
         })
     }

     //crear user con el modelo

    const dbUser = new Usuario( req.body );

    //Hashear la contraseña
     const salt = bcrypt.genSaltSync();
     dbUser.password = bcrypt.hashSync( password, salt )


    //generar JWT

    const token = await generarJWT( dbUser.id , name );


    // Crear user DB
    await dbUser.save();






    // generar respuesta exitosa
    return res.status(201).json({
        ok: true,
        uid: dbUser.id,
        name,
        email,
        token
    });
        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        });
        
    }

    
    
    

}

// login

const loginUser = async (req, res= response) => {

    

    const { email, password } = req.body

    try {

        const dbUser = await Usuario.findOne({ email });

        if( !dbUser ){
            return res.status(400).json({
                ok: false,
                msg: 'correo/password no existen'
            })
        }

        //Confirmar password hace match

        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'correo/password no existen'
            })
        }

        // Generar JWT

        const token = await generarJWT( dbUser.id , dbUser.name );

        //respuesta
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email,
            token
        })

        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
        
    }
    
    

    

}

// Validar token
const validarToken = async (req, res= response) => {

    const { uid } = req;

    //leer DB
    const dbUser = await Usuario.findById(uid);


    const token = await generarJWT( uid , dbUser.name );

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
        
    })

}





module.exports = {
    crearUser,
    loginUser,
    validarToken
}