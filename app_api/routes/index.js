var express = require('express');
var router = express.Router();
var ctrlDataDictionary = require('../controllers/dataDictionary');

// Data Dictionary
router.get('/fields', ctrlDataDictionary.fieldListRead);
router.get('/fields/searchByName/:nameregex', ctrlDataDictionary.fieldSearchByNameListRead);
router.get('/fields/searchByDescription/:nameregex', ctrlDataDictionary.fieldSearchByDescriptionListRead);
router.get('/fields/:id',ctrlDataDictionary.fieldReadOne);

module.exports = router;
