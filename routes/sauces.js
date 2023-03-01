const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

// POST, PUT, DELETE, GET
router.post('/', saucesCtrl.createSauce);
router.put('/:id', saucesCtrl.modifySauce);
router.delete('/:id', saucesCtrl.deleteSauce);
router.get('/:id', saucesCtrl.getOneSauce);
router.get('/', saucesCtrl.getAllSauces);

module.exports = router;