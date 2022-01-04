const es = require('./esConnection');
const propertiesReader = require('properties-reader');
const properties = propertiesReader('app.properties');

class EsIndexManager {

    constructor(index_engine_sourcekey) {
        this.index_engine_sourcekey = index_engine_sourcekey || properties.get('fallback.indexenginesource');
    }

    // 1. Create index (for ES)
    createIndex() {
        return es.client.indices.create({
            index: this.index_engine_sourcekey
        });
    }

    // 2. Check if index exists (for ES)
    indexExists() {
        return es.client.indices.exists({
            index: this.index_engine_sourcekey
        });
    }

    // 3. Delete Index by index-name (for ES)
    deleteIndex() {
        return es.client.indices.delete({ index: this.index_engine_sourcekey });
    }

    // 4. Add/Update a document (for ES)
    addDocument(_id, _docType, _payload) {
        es.client.index({
            index: this.index_engine_sourcekey,
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

    //Index a document in app search
    addDocumentToAppSearch(_payload){
        es.client.indexDocuments(this.index_engine_sourcekey, _payload)
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }

    //Index a document in workplace search
    addDocumentToWPSearch(_payload){
        es.client.indexDocuments(this.index_engine_sourcekey, _payload)
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }
}

module.exports = EsIndexManager;