const fs = require('fs');
class JsonDataLoader {

    //Read data from json file to Queue
    loadJsonFile(jsonFileName) {
        console.log('Loading json file started.');
        let jsonData = fs.readFileSync(jsonFileName);
        let documents = JSON.parse(jsonData);        
        console.log(`Loading completed. `);
        return documents;
    }
}

module.exports = new JsonDataLoader();  