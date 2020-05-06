var express = require('express');
var router = express.Router();
const vision = require('@google-cloud/vision');
const path = require('path');
const multer = require("multer")
// var upload = multer({ dest: 'uploads/' })
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
}).single('pic');
// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: 'views/samplevisionkey.json'   // here you can use your key generated
});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/send',  function(req, res, next) {
    upload(req, res, (err) => {
        if(err){
            res.render('index', {
                msg: err
            });
        } else {
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error: No File Selected!'
                });
            } else {

                client
                    .labelDetection(req.file.path)
                    .then(results => {
                        const labels = results[0].labelAnnotations;
                        console.log('Labels:');
                        // labels.forEach(label => console.log(label));
                        result = []
                        for( label in labels){
                            console.log('labbb -- ' , labels[label]['description'], labels[label]['score'] )
                            result_data = {}
                            result_data['description'] = labels[label]['description']
                            result_data['score'] = labels[label]['score']
                            result.push(result_data)
                        }
                        //We need to manipulate the json n send it a format need in the front end(index.ejs)
                        // res.render('index', { data: JSON.stringify(result) , title: 'Express'});
                        res.render('index', {
                            msg: 'File Uploaded!',
                            file: `images/${req.file.filename}`,
                            data: JSON.stringify(result) ,
                            title: 'Express'

                        });
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                        res.render('index', { data: req.body , title: 'Express', image_prev : req.file.path});
                    });

            }
        }
    });
});



module.exports = router;
