const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') //null= indiquer pas d'erreur + dossier
    },
    filename: (req, file, callback) => { //générer nom de fichier unique
        const name = file.originalname.split(' ').join('_'); //split crée espace et join remplace par underscore
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');