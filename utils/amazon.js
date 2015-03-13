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
  var Page = Math.floor(Math.random() * 5);

  // give a random search indix if there is no indices provided
  if (!searchindices) {
    searchindices = searchindiceslist[Math.floor(Math.random() * searchindiceslist.length)];
  }

  //itemsearch function
  opHelper.execute('ItemSearch', {
    'Keywords': kwrds,
    'SearchIndex': searchindices,
    'Avaliability': 'Avaliable',
    'MinimumPrice': minprice,
    'MaximumPrice': maxprice,
    'ItemPage': Page.toString(),
    'ResponseGroup': 'ItemAttributes, Offers, Images'
  }, function (err, parsed, raw) {
    if (err) {
      console.log(err);
    }

    //console.log if there is a search error and return so that the server side will wait the next request from the client side
    if (!parsed.ItemSearchResponse.Items[0]) {
      console.log("search error");
      return;
    }

    //console.log if there is no item in the search, and will render result: false to the cilent side.
    if (!parsed.ItemSearchResponse.Items[0].Item) {
      console.log("no result!!");
      callback({
        'result': false
      });
      return;
    }

    var index = Math.floor(Math.random() * parsed.ItemSearchResponse.Items[0].Item.length);

    //there are tons of irregular item returned by the function that our client side don't want to see, we filter out these
    //items by put the index in a while loop and only those item that has all the information that we required can come out
    //to the client side
    while (1) {
      if (index > parsed.ItemSearchResponse.Items[0].Item.length) {
        return;
      }

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
      } else if (Number(minprice) > Number(parsed.ItemSearchResponse.Items[0].Item[index].OfferSummary[0].LowestNewPrice[0].Amount[0]) || Number(parsed.ItemSearchResponse.Items[0].Item[index].OfferSummary[0].LowestNewPrice[0].Amount[0]) > Number(maxprice) || !Number(maxprice)) {
        console.log("no result!!");
        callback({
          'result': false
        });
        return;
      } else {
        break;
      }
    }

    //wrap the useful info in variables
    console.log(Number(minprice));
    console.log(Number(maxprice));
    console.log(Number(parsed.ItemSearchResponse.Items[0].Item[index].OfferSummary[0].LowestNewPrice[0].Amount[0]));

    var listofitems = parsed.ItemSearchResponse.Items[0].Item;
    var title = listofitems[index].ItemAttributes[0].Title[0];
    var link = listofitems[index].DetailPageURL[0];
    var image = listofitems[index].LargeImage[0].URL[0];
    var price = listofitems[index].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];

    //wrap the useful data into an object
    var data = {
      'title': title,
      'link': link,
      'image': image,
      'price': price,
      'result': true
    };

    //callback
    callback(data);
  });
};

module.exports = amazon;
