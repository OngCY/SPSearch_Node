const elasticsearch=require('elasticsearch');
const propertiesReader = require('properties-reader');
const properties = propertiesReader('app.properties');


var client = new elasticsearch.Client( {  
    host: properties.get('es.host'),
    log: 'trace',
    apiVersion: '7.x',
});

//App Search connection
/*const apiKey = 'private-mu75psc5egt9ppzuycnc2mc3'
const baseUrlFn = () => 'http://localhost:3002/api/as/v1/'
const client = new AppSearchClient(undefined, apiKey, baseUrlFn)*/

module.exports = client;  