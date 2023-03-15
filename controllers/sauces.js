const Sauce = require('../models/Sauce');
const fs = require('fs'); //pour modifier le système de fichiers

// GET ONE
exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// GET ALL
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// POST - create sauce
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);

    delete sauceObject._id;
    delete sauceObject._userId;

    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });

    sauce.save()
         .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
         .catch(error => res.status(400).json({ error }));
};

//PUT - modify sauce
exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete sauceObject._userId;

    Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
        if (sauce.userId !== req.auth.userId) {
          res.status(403).json({ message: 'Non autorisé' });
        } else {
          // Supprimer l'ancienne image avant d'enregistrer la nouvelle
          const filename = sauce.imageUrl.split('images/')[1];
          fs.unlink(`images/${filename}`, () => { //fs unlink => méthode asynchrone
          // Enregistrer l'image
          Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Objet modifié' }))
            .catch(error => res.status(401).json({ error }));
          });
        }
      })
      .catch(error => res.status(400).json({ error }));
};

// DELETE
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: 'Non autorisé' })
      } else {
        const filename = sauce.imageUrl.split('images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {res.status(200).json({ message: 'Objet supprimé !'})})
            .catch(error => res.status(401).json({ error }))
        });
      }
    }))
    .catch(error => res.status(500).json({ error }))
};

// LIKE (POST)
exports.likeSauce = (req, res) => {
  const userId = req.auth.userId;
  const like = req.body.like;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce => {
      if (!sauce) {
        res.status(404).json({ message: 'Sauce non trouvé !' })
        return;
      }
      switch (like) {

        case 1: //User likes the sauce
          sauce.likes += 1;
          sauce.usersLiked.push(userId);
          break;

        case -1: //User dislikes the sauce
          sauce.dislikes += 1;
          sauce.usersDisliked.push(userId);
          break;

        case 0: //User cancels like/dislike
          const indexLiked = sauce.usersLiked.indexOf(userId); //returns index
          if (indexLiked !== -1) { // = user exists in list
            sauce.likes -= 1;
            sauce.usersLiked.splice(indexLiked, 1);
          }
          const indexDisliked = sauce.usersDisliked.indexOf(userId);
          if (indexDisliked !== -1) {
            sauce.dislikes -= 1;
            sauce.usersDisliked.splice(indexDisliked, 1);
          }
        break;
        default:
            res.status(400).json({ message: 'Invalid like value' });
            return;
      }
      sauce
        .save()
        .then(() => res.status(200).json({ message: 'Sauce updated successfully' }))
        .catch(error => res.status(500).json({ error }))
    }))
    .catch(error => res.status(500).json({ error }))
};