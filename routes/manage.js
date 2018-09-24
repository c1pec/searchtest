var express = require('express');
const Multer = require('multer');

const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

// A bucket is a container for objects (files) (replace bucket name with process.env.GCLOUD_STORAGE_BUCKET).
const bucket = storage.bucket('search-test-216617-bucket');

var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    if (req.session.isAuth != true) {
        res.send('Acces denied');
        return;
    }

    // Includes files list for manage.pug
    bucket.getFiles(function(err, files) {
        if (!err) {
            res.render('manage', {files: files});
        }
    });
});

/* POST upload page. */
router.post('/upload', multer.single('file'), (req, res, next) => {
    if (req.session.isAuth != true) {
        res.send('Acces denied');
        return;
    }

    // handle file upload
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }
  
      // Create a new blob in the bucket and upload the file data.
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: {contentType: 'text/plain'},
        resumable: false
      });
    
      blobStream.on('error', (err) => {
        next(err);
      });
    
      blobStream.on('finish', () => {
        
        // Include files list for manage.pug
        bucket.getFiles(function(err, files) {
            if (!err) {
                // The public URL can be used to directly access the file via HTTP.
                const publicUrl = 'https://storage.googleapis.com/' + bucket.name + '/' + blob.name;
                res.render('manage', {files: files, uploadState: 'Upload du fichier reussi. L\'url publique du fichier est: ' + publicUrl});
            }
        });
      });
    
      blobStream.end(req.file.buffer);
    });

/* GET delete page. */
router.get('/delete', (req, res, next) => {
    if (req.session.isAuth != true) {
        res.send('Acces denied');
        return;
    }

    bucket.file(req.query.file).delete().then(() => {
        res.redirect('/manage');
    });
});

module.exports = router;