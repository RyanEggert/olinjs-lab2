var mongoose = require("mongoose");
var supergoose = require("supergoose");
// var bcrypt   = require('bcrypt-nodejs');
var models = {};

// user
var giftSchema = mongoose.Schema({
  name: String,
  image: String,
  link: String,
  price: Number,
  to: String,
  from: String
});

models.Gift = mongoose.model("Gift", giftSchema);

var userSchema = mongoose.Schema({
  name: String,
  facebook: {
    id: String,
    profilelink: String,
    name: String
  },
  gift: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift' },
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
