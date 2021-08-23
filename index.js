const express = require('express')
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./database/config');
require('dotenv').config()





//crear servidor/app de express

const app = express();

//conexion DB
dbConnection();

//Directorio publico
app.use( express.static('public') )

//cors
app.use( cors() );

//lectura y parseo del body
app.use( express.json() )


// Rutas

app.use( '/api/auth', require('./routes/auth') )

//manejar rutas
app.get( '*', (req, res) => {
    res.sendFile( path.resolve(__dirname, 'public/index.html') )
} )



app.listen(process.env.PORT, () => {
    console.log(`servidor corriendo en ${ process.env.PORT }`);
    
})



