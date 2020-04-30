var express = require('express');
var router = express.Router();
// const express = require('express');
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

router.post('/send', function(req, res, next) {
  console.log('index log - -------------------------------', req.body )
    client
        .labelDetection('views/lady.jpg')
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
});

// app.post('/example', (req, res) => {
//   res.send(`Full name is:${req.body.fname} ${req.body.lname}.`);
// });

module.exports = router;
