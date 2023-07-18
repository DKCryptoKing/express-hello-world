require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Test = require('./models/Seizure'); // Make sure this path is correct

const app = express();

// Set up view engine
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/register', function (req, res) {
  res.render('register');
});

app.get('/statistics', function (req, res) {
  res.render('statistics');
});

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

// Logs all request paths and method
app.use(function (req, res, next) {
  res.set('x-timestamp', Date.now())
  res.set('x-powered-by', 'cyclic.sh')
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`);
  next();
});

// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('public', options));

// API endpoint for fetching data from MongoDB
app.get('/api/data', (req, res) => {
  const { page = 1, limit = 200 } = req.query;

  Test.find()
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).send(err));
});

// Catch all handler for all other requests
app.use('*', (req,res) => {
  res.json({
    at: new Date().toISOString(),
    method: req.method,
    hostname: req.hostname,
    ip: req.ip,
    query: req.query,
    headers: req.headers,
    cookies: req.cookies,
    params: req.params
  })
  .end()
});

module.exports = app;