// Declare variables
var yaml = require('yamljs'),
    obj, defs, def, i, attributes, details,
    resource, attr, attrType, attrDesc, attrEnum, attrFormat, swaggerSpec, lifecycleStatus,
    dbRecords = '[', dbRecCount = 0,

    fs = require('fs'), 
    configurationFile = 'config.json',
    dbURI,
    test = require('assert'),
    MongoClient = require('mongodb').MongoClient;

// load config file to get mongodb config
var config = JSON.parse(
    fs.readFileSync(configurationFile)
);
// mongodb://localhost:27017/test
dbURI = 'mongodb://'+config.server+':'+config.port+'/'+config.database;
if(config.debug){
    console.log('dbURI:'+dbURI);
};        

// Load yaml file using YAML.load 
var file = 'PetStore.yaml';
var swaggerJson = yaml.load(file);
// get filename to record source of field document
swaggerSpec = file;
if (swaggerJson){
        loadDataDictionary(null,swaggerJson);
};

function loadDataDictionary(err, data) {
    if (err) throw err
    // just get definitions of types
    defs = data.definitions;

    // for each class
    for (var def in defs)
    {
        // resource name
        resource = def;
        // Ignore 'Error' class
        if (resource!="Error" && resource!="ErrorModel") {
            attributes = defs[resource];
            // for each field, get name, type, desc
            for(var key in attributes["properties"])
            {
                attrType = attributes.properties[key].type;
                (attributes.properties[key].description) ? attrDesc = attributes.properties[key].description : attrDesc = "";
                (attributes.properties[key].format) ? attrFormat = attributes.properties[key].format : attrFormat = "";
                attr = key;
                (attributes.properties[key].enum) ? attrEnum = attributes.properties[key].enum : attrEnum = "";
                if(config.debug){
                    console.log("db.fields.insert({fieldName:\""+attr+
                            "\",description:\""+attrDesc+
                            "\",type:\""+attrType+
                            "\",typeFormat:\""+attrFormat+
                            "\",enum:\""+attrEnum+
                            "\",lifecycleStatus:\"Active"+
                            "\",resources:\""+resource+
                            "\",swaggerSpec:\""+swaggerSpec+"\"})");
                };
                
                if(dbRecCount>0){
                    dbRecords = dbRecords+","
                };            
                dbRecords = dbRecords +
                            "{\"fieldName\":\""+attr+
                            "\",\"description\":\""+attrDesc+
                            "\",\"type\":\""+attrType+
                            "\",\"typeFormat\":\""+attrFormat+
                            "\",\"enum\":\""+attrEnum+
                            "\",\"lifecycleStatus\":\"Acitve"+
                            "\",\"resources\":\""+resource+
                            "\",\"swaggerSpec\":\""+swaggerSpec+"\"}";
                dbRecCount = dbRecCount+1;
            }
        }
    }
    dbRecords = dbRecords+"]";
    if(dbRecCount>0){
        console.log("Preparing to load "+dbRecCount+" records into DB");
        if(config.debug){
            console.log(dbRecords);   
        }
    } else {
        console.log("NO RECORDS to load");
    }
    // if loadIntoDB - then connect to Mongo and insert the JSON array
    if(config.loadIntoDB){
        var dbData = JSON.parse(dbRecords);
        if(config.debug) {
            console.log(dbData);
        }
        MongoClient.connect(dbURI, function(err, db) {
            // Get the collection
            var col = db.collection("fields");
            col.insertMany(dbData, function(err, r) {
                test.equal(null, err);
                test.equal(dbRecCount, r.insertedCount);
                // Finish up test
                db.close();
                console.log("Successfully loaded "+dbRecCount+
                            " records into the \'fields"+
                            "\' collection in the \'"+config.database+"\' database");
            });
        });
    }
}

return 0;
