const es = require('./esConnection');
const propertiesReader = require('properties-reader');
const properties = propertiesReader('app.properties');


class EsIndexManager {

    constructor(indexName, engineName) {
        this.indexName = indexName || properties.get('es.fallback.indexname');
        this.engineName = engineName || properties.get('appsearch.fallback.enginename');
    }

    // 1. Create index
    createIndex() {
        return es.client.indices.create({
            index: this.indexName
        });
    }

    // 2. Check if index exists
    indexExists() {
        return es.client.indices.exists({
            index: this.indexName
        });
    }

    // 3. Delete Index by index-name
    deleteIndex() {
        return es.client.indices.delete({ index: this.indexName });
    }

    // 4. Add/Update a document
    addDocument(_id, _docType, _payload) {
        es.client.index({
            index: this.indexName,
            type: _docType,
            id: _id,
            body: _payload
        }, function (err, resp) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("added or updated", resp);
            }
        })
    }

    // Add a document to app search
    addDocumentToAppSearch(_payload){
        es.client.indexDocuments(this.engineName, _payload)
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }
}

module.exports = EsIndexManager;