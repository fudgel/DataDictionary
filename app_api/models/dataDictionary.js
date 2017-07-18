var mongoose = require('mongoose');

var fieldsSchema = new mongoose.Schema({
    id: String,
    name: String,
    dataType: String,
    attributeName: String,
    description: String,
    lifecycleStatus: String,
    ecdmEntity: String,
    supercededBy: String,
    resources: [String],
    modelDomains: [String]
},{collection:'fields'});

mongoose.model('Fields', fieldsSchema);
