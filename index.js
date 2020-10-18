const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortURL = require('./models/url');

const PORT = 8888;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const allData = await ShortURL.find();
  res.render('index', { shortUrls: allData });
});

app.get('/:shortid', async (req, res) => {
  const shortid = req.params.shortid;

  const rec = await ShortURL.findOne({ short: shortid });

  if (!rec) return res.sendStatus(404);

  rec.clicks++;
  await rec.save();

  res.redirect(rec.full);
});

app.post('/short', async (req, res) => {
  const fullUrl = req.body.fullUrl;
  console.log('URL requested: ', fullUrl);

  const record = new ShortURL({
    full: fullUrl
  });

  await record.save();

  res.redirect('/');
});

mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Wait for mongodb connection before server starts
mongoose.connection.on('open', async () => {

  // for testing purpose
  await ShortURL.create({ full: 'http://google.com' });
  await ShortURL.create({ full: 'http://codedamn.com' });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
