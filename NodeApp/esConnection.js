const elasticsearch = require('elasticsearch');
const AppSearchClient = require('@elastic/app-search-node');
const WorkplaceSearchClient = require('@elastic/workplace-search-node');
const logger = require('./logger');
const propertiesReader = require('properties-reader');
const properties = propertiesReader('app.properties');
const productType = properties.get('elastic.product');
let client;

switch(productType){
    case "es": //ES
        client = new elasticsearch.Client( {  
            host: properties.get('es.host'),
            log: 'warn',
            apiVersion: '7.x'
        })
        
        console.log("ES client: " + JSON.stringify(client));
        logger.info("ES client: " + JSON.stringify(client));
        break;

    case "as": //App Search 
        const apiKey = properties.get('appsearch.apikey');
        const baseUrlFn = () => properties.get('appsearch.host');
        client = new AppSearchClient(undefined, apiKey, baseUrlFn);
    
        console.log("AS client: " + JSON.stringify(client));
        logger.info("AS client: " + JSON.stringify(client));
        break;

    case "ws": //Workplace Search 
        const accessToken = properties.get('wpsearch.accesstoken');
        const host = properties.get('wpsearch.host');
        client = new WorkplaceSearchClient(accessToken, host);
        
        console.log("WS client: " + JSON.stringify(client));
        logger.info("WS client: " + JSON.stringify(client));
        break;

    default:
        client = null;
        logger.error("Product type not recognised");
        console.log("Product type not recognised");
}

module.exports = {client};