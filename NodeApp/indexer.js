const esIndexManager = require('./esIndexManager');
const jsonDataLoader = require('./jsonDataLoader');
const propertiesReader = require('properties-reader');
const properties = propertiesReader('app.properties');
const cronJob = require('cron').CronJob;
const path = require('path');
const fs = require('fs');

//the dev ECE uses a self signed cert so disable this Nodejs setting
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

let indexManager = new esIndexManager(properties.get('es.indexname'), properties.get('appsearch.enginename'));

var job = new cronJob(properties.get('cron.frequency'), function() {
        console.log('Cron job started');
        processDirectory();
}, null, true, properties.get('cron.timezone'));
//job.start();

function processDirectory(){
    var jsonDir = properties.get('json.dir');
    var processedDir = properties.get('json.processeddir');

    //read the directory
    fs.readdir(jsonDir, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        
        //process json files and move them after that
        files.forEach(function (file) {
            var preProcessedFile =  jsonDir + "\\" + file;
            var postProcessedFile = processedDir + "\\" + file;
            console.log("Processing file: " + preProcessedFile); 
            
            if(path.extname(file) == '.json'){
                exportJsonToAppSearch(preProcessedFile);
                moveFile(preProcessedFile, postProcessedFile);
            }
        });
    });
}

function exportJsonToAppSearch(file){
    let documents = jsonDataLoader.loadJsonFile(file);

    for(const doc of documents){
        console.log(doc);
        indexManager.addDocumentToAppSearch(doc);
    }
}

function exportJsonToEs(file){
    let documents = jsonDataLoader.loadJsonFile(file);
    
    for (const doc of documents) {
        console.log('doc: ',JSON.stringify(doc));
        indexManager.addDocument(null, "_doc", JSON.stringify(doc));
    }
}

function moveFile(sourcePath,destPath){
    fs.rename(sourcePath, destPath, function (err) {
        if (err){
            return console.log('Unable to move file: ' + err);
        }
        console.log('Successfully moved to: ' + destPath);
      }
    )
}