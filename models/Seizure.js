const mongoose = require('mongoose');

const seizureSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  location: { type: String, required: true, enum: ['School', 'Home', 'Other'] },
  severity: { type: String, required: true, enum: ['Mild', 'Moderate', 'Severe'] },
  duration: { type: String, required: true, enum: ['Few hours', 'Half day', 'Full day'] },
  vomiting: { type: String, required: true, enum: ['Yes', 'No'] },
  calledHome: { type: String, required: true, enum: ['Yes', 'No', 'N/A'] },
  trigger: { type: String, required: true, enum: ['Unknown', 'Stress', 'Chock', 'Illness', 'Spontaneous'] },
  note: { type: String },
});


const Seizure = mongoose.model('Seizure', seizureSchema);

module.exports = Seizure;