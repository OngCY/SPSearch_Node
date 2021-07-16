const fs = require('fs');
const logger = require('./logger');


class JsonDataLoader {

    //Read data from json file to Queue
    loadJsonFile(jsonFileName) {
        console.log('Loading json file started.');
        logger.info('Loading json file started.');

        let jsonData = fs.readFileSync(jsonFileName);
        let documents = JSON.parse(jsonData);
        
        //decode txt attachment base64 to text 
        for(var i = 0; i < documents.length; i++) {
            var attachment64 = documents[i].attachment_base64;
            const attachmentTxt = Buffer.from(attachment64, 'base64').toString(); 
            documents[i].attachment_base64 = attachmentTxt;
            
            console.log(attachmentTxt);
            logger.info('Decoded b64 attachment: ' + attachmentTxt);
        }

        fs.writeFileSync(jsonFileName, JSON.stringify(documents));
        
        return documents;
    }
}

module.exports = new JsonDataLoader();  