const esIndexManager = require('./esIndexManager');
const jsonDataLoader = require('./jsonDataLoader');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('app.properties');


let indexManager = new esIndexManager(properties.get('es.indexname')); //set index

if(!indexManager.indexExists(properties.get('es.indexname')))
    indexManager.createIndex();

importJsonData();

function importJsonData(){
    let documents = jsonDataLoader.loadJsonFile(properties.get('json.filename'));
    
    for (const doc of documents) {
        console.log('doc: ',doc);
        indexManager.addDocument(null, "_doc", JSON.stringify(doc));
    }
}


/*
function AddDocumentTest(){
//indexManager.createIndex(); //create Index

//Create an instance of Post
const newPost = new Post('Node with ES', "Article", "This is test post 1.");

//Conver to JSON
const jsonPost = JSON.stringify(newPost);
console.log(jsonPost);

//add to index
indexManager.addDocument('1', 'posts', jsonPost);
}

class Post {

    constructor(postName, postType, postContent) {
        this.postName = postName;
        this.postType = postType;
        this.postContent = postContent;
    }
}
*/