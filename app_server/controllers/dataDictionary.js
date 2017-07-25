var request = require('request');
var common = require('./main');

var component = "AppServer.Controller.DataDictionary.";

var getFieldInfo = function (req, res, callback) {
  var requestOptions, path;
  path = "/api/fields/" + req.params.id;
  common.trace("DEBUG:"+component+"getFieldInfo","Invoked using Path=("+path+")");
  requestOptions = {
    url : common.apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {
        callback(req, res, data);
      } else {
        common.showError(req, res, response.statusCode);
      }
    }
  );
};

var renderFieldDetailPage = function (req, res, fieldDetail) {
  common.trace("DEBUG:"+component+"renderFieldDetailPage","Invoked");
  res.render('field-detail', {
    title: fieldDetail.fields.resources+":"+fieldDetail.fields.fieldName ,
    pageHeader: {title: fieldDetail.fields.resources+":"+fieldDetail.fields.fieldName},
    sidebar: {
      context: 'TBC'
    },
    fieldDocument: fieldDetail.fields,
  });
};

var getFieldList = function (req, res, callback) {
  var requestOptions, path;
  path = "/api/fields";
  common.trace("DEBUG:"+component+"getFieldList","Invoked using Path=("+path+")");
  requestOptions = {
    url : common.apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      common.trace("DEBUG:"+component+"getFieldList","Response=("+response.statusCode+")");
      var data = body;
      if (response.statusCode === 200) {
        common.trace("DEBUG:"+component+"getFieldList","data=("+data+")");
        callback(req, res, data);
      } else {
        common.trace("ERROR:"+component+"getFieldList","response status=("+response.statusCode+")");
        common.showError(req, res, response.statusCode);
      }
    }
  );
};

var getFieldListSearchByName = function (req, res, callback) {
  var requestOptions, path;
  var nameregex = req.param('name');
  common.trace("DEBUG:"+component+"getFieldListSearchByName","Parameters - 'nameregex'=("+nameregex+")");
  path = "/api/fields/searchByName/"+nameregex;
  common.trace("DEBUG:"+component+"getFieldListSearchByName","Invoked with Path=("+path+")");
  requestOptions = {
    url : common.apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      //console.log(data);
      if (response.statusCode === 200) {
        callback(req, res, data);
      } else {
        common.showError(req, res, response.statusCode);
      }
    }
  );
};

var getFieldListSearchByDescription = function (req, res, callback) {
  var requestOptions, path;
  path = "/api/fields/searchByDescription/" + req.params.nameregex;
  common.trace("DEBUG:"+component+"getFieldListSearchByDescription","Invoked with Path=("+path+")");
  requestOptions = {
    url : common.apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      //console.log(data);
      if (response.statusCode === 200) {
        callback(req, res, data);
      } else {
        common.showError(req, res, response.statusCode);
      }
    }
  );
};

var renderFieldListPage = function (req, res, fieldList) {
  common.trace("DEBUG:"+component+"renderFieldListPage","FieldList Object ("+fieldList+")");
  res.render('field-list', {
    title: 'Field List',
    pageHeader: {title: 'Field List'},
    sidebar: {
      context: 'TBC'
    },
    // .fields is defined in the Mongoose schema in app_api/models/dataDictionary.js
    fieldDocuments: fieldList.fields,
  });
};

/* GET Full 'Field List' page */
module.exports.fieldList = function(req, res){
  common.trace("DEBUG:"+component+"fieldList","Invoked");
  getFieldList(req, res, function(req, res, responseData) {
    renderFieldListPage(req, res, responseData);
  });
};

/* GET search by name for 'Field List' page */
module.exports.fieldListSearchByName = function(req, res){
  common.trace("DEBUG:"+component+"fieldListSearchByName","Invoked");
  getFieldListSearchByName(req, res, function(req, res, responseData) {
    renderFieldListPage(req, res, responseData);
  });
};

/* GET search by description for 'Field List' page */
module.exports.fieldListSearchByDescription = function(req, res){
  common.trace("DEBUG:"+component+"fieldListSearchByName","Invoked");
  getFieldListSearchByDescription(req, res, function(req, res, responseData) {
    renderFieldListPage(req, res, responseData);
  });
};

/* GET 'Field Detail' page */
module.exports.fieldDetail = function(req, res){
  common.trace("DEBUG:"+component+"fieldDetail","Invoked");
  getFieldInfo(req, res, function(req, res, responseData) {
    renderFieldDetailPage(req, res, responseData);
  });
};