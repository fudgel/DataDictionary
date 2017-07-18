var express = require('express');
var router = express.Router();
//var ctrlRegistry = require('../controllers/registry');
var ctrlMain        = require('../controllers/main');
var ctrlDataDictionary = require('../controllers/dataDictionary');

/* General pages */
router.get('/', ctrlMain.index);
router.get('/about', ctrlMain.about);

// Data Dictionary
router.get('/fields', ctrlDataDictionary.fieldList);
router.get('/fields/searchByName', ctrlDataDictionary.fieldListSearchByName);
router.get('/fields/searchByDescription/:nameregex', ctrlDataDictionary.fieldListSearchByDescription);
router.get('/fields/:id',ctrlDataDictionary.fieldDetail);

module.exports = router;
