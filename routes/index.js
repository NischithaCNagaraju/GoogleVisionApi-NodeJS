var express = require('express');
var router = express.Router();
const vision = require('@google-cloud/vision');
const multer = require("multer")
var upload = multer({ dest: 'uploads/' })
// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: 'views/samplevisionkey.json'   // here you can use your key generated
});
/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log('index log - ' , req)
    res.render('index');
});

router.post('/send', upload.single('pic'),  function(req, res, next) {
    client
        .labelDetection(req.file.path)// here we need to replace the image with image from request
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
            res.render('index', { data: JSON.stringify(result) , title: 'Express'});
        })
        .catch(err => {
            console.error('ERROR:', err);
            res.render('index', { data: req.body , title: 'Express'});
        });

});



module.exports = router;
