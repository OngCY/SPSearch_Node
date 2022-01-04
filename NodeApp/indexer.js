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

let indexManager = new esIndexManager(properties.get('name.indexenginesource'));

/* 
//cron job
let job = new cronJob(properties.get('cron.frequency'), function() {
        //logger.info("Cron job started");
        console.log('Cron job started');
        processDirectory();
}, null, true, properties.get('cron.timezone'));
job.start();
*/

processDirectory();

function processDirectory(){
    let jsonDir = properties.get('json.dir');
    let processedDir = properties.get('json.processeddir');

    console.log('Job started. Processing directory');
    logger.info('Job started. Processing directory');

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
           
            if(path.extname(file) == '.json'){
                exportJsonToElastic(preProcessedFile);
                moveFile(preProcessedFile, postProcessedFile);
            }
        });
    });
}

function exportJsonToElastic(file){
    const productType = properties.get('elastic.product');
    let document = jsonDataLoader.loadJsonFile(file);
    
    //for workplace search only, which requires an array
    let documentArray = [];
    documentArray.push(document);

    switch(productType){
        case "es":
            for (const doc of document) {
                logger.info(JSON.stringify(doc));
                console.log(JSON.stringify(doc));
                indexManager.addDocument(null, "_doc", JSON.stringify(doc));
            }
            break;
        
        case "as":
            logger.info(JSON.stringify(document));
            console.log(JSON.stringify(document));
            indexManager.addDocumentToAppSearch(document);
            break;

        case "ws":
            logger.info(JSON.stringify(documentArray));
            console.log(JSON.stringify(documentArray));
            indexManager.addDocumentToWPSearch(documentArray);
            break;

        default:
            logger.error("Product type not supported");
            console.log("Product type not supported");
    }
}

function moveFile(sourcePath,destPath){
    fs.rename(sourcePath, destPath, function (err) {
        if (err){
            logger.error('Unable to move file: ' + err);
            return console.log('Unable to move file: ' + err);
        }

        logger.info('Moved to: ' + destPath);
        console.log('Moved to: ' + destPath);
      }
    )
}