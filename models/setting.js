const mongoose = require("mongoose");
const validator = require("validator");

const settingsSchema = new mongoose.Schema({
  site_name: {
    type: String,
    unique: true,
    required: true,
  },
  site_keywords: String,
  site_description: String,
  logo: {
    type: String,
    required: true,
  },
  favicon: String,
  email: {
    type: String,
    validate: [validator.isEmail, "Enter a valid email address."],
  },
  phone: String,
  address: String,
  symbol: {
    type: String,
    default: "$",
  },
  copyright: String,
  facebookUrl: String,
  instagramUrl: String,
  linkedinUrl: String,
  twitterUrl: String,
  visitors: {
    type: Number,
    default: 0,
  },
});

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
