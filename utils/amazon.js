//Amazon Product Advertising API from node.js.
var utils = require('../utils/utils');

if (utils.module_exists('../oauth.js')) {
  var configs = require('../oauth.js');
}

var lists = require('./lists.js');

var kwlist = lists.kwlist;
var searchindiceslist = lists.silist;



// using node-apac
var util = require('util'),
  OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
  awsId: process.env.AWSID || configs.amazon.akeyAccess,
  awsSecret: process.env.AWSSC || configs.amazon.akeySecret,
  assocId: process.env.ASCID || configs.amazon.atagAssoc
});

var amazon = function (money, searchindices, callback) {
  var minprice = (money * 86).toString(); // prices are in cents
  var maxprice = (money * 100).toString();
  var kwrds = kwlist[Math.floor(Math.random() * kwlist.length)]; //generate random keyword

  // give a random search indix if there is no indices provided
  if (!searchindices) {
    searchindices = searchindiceslist[Math.floor(Math.random() * searchindiceslist.length)];
  }

  opHelper.execute('ItemSearch', {
    'Keywords': kwrds,
    'SearchIndex': searchindices,
    'Avaliability': 'Avaliable',
    'MinimumPrice': minprice,
    'MaximumPrice': maxprice,
    'ResponseGroup': 'ItemAttributes, Offers, Images'
  }, function (err, parsed, raw) {
    if (err) {
      console.log(err);
    }

    if (!parsed.ItemSearchResponse.Items[0]) {
      console.log("search error");
      return;
    }

    if (!parsed.ItemSearchResponse.Items[0].Item) {
      console.log("no result!!");
      callback({
        'result': false
      });
      return;
    }

    var index = Math.floor(Math.random() * parsed.ItemSearchResponse.Items[0].Item.length);

    while (1) {
      if (!parsed.ItemSearchResponse.Items[0].Item) {
        index = Math.floor(Math.random() * parsed.ItemSearchResponse.Items[0].Item.length);
        continue;
      } else if (!parsed.ItemSearchResponse.Items[0].Item[index].DetailPageURL[0]) {
        index = Math.floor(Math.random() * parsed.ItemSearchResponse.Items[0].Item.length);
        continue;
      } else if (!parsed.ItemSearchResponse.Items[0].Item[index].OfferSummary) {
        index = Math.floor(Math.random() * parsed.ItemSearchResponse.Items[0].Item.length);
        continue;
      } else if (!parsed.ItemSearchResponse.Items[0].Item[index].OfferSummary[0].LowestNewPrice) {
        index = Math.floor(Math.random() * parsed.ItemSearchResponse.Items[0].Item.length);
        continue;
      } else if (!parsed.ItemSearchResponse.Items[0].Item[index].LargeImage) {
        index = Math.floor(Math.random() * parsed.ItemSearchResponse.Items[0].Item.length);
        continue;
      } else if (!parsed.ItemSearchResponse.Items[0].Item[index].OfferSummary[0].LowestNewPrice[0].Amount) {
        index = Math.floor(Math.random() * parsed.ItemSearchResponse.Items[0].Item.length);
        continue;
      } else if (Number(minprice) > Number(parsed.ItemSearchResponse.Items[0].Item[index].OfferSummary[0].LowestNewPrice[0].Amount[0]) > Number(maxprice)) {
        index = Math.floor(Math.random() * parsed.ItemSearchResponse.Items[0].Item.length);
        continue;
      } else {
        break;
      }
    }

    var listofitems = parsed.ItemSearchResponse.Items[0].Item;
    var title = listofitems[index].ItemAttributes[0].Title[0];
    var link = listofitems[index].DetailPageURL[0];
    var image = listofitems[index].LargeImage[0].URL[0];
    var price = listofitems[index].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];

    var data = {
      'title': title,
      'link': link,
      'image': image,
      'price': price,
      'result': true
    };

    callback(data);
  });
};

module.exports = amazon;
