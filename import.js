// Declare variables
var yaml = require('yamljs'),
    obj, defs, def, i, attributes, details,
    resource, attr, attrType, attrDesc, attrEnum, attrFormat, swaggerSpec, lifecycleStatus,
    dbRecords = '[', dbRecCount = 0,

    fs = require('fs'), 
    swaggerSpecFile,
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

// Determine the Swagger Spect file to load - default to sample SwaggerSpec if not provided 
if(config.debug){
    console.log('Arguments length is:'+process.argv.length);
    console.log('Arguments are:'+process.argv);
};
// If there is more than 2 arguments then assume it is the file name of the swagger spec to load
if (process.argv.length>2) {
    swaggerSpecFile = process.argv[2];
} else {
    swaggerSpecFile = 'PetStore.yaml';
}

if(config.debug){
    console.log('Attempting to load SwaggerSpec File:'+swaggerSpecFile);
};

// Check that file exists
if (!fs.existsSync(swaggerSpecFile)) {
    console.log('ERROR:Swagger Specification File Not Found:['+swaggerSpecFile+']');
    return 1;
}

// get filename to record source of field document
// Check for both cases of path [ / or \ ] and extrace filename
if (swaggerSpecFile.lastIndexOf('\\')>=0) {
    swaggerSpec = swaggerSpecFile.substring(swaggerSpecFile.lastIndexOf('\\')+1);
} else if ((swaggerSpecFile.lastIndexOf('/')>=0)){
    swaggerSpec = swaggerSpecFile.substring(swaggerSpecFile.lastIndexOf('/')+1);
// Else if just a filename, then capture
} else {
    swaggerSpec = swaggerSpecFile;
}

// read swagger (yaml) file
var swaggerJson = yaml.load(swaggerSpecFile);
// if succesfull load into data dictionary
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
        // Ignore 'Error', 'Request' or 'Response' classes
        if (resource.toUpperCase().toString().indexOf("ERROR")==-1 &&
            resource.toUpperCase().toString().indexOf("RESPONSE")==-1 &&
            resource.toUpperCase().toString().indexOf("REQUEST")==-1) {

            attributes = defs[resource];
            // for each field, get name, type, desc
            for(var key in attributes["properties"])
            {
                attrType = attributes.properties[key].type;
                (attributes.properties[key].description) ? attrDesc = attributes.properties[key].description : attrDesc = "";
                (attributes.properties[key].format) ? attrFormat = attributes.properties[key].format : attrFormat = "";
                attr = key;
                //(attributes.properties[key].enum) ? attrEnum = attributes.properties[key].enum : attrEnum = "";
                if (attributes.properties[key].enum) {
                    console.log('Enumerations for field ['+key+']: '+attributes.properties[key].enum);
                    attrEnum = '[';
                    attributes.properties[key].enum.forEach(function(element) {
                        attrEnum = attrEnum + '"'+element+'",';
                    }, this);
                    attrEnum = attrEnum.slice(0,-1)+']';
                    console.log('Printed ENUM is -->'+attrEnum+'<--');
                } else {
                     attrEnum = "[]";
                }
                // If debug - print the JSON object constructed that will be consumed by MongoDB Client
                if(config.debug){
                    console.log("db.fields.insert({fieldName:\""+attr+
                            "\",description:\""+attrDesc+
                            "\",type:\""+attrType+
                            "\",typeFormat:\""+attrFormat+
                            "\",enum:"+attrEnum+
                            ",lifecycleStatus:\"Active"+
                            "\",resources:\""+resource+
                            "\",swaggerSpec:\""+swaggerSpec+"\"})");
                };
                
                // Need to inject initial prefix for JSON if records are to be loaded
                if(dbRecCount>0){
                    dbRecords = dbRecords+","
                };            
                dbRecords = dbRecords +
                            "{\"fieldName\":\""+attr+
                            "\",\"description\":\""+attrDesc+
                            "\",\"type\":\""+attrType+
                            "\",\"typeFormat\":\""+attrFormat+
                            "\",\"enum\":"+attrEnum+
                            ",\"lifecycleStatus\":\"Acitve"+
                            "\",\"resources\":\""+resource+
                            "\",\"swaggerSpec\":\""+swaggerSpec+"\"}";
                dbRecCount = dbRecCount+1;
            }
        }
    }
    // Close out the JSON object with ] character
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
