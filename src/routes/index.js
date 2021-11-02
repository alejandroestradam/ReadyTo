const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const { resolveSoa } = require('dns');

const User = require('../models/user');
const property = require('../models/property');


// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//  GET
router.get('/',(req, res, next) => {
    res.render('index.ejs');
})
router.get('/src/views/register.ejs',(req, res, next) => {
    const errors = [];
    res.render('register.ejs',{errors});
})
router.get('/src/views/addproperty.ejs',(req, res, next) => {
    const errors = [];
    res.render('addproperty.ejs',{errors});
})
router.get('/src/views/login.ejs',(req, res, next) => {
    res.render('login.ejs');
    res.sendFile(path.join(process.cwd(), 'src/views/login.html'));
})
router.get('/src/views/properties.ejs', async(req, res, next) => {
    const properties = await property.aggregate(
        [{$sample: { size: 20}}]
     );
    res.render('properties.ejs',{properties});
})


//   POST
router.post('/src/views/register.ejs', urlencodedParser, async(req, res) =>{
    const {username, email, password, confirm_password} = req.body;
    const errors = [];
    const succes = [{text: "Usuario registrado exitosamente"}];
    if (email.length <= 0){errors.push({text: "Introduce tu email"})}
    if (password.length <= 0){errors.push({text: "Introduce tu contraseña"})}
    if (password != confirm_password) {
      errors.push({text: "Las contraseñas no coinciden"});
    }
    if (password.length < 5){
        errors.push({text: "La contraseña debería de tener al menos 4 caracteres"})
    }
    if (errors.length > 0){
        res.render('register.ejs', {username, errors, email, password});
    } else{
        const emailUser = await User.findOne({email: email});
        console.log("emailUser:" + emailUser);
        if(emailUser){
            errors.push({text: "El correo ya está registrado"});
            res.render('register.ejs', {username, errors, email, password});
        }else{
        const newUser = new User ({username, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        console.log(newUser);
        errors.push({text: "Usuario registrado"});
        res.render('register.ejs', {username, errors, email, password});
        }
    }
});

router.post('/src/views/login.ejs', urlencodedParser, async(req, res) =>{ 
    const {email, password} = req.body;
    const errors =[];
    if (email.length <= 0){errors.push({text: "Introduce tu email"})}
    if (password.length <= 0){errors.push({text: "Introduce tu contraseña"})}
    if (errors.length > 0){
        res.render('login.ejs', {errors, email, password});
    } else{
        const emailUser = await User.findOne({email: email});
        const passwordUser = await User.findOne({password: password});
        console.log("emailUser:" + emailUser);
        if(emailUser && passwordUser){

        }else{
        const newUser = new User ({username, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        console.log(newUser);
        errors.push({text: "Usuario registrado"});
        res.render('register.ejs', {username, errors, email, password});
        }
    }
});

router.post('/src/views/addproperty.ejs', urlencodedParser, async(req, res) =>{
    const {name, property_type, room_type, bedrooms, beds, bathrooms, price} = req.body;
    const errors = [];
    if (name.length <= 0){errors.push({text: "Introduce el nombre de la propiedad"})}
    if (property_type.length <= 0){errors.push({text: "Introduce el tipo de propiedad"})}
    if (room_type.length <= 0){errors.push({text: "Introduce el tipo de cuarto"})}
    if (bedrooms.length <= 0){errors.push({text: "Introduce la cantidad de cuartos"})}
    if (beds.length <= 0){errors.push({text: "Introduce la cantidad de camas"})}
    if (bathrooms.length <= 0){errors.push({text: "Introduce la cantidad de baños"})}
    if (price.length <= 0){errors.push({text: "Introduce el precio"})}
    if(errors.length>0){
        res.render('addproperty.ejs', {errors, name, property_type, room_type, bedrooms, beds, bathrooms, price});
    }else{
    const newProperty = new property ({name, property_type, room_type, bedrooms, beds, bathrooms, price});
    await newProperty.save();
    console.log(newProperty);
    errors.push({text: "Propiedad Creada Correctamente"});
    res.render('addproperty.ejs', {errors, name, property_type, room_type, bedrooms, beds, bathrooms, price});
    }
});

// Export modules
module.exports = router;