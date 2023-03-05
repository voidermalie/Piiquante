const express = require('express');
const cors = require('cors');

const app = express();              //appeler cette méthode permet de créer une app Express

//----------------------------------------Middlewares----------------------------------------------
//----CORS package
app.use(cors({
  origin: '*'
}));

//intercèpte toutes les requêtes ayant pour content-type:json et met à disp pour l'objet 'requête'
app.use(express.json()); 


/*
//-------------------------------------handle CORS error ----------------------------------------------------
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
*/

// ------------------------------------------ROUTES-----------------------------------------------
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');

// définit l'URL d'API pour les middlewares
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// ----------------------------------------MongoDB------------------------------------------------- 
// Connexion à la base de données
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://voidermalie:GoFullStackP6MongoDB@cluster0.qo1kyve.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Export app
module.exports = app;