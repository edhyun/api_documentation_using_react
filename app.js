var fs = require('fs');
var express = require('express');

var app = express();

app.use('/bootstrap',express.static('node_modules/bootstrap'))
app.use(express.static('views'))

app.get('/', function (req, res) {
    var html = fs.readFileSync('views/api.html', 'utf8');
    res.send(html);
});

app.get('/api', function (req, res) {
    var obj = JSON.parse(fs.readFileSync('api_schema.json', 'utf8'));
    res.json(obj);
});

app.listen(8124, function () {
  console.log('server listening on port 8124');
});
