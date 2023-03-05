const dotenv = require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();              //appeler cette méthode permet de créer une app Express

//----------------------------------------Middlewares----------------------------------------------

app.use(cors({
  origin: '*'
}));
app.use(express.json()); //intercèpte toutes les requêtes ayant pour content-type:json et met à disp pour l'objet 'requête'
app.use(helmet());

// ------------------------------------------ROUTES-----------------------------------------------

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');

// définit l'URL d'API pour les middlewares
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


// ----------------------------------------MongoDB------------------------------------------------- 

// Connexion à la base de données
const mongoose = require('mongoose');
mongoose.set('strictQuery', false); //to avoid error message in console
mongoose.connect(process.env.DATABASE_URL,
    {useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Export app
module.exports = app;

/*
// manual CORS error handling
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
*/