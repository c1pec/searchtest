var express = require('express');

const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();

// A bucket is a container for objects (files) (replace bucket name with process.env.GCLOUD_STORAGE_BUCKET).
const bucket = storage.bucket('search-test-216617-bucket');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.isAuth) {
        res.render('main');
    }
    else res.send('Acces denied');
});

/* GET search page. */
router.get('/search', (req, res, next) => {
    if (req.session.isAuth != true) {
        res.send('Acces denied');
        return;
    }
    
    // Stores all files contents in an array of strings
    bucket.getFiles(function(err, files) {
        if (!err) {
            var formatedFiles = [];

            var downloadFiles = function(index, callback) {
            if (index == files.length) {
                return callback();
            }
            else {
                files[index].download(function(err, contents) {
                formatedFiles.push({name: files[index].name, content: contents.toString()});
                downloadFiles(index + 1, callback);
                });
            }}

            downloadFiles(0, function() {
                // create an array containing all files that matches the query string
                var matchingFiles = [];

                var compare = function(index, callback) {
                    if (index == formatedFiles.length) {
                        return callback();
                    }
                    else {
                        var foundIndex = formatedFiles[index].content.indexOf(req.query.textToSearch);
                        if (foundIndex != -1) {
                            var previewString = formatedFiles[index].content.substring(foundIndex - 50, foundIndex + 50);
                            formatedFiles[index].content = previewString;
                            matchingFiles.push(formatedFiles[index]);
                        }
                        compare(index + 1, callback);
                    }
                }

                compare(0, function() {
                    var searchMsg;

                    if (matchingFiles.length == 0) {
                        searchMsg = 'Pas de resultat';
                    }
                    else {
                        searchMsg = 'Resultat de la recherche';
                    }
                    res.render('main', {searchMsg: searchMsg, matchingFiles: matchingFiles});
                });
            });
        }
        else res.send('Error during download');
    });
});

module.exports = router;