var mongoose = require("mongoose");
var supergoose = require("supergoose");
var models = {};

// user
var giftsentSchema = mongoose.Schema({
  name:String,
  image:String,
  link: String,
  price: Number,
  to: String
});

var giftrecSchema = mongoose.Schema({
  name: String,
  image: String,
  link: String,
  price: Number,
  from: String
});

var userSchema = mongoose.Schema({
  name: String,
  facebook: {
    id: String,
    profilelink: String,
    name: String
  },
  linkedin: {
    id: String,
    profilelink: String,
    pictureUrl: String,
    accessToken: String
  },
  gift: {
    sent: [giftsentSchema],
    rec: [giftrecSchema]
  },
  keywords: [String]
});

userSchema.plugin(supergoose);

models.authUser = mongoose.model("authUser", userSchema);

// cheep

var cheepSchema = mongoose.Schema({
  username: String,
  userid: String,
  words: String,
  date: {
    type: Date,
    default: Date.now
  }
});
models.authCheep = mongoose.model("authCheep", cheepSchema);

module.exports = models;
