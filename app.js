// ----------------------------------------Express------------------------------------------------- 
const express = require('express'); //importer express

const app = express(); //appeler la méthode permet de créer une app Express

app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({ message : 'Votre requête a bien été reçue !'});
    next();
});

app.use((req, res) => {
    console.log('Réponse envoyée avec succès !');
});

module.exports = app; // exporter pour y accéder des autres fichiers, notamment le serveur node

// ----------------------------------------MongoDB------------------------------------------------- 
// Connexion à la base de données
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://voidermalie:LegjobbKiscica8@cluster0.qo1kyve.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));