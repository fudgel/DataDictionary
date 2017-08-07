var mongoose = require('mongoose');

var fieldsSchema = new mongoose.Schema({
    fieldName: String,
    dataType: String,
    description: String,
    enum: [String],
    lifecycleStatus: String,
    resources: [String],
    swaggerSpec: String
},{collection:'fields'});

mongoose.model('Fields', fieldsSchema);
