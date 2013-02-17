/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , fs = require('fs')
    , path = require('path');

var app = express();

var settings = {
    'allowed-types': ['image/jpeg', 'image/png', 'image/gif'] // [] == all
};

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/uploaded', function (req, res) {
    fs.readdir(__dirname + "/uploads/", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var imagesList = [];

        for (var i = 0; i < data.length; i++) {
            imagesList.push('http://' + req.headers.host + '/image/' + data[i])
        }
        res.render('uploaded', { title: 'File upload', files: imagesList});
    });
});

app.get('/image/:name', function (req, res) {
    var imageName = req.params.name;

    fs.readFile(__dirname + "/uploads/" + imageName, function (err, data) {
        if (err) {
            return console.log(err);
        }
        res.writeHead('200', {'Content-Type': 'image/png'})
        res.end(data, 'binary');
    });


});


app.get('/', routes.index);

app.post('/upload', function (req, res) {
        var files = req.files;
        var filesLength = Object.keys(files).length;
        for (var i = 0; i < filesLength; i++) {
            uploadFile(files['file_' + i]);
        }
        res.redirect("/uploaded")
    }
);

function uploadFile(file, callBack) {
    var validType = false;
    for (var i = 0; i < settings['allowed-types'].length; i++) {
        if (file.type == settings['allowed-types'][i])
            validType = true;
    }
    if (validType) {
        fs.readFile(file.path, function (err, data) {
            var newPath = __dirname + "/uploads/" + file.name;
            fs.writeFile(newPath, data, function (err) {
            });
        });
    }
}


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
