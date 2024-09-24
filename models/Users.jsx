// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  oneTimeLink: { type: String, required: true },
  linkUsed: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);