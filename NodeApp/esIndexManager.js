const client = require('./esConnection');
const propertiesReader = require('properties-reader');
const properties = propertiesReader('app.properties');


class EsIndexManager {

    constructor(indexName) {
        this.indexName = indexName || properties.get('es.fallback.indexname');
    }

    // 1. Create index
    createIndex() {
        return client.indices.create({
            index: this.indexName
        });
    }

    // 2. Check if index exists
    indexExists() {
        return client.indices.exists({
            index: this.indexName
        });
    }

    // 3. Delete Index by index-name
    deleteIndex() {
        return client.indices.delete({ index: this.indexName });
    }

    // 4. Add/Update a document
    addDocument(_id, _docType, _payload) {
        client.index({
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
}


module.exports = EsIndexManager;