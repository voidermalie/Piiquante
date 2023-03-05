const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Hachage du mot de passe de l'utilisateur, création et ajout de l'utilisateur à la base de données.
exports.signup = (req, res, next) => {
    //console.log(req.body) //res.json(req.body);
    bcrypt.hash(req.body.password, 10)
          .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
              .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
              .catch(error => res.status(400).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
};

/*
Vérification des informations d'identification de l'utilisateur,
renvoie l'_id de l'utilisateur depuis la base de données et un token web JSON signé
(contenant également l'_id de l'utilisateur)
*/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //objet de filtre "email" sur la classe User
        .then(user => {
            if (!user) {
                res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id},
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '24h'}
                                )
                            });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    });
            }
        })
        .catch(error => res.status(500).json({ error }));
};