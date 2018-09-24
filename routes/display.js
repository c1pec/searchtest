var express = require('express');

const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();

// A bucket is a container for objects (files) (replace bucket name with process.env.GCLOUD_STORAGE_BUCKET).
const bucket = storage.bucket('search-test-216617-bucket');

var router = express.Router();

/* GET main page. */
router.get('/', (req, res, next) => {
    if (req.session.isAuth != true) {
        res.send('Acces denied');
        return;
    }

    var file = bucket.file(req.query.file);
    
    file.download(function(err, contents) {
        // TODO handle error
        if (err) {
            res.send('Error during download');
            reutrn;
        }

        var stringContent = contents.toString();
        res.render('display', {name: req.query.file, content: stringContent});
    });
});

module.exports = router;