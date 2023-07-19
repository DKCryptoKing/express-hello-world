require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Test = require('./models/Seizure');

const app = express();
app.use(express.json());

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
  res.set('x-timestamp', Date.now());
  res.set('x-powered-by', 'cyclic.sh');
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`);
  next();
});

// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html', 'css', 'js', 'ico', 'jpg', 'jpeg', 'png', 'svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false,
};
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

// API endpoint for deleting a record
app.delete('/api/data/:id', (req, res) => {
  const id = req.params.id;

  Test.findByIdAndDelete(id)
    .then(() => res.status(200).json({ message: 'Record deleted successfully' }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// API endpoint for updating a record
app.put('/api/data/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  console.log('Record ID:', id);
  console.log('Updated Data:', updatedData);

  Test.findByIdAndUpdate(id, updatedData, { new: true })
    .then((updatedRecord) => res.status(200).json(updatedRecord))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// API endpoint for fetching a specific record by ID
app.get('/api/data/:id', (req, res) => {
  const recordId = req.params.id;

  Test.findById(recordId)
    .then((record) => {
      if (!record) {
        // If record not found, return a 404 response
        res.status(404).json({ error: 'Record not found' });
        return;
      }

      // If record found, return the record data
      res.json(record);
    })
    .catch((error) => {
      console.log('Error fetching record:', error);
      res.status(500).json({ error: 'Error fetching record' });
    });
});

// Catch all handler for all other requests
app.use('*', (req, res) => {
  res.json({
    at: new Date().toISOString(),
    method: req.method,
    hostname: req.hostname,
    ip: req.ip,
    query: req.query,
    headers: req.headers,
    cookies: req.cookies,
    params: req.params,
  }).end();
});

module.exports = app;
