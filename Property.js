const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  bedrooms: Number,
  bathrooms: Number,
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Property', PropertySchema);
