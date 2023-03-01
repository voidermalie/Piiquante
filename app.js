// -----------------------------------------Express------------------------------------------------- 
const express = require('express');                             //importer express

const app = express();              //appeler cette méthode permet de créer une app Express

//----------------------------------------Middlewares----------------------------------------------

app.use(express.json()); //intercèpte toutes les requêtes ayant pour content-type: json et met à disp pour l'objet requête

//-------------------------------------handle CORS error ----------------------------------------------------
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// ------------------------------------------ROUTES-----------------------------------------------
const saucesRoutes = require('./routes/sauces');
// définit l'URL d'API pour les middlewares
app.use('/api/sauces', saucesRoutes);

module.exports = app; // exporter pour y accéder depuis les autres fichiers, notamment le serveur node

// ----------------------------------------MongoDB------------------------------------------------- 
// Connexion à la base de données
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://voidermalie:LegjobbKiscica8@cluster0.qo1kyve.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
