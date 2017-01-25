var express = require('express');

var app = express();

app.get('/callback', function(req, res) {
    console.log('got request for /callback', JSON.stringify(req));
});
console.log('listening on 8888');
app.listen(8888);
