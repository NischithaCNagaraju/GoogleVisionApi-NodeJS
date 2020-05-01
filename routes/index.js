var express = require('express');
var router = express.Router();
const vision = require('@google-cloud/vision');
// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'views/samplevisionkey.json'   // here you can use your key generated
});
/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log('index log - ' , req)

  res.render('index');
});

router.post('/send', function(req, res, next) {
    client
        .labelDetection('views/lady.jpg')// here we need to replace the image with image from request
        .then(results => {
            const labels = results[0].labelAnnotations;
            console.log('Labels:');
            labels.forEach(label => console.log(label));
            console.log(labels[0] , labels[0].score)
            //We need to manipulate the json n send it a format need in the front end(index.ejs)
            res.render('index', { data: labels[0].score , title: 'Express'});
        })
        .catch(err => {
            console.error('ERROR:', err);
            res.render('index', { data: req.body , title: 'Express'});
        });

});



module.exports = router;
