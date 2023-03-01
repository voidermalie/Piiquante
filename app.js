// ----------------------------------------Express------------------------------------------------- 
const express = require('express');                             //importer express

const app = express();              //appeler cette méthode permet de créer une app Express

//----------------------------------------Middlewares----------------------------------------------

app.use(express.json()); //intercèpte toutes les requêtes ayant pour content-type: json et met à disp pour l'objet requête

//----handle CORS error --------------------------------------------------------------------------
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//importation du schéma sauce
const Sauce = require('./models/sauce');

// POST
app.post((req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
      ...req.body
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
});

// PUT (modification)
app.put('/api/sauces/:id', (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
});

// DELETE 
app.delete('/api/sauces/:id', (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
});

// GET
//Une sauce spécifique
app.get('/api/sauces/:id', (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
});

//Toutes les sauces
app.get('/api/sauces', (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
});

module.exports = app; // exporter pour y accéder depuis les autres fichiers, notamment le serveur node

// ----------------------------------------MongoDB------------------------------------------------- 
// Connexion à la base de données
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://voidermalie:LegjobbKiscica8@cluster0.qo1kyve.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));