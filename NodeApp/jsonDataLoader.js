const fs = require('fs');
const logger = require('./logger');

class JsonDataLoader {

    //Read data from json file 
    loadJsonFile(jsonFileName) {
        console.log("Processing file: " + jsonFileName);
        logger.info("Processing file: " + jsonFileName);

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
      
        fs.writeFileSync(jsonFileName, JSON.stringify(document));

        console.log("Finished processing!");
        logger.info("Finished processing!");
        
        return document;
    }
}

module.exports = new JsonDataLoader();  