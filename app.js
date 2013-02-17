/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , fs = require('fs')
    , path = require('path');

var app = express();

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

app.get('/uploaded', routes.uploaded);

app.get('/', routes.index);

app.post('/upload', function (req, res) {
        var files = req.files;
        var filesLength = Object.keys(files).length;
        for (var i = 0; i < filesLength; i++) {
            console.log(files['file_0'])
            uploadFile(files['file_' + i], function () {
                    if (i + 1 >= filesLength) {
                        res.redirect("/uploaded")
                    }
                }
            );
        }


    }
)
;

function uploadFile(file, callBack) {
    fs.readFile(file.path, function (err, data) {
        var newPath = __dirname + "/uploads/" + file.name;
        fs.writeFile(newPath, data, function (err) {
            callBack();
        });
    });
}


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
