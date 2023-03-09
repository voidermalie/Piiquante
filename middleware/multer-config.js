const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') //null= indiquer pas d'erreur + dossier
    },
    filename: (req, file, callback) => { 
        //const name = file.originalname.replace(/[^\w\s]/gi, '_').replace(/\s+/g, '_'); 
        const extension = MIME_TYPES[file.mimetype];
        let name = file.originalname.split(' ').join('_')
        name = name.split("." + extension)[0]
        callback(null, name + '_' + Date.now() + '.' + extension);
    }
});

/*
const fileFilter = (req, file, cb) => {
    const isValidType = file.mimetype === 'image/jpg' || file.mimetype === 'image/png';
    const isValidSize = file.size <= 1024 * 1024; // 1MB
  
    if (isValidType && isValidSize) {
      cb(null, true);
    } else {
      cb(null, false);
    }
};
*/

module.exports = multer({storage: storage}).single('image');