const { Router } = require('express');
const { check } = require('express-validator');
const { crearUser, loginUser, validarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


//crear nuevo usuario
router.post('/new', [
    check('name', 'el campo nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').isLength({min: 6}),
    validarCampos
],crearUser );


//login de usuario
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').isLength({min: 6}),
    validarCampos
],loginUser)


//validar token
router.get('/renew',validarJWT ,validarToken )






module.exports = router;
