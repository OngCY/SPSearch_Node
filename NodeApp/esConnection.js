const elasticsearch = require('elasticsearch');
const AppSearchClient = require('@elastic/app-search-node')
const propertiesReader = require('properties-reader');
const properties = propertiesReader('app.properties');

const productType = properties.get('elastic.product');
let client;

if(productType === "es"){
    //ES connection
    client = new elasticsearch.Client( {  
        host: properties.get('es.host'),
        log: 'trace',
        apiVersion: '7.x'
    })
}else{
    //App Search connection
    const apiKey = properties.get('appsearch.apikey');
    const baseUrlFn = () => properties.get('appsearch.host');
    client = new AppSearchClient(undefined, apiKey, baseUrlFn);
}

module.exports = {client};