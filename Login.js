const { error } = require('console');
var mysql = require('mysql2');
var connection = mysql.createConnection({
host :'localhost',
database :'JokesGenie',
user :'root',
password:'timrold21',
});
connection.connect(function(err) {
if (err) {
console.error('Error connecting: '+ err.stack);
 return;
}
console.log('Connected as id ' + connection.threadId); 
});
connection.query ('SELECT * FROM New_Users', function (error, results, fields) {
    if (error);
    throw error;

    results.forEach(result => { 
        console.log(result);
});
});