
import fs from 'fs';
import path from 'path';
import request from 'request';

import express from 'express';
import bodyParser from 'body-parser';

const PORT = process.env['port'] || 8000;
const app = express();
const BASE_PATH = path.resolve(__dirname);
const TEMPLATES_PATH = path.join(BASE_PATH, 'templates');
const STATICS_PATH = path.join(BASE_PATH, 'static');

const FOURSQUARE = JSON.parse(
  fs.readFileSync(path.join(BASE_PATH, 'foursquare.json')
  ).toString());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(STATICS_PATH));

const mainTemplate = fs.readFileSync(
  path.join(TEMPLATES_PATH, 'index.html')
).toString();

app.get('/', (req, res) => {
  res.send(mainTemplate);
});

function makeFoursquareQuery(url, req, res) {
  const query = Object.assign({
    client_id: FOURSQUARE.CLIENT_ID,
    client_secret: FOURSQUARE.CLIENT_SECRET,
    v: (new Date()).toISOString().split('T')[0].replace(/-/g, '')
  }, req.body);
  request({
    url: url,
    method: 'GET',
    qs: query
  }, function (err, resFsq, body) {
    const data = JSON.parse(body);
    if (err) {
      res.status(406).json({ status: 'fail', message: err.message });
    } else {
      res.status(data.meta.code).json(data);
    }
  });
}

app.post('/api/v1/fsq/categories', (req, res) => {
  const url = 'https://api.foursquare.com/v2/venues/categories';
  makeFoursquareQuery(url, req, res);
});

app.post('/api/v1/fsq/locations', (req, res) => {
  const url = 'https://api.foursquare.com/v2/venues/explore';
  makeFoursquareQuery(url, req, res);
});

app.listen(PORT, () => {
  global.console.log(`Listening port ${PORT}...`);
});
