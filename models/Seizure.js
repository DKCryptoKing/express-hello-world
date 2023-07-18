const mongoose = require('mongoose');

const seizureSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  location: { type: String, required: true },
  severity: { type: String, required: true },
  duration: { type: String, required: true },
  vomiting: { type: String, required: true },
  calledHome: { type: String, required: true },
  trigger: { type: String, required: true },
  note: { type: String },
});

const Seizure = mongoose.model('Seizure', seizureSchema);

module.exports = Seizure;