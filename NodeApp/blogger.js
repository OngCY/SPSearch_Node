const esIndexManager = require('./esIndexManager');
const jsonDataLoader = require('./jsonDataLoader');
const propertiesReader = require('properties-reader');
const properties = propertiesReader('app.properties');
const cronJob = require('cron').CronJob;
const path = require('path');
const fs = require('fs');


let indexManager = new esIndexManager(properties.get('es.indexname')); //set index

if(!indexManager.indexExists(properties.get('es.indexname')))
    indexManager.createIndex();

var job = new cronJob(properties.get('cron.frequency'), function() {
        console.log('Cron job started');
        processDirectory();
}, null, true, properties.get('cron.timezone'));
//job.start();

function processDirectory(){
    var directory = properties.get('json.dir');
    console.log("json dir: " + directory);

    //read the directory
    fs.readdir(directory, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        
        //process json files
        files.forEach(function (file) {
            var filename =  directory + "\\" + file;
            console.log("Processing file: " + filename); 
            
            if(path.extname(file) == '.json')
                importJsonData(filename);
        });
    });
}

function importJsonData(file){
    let documents = jsonDataLoader.loadJsonFile(file);
    
    for (const doc of documents) {
        console.log('doc: ',doc);
        indexManager.addDocument(null, "_doc", JSON.stringify(doc));
    }
}