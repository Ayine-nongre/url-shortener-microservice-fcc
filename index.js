require('dotenv').config({path: './sample.env'});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const mongoose = require('mongoose');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const URI = process.env.URI

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

var set = mongoose.connection;
set.on('error', console.error.bind(console, 'connection error:'));
set.once('open', function() {
    console.log('Db connected successfully')
});

const Url = mongoose.model('Url', { 
  originalUrl: {type: String, required: true},
  ID: {type: String, unique: true}
 });


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl', function (req, res){
  
})
app.post('/api/shorturl', function(req, res) {
  const originalURL = req.body.url;
  const uniqueID = shortid.generate();
  
  const shortUrl = new Url({
    originalUrl: originalURL,
    ID: uniqueID
  })
  shortUrl.save();

  res.json({ original_url : originalURL, short_url : uniqueID })
});

async function grabUrl(urlParam){
  const foundUrl = await Url.find({ ID: urlParam });
  const data = await foundUrl;
  return data;
}

app.get('/api/shorturl/:short_url', function(req, res){
  const urlParam = req.params.short_url;

   grabUrl(urlParam)
    .then(data => {
      const doc = data;
      res.redirect(doc[0].originalUrl);
    })
    .catch(err => {res.json({ error: "invalid url"})});
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
