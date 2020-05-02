var express = require('express');
var router = express.Router();
// const express = require('express');
const multer = require("multer");
var upload = multer({ dest: 'uploads/' });
const app = express();
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

/*router.post('/send', function(req, res, next) {
    console.log('index log - -------------------------------', req.body )
   // console.log(req.file.pic);
    var keyName=req.body.pic;
    console.log(keyName);
    client
        .labelDetection(keyName)
        .then(results => {
            const labels = results[0].labelAnnotations;

            console.log('Labels:');
            labels.forEach(label => console.log(label));
            //console.log(results);
            console.log(labels[0] , labels[0].score)
            res.render('index', { data: labels[0].score , title: 'Express'});
        })
        .catch(err => {
            console.error('ERROR:', err);
            res.render('index', { data: req.body , title: 'Express'});
        });
    // res.render('index', { data: req.body , title: 'Express'});
});*/

router.post('/send', upload.single('pic'),  function(req, res, next) {
    client
        .labelDetection(req.file.path)// here we need to replace the image with image from request
        .then(results => {
            const labels = results[0].labelAnnotations;
            console.log('Labels:');
            labels.forEach(label => console.log(label));
            console.log(labels[0] , labels[0].score)
            //We need to manipulate the json n send it a format need in the front end(index.ejs)

            res.render('index', { data: labels[0].description , title: 'Express'});
        })
        .catch(err => {
            console.error('ERROR:', err);
            res.render('index', { data: req.body , title: 'Express'});
        });

});
// app.post('/example', (req, res) => {
//   res.send(`Full name is:${req.body.fname} ${req.body.lname}.`);
// });

module.exports = router;
