var mongoose = require("mongoose");
var supergoose = require("supergoose");
var models = {};

// user
var giftSchema = mongoose.Schema({
  name:String,
  image:String,
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
  linkedin: {
    id: String,
    profilelink: String,
    pictureUrl: String,
    accessToken: String
  },
  gift: {
    sent: [giftSchema],
    rec: [giftSchema]
  },
  keywords: [String]
});

userSchema.plugin(supergoose);

models.authUser = mongoose.model("authUser", userSchema);

module.exports = models;
