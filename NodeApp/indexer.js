const esIndexManager = require('./esIndexManager');
const jsonDataLoader = require('./jsonDataLoader');
const logger = require('./logger');
const propertiesReader = require('properties-reader');
const properties = propertiesReader('app.properties');
const cronJob = require('cron').CronJob;
const path = require('path');
const fs = require('fs');

//the dev ECE uses a self signed cert so disable this Nodejs setting
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

let indexManager = new esIndexManager(properties.get('es.indexname'), properties.get('appsearch.enginename'));

/* //cron job
let job = new cronJob(properties.get('cron.frequency'), function() {
        //logger.info("Cron job started");
        console.log('Cron job started');
        processDirectory();
}, null, true, properties.get('cron.timezone'));
job.start();*/

console.log('Job started');
processDirectory();

function processDirectory(){
    let jsonDir = properties.get('json.dir');
    let processedDir = properties.get('json.processeddir');

    //read the directory
    fs.readdir(jsonDir, function (err, files) {
        if (err) {
            logger.error("Unable to scan directory: " + err);
            return console.log('Unable to scan directory: ' + err);
        } 
        
        //process json files and move them after that
        files.forEach(function (file) {
            let preProcessedFile =  jsonDir + "\\" + file;
            let postProcessedFile = processedDir + "\\" + file;
            console.log("Processing file: " + preProcessedFile);
            logger.info("Processing file: " + preProcessedFile);
            
            if(path.extname(file) == '.json'){
                exportJsonToAppSearch(preProcessedFile);
                //exportJsonToEs(preProcessedFile);
                moveFile(preProcessedFile, postProcessedFile);
            }
        });
    });
}

function exportJsonToAppSearch(file){
    let document = jsonDataLoader.loadJsonFile(file);

    indexManager.addDocumentToAppSearch(document);
}

function exportJsonToEs(file){
    let documents = jsonDataLoader.loadJsonFile(file);
    
    for (const doc of documents) {
        logger.info(JSON.stringify(doc));
        console.log(JSON.stringify(doc));
        indexManager.addDocument(null, "_doc", JSON.stringify(doc));
    }
}

function moveFile(sourcePath,destPath){
    fs.rename(sourcePath, destPath, function (err) {
        if (err){
            logger.error('Unable to move file: ' + err);
            return console.log('Unable to move file: ' + err);
        }

        logger.info('Successfully moved to: ' + destPath);
        console.log('Successfully moved to: ' + destPath);
      }
    )
}