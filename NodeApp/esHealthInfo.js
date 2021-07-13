const es = require('./esConnection.js');

es.client.cluster.health({},function(err, resp, status) {  
  console.log("-- Client Health --",resp);
});

