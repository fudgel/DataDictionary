var mongoose = require('mongoose');
var DDFields = mongoose.model('Fields');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* GET data dictionary item details by the data dictionary  id */
module.exports.fieldReadOne = function(req, res) {
 if (req.params.id) {
   DDFields.findOne({"_id":req.params.id}, function (err, fields) {
     console.log(fields);
     if(!fields) {
       sendJSONresponse(res, 404, {"message":"Application record for id("+req.params.id+") not found"});
       return;
     } else if (err) {
       sendJSONresponse(res, 404, err);
       return;
     }
     sendJSONresponse(res, 200, {fields});
   });
 } else {
   sendJSONresponse(res, 404, {"message":"No id parameter"});
 }
};

/* GET data dictionary list by the name */
module.exports.fieldSearchByNameListRead = function(req, res) {
 if (req.params.nameregex) {
   DDFields.find({'qualifiedName' : new RegExp(req.params.nameregex, 'i')}, function (err, fields) {
     console.log(fields);
     if(!fields) {
       sendJSONresponse(res, 404, {"message":"Field record for fieldId("+req.params.fieldId+") not found"});
       return;
     } else if (err) {
       sendJSONresponse(res, 404, err);
       return;
     }
     sendJSONresponse(res, 200, {fields});
   });
 } else {
   sendJSONresponse(res, 404, {"message":"No fieldId parameter"});
 }
};

/* GET data dictionary list by the name */
module.exports.fieldSearchByDescriptionListRead = function(req, res) {
 if (req.params.nameregex) {
   DDFields.find({'description' : new RegExp(req.params.nameregex, 'i')}, function (err, fields) {
     console.log(fields);
     if(!fields) {
       sendJSONresponse(res, 404, {"message":"Field record with description containing fieldId("+req.params.fieldId+") not found"});
       return;
     } else if (err) {
       sendJSONresponse(res, 404, err);
       return;
     }
     sendJSONresponse(res, 200, {fields});
   });
 } else {
   sendJSONresponse(res, 404, {"message":"No fieldId parameter"});
 }
};

/* GET data dictionary list */
module.exports.fieldListRead = function(req, res) {
   DDFields.find({}, function (err, fields) {
     console.log(fields);
     if(!fields) {
       sendJSONresponse(res, 404, {"message":"No data dictionary records found"});
       return;
     } else if (err) {
       sendJSONresponse(res, 404, err);
       return;
     }
     sendJSONresponse(res, 200, {fields});
   })
};