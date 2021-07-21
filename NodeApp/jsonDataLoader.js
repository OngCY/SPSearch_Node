const fs = require('fs');
const logger = require('./logger');


class JsonDataLoader {

    //Read data from json file to Queue
    loadJsonFile(jsonFileName) {
        console.log('Processing json file: ' + jsonFileName);
        logger.info('Processing json file: ' + jsonFileName);

        let jsonData = fs.readFileSync(jsonFileName);
        let document = JSON.parse(jsonData);

        //decode txt attachment base64 to text 
        let attachment64 = document.attachment_base64;
        let attachmentURL = document.attachment_url;
        let attachmentTxt;
            
        //some docs have not have attachments
        if(attachmentURL == null)
            attachmentURL = "";
         
        if(attachment64 == null)
            attachmentTxt = "";
        else
            attachmentTxt = Buffer.from(attachment64, 'base64').toString(); 
            
        document.attachment_url = attachmentURL;
        document.attachment_base64 = attachmentTxt;
            
        console.log(attachmentTxt);
        logger.info('Decoded b64 attachment: ' + attachmentTxt);

        fs.writeFileSync(jsonFileName, JSON.stringify(document));
        
        return document;
    }
}

module.exports = new JsonDataLoader();  