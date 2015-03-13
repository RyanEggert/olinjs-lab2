// Test of Amazon Product Advertising API from node.js.

var configs = require('./config.js');

// using node-apac

var util = require('util'),
  OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
  awsId: configs.amazon.akeyAccess,
  awsSecret: configs.amazon.akeySecret,
  assocId: configs.amazon.atagAssoc
});

// execute(operation, params, callback)
// operation: select from http://docs.aws.amazon.com/AWSECommerceService/latest/DG/SummaryofA2SOperations.html
// params: parameters for operation (optional)
// callback(err, parsed, raw): callback function handling results. err = potential errors raised from xml2js.parseString() or http.request(). parsed = xml2js parsed response. raw = raw xml response.


var searchindiceslist = ['Apparel', 'Appliances', 'ArtsAndCrafts', 'Automotive', 
  'Baby', 'Beauty', 'Blended', 'Books', 'Classical', 'Collectibles', 'DigitalMusic', 
  'Grocery', 'DVD', 'Electronics', 'HealthPersonalCare', 'HomeGarden', 'Industrial', 
  'Jewelry', 'KindleStore', 'Kitchen', 'LawnGarden', 'Magazines', 'Marketplace', 
  'Merchants', 'Miscellaneous', 'MobileApps', 'MP3Downloads', 'Music', 
  'MusicalInstruments', 'MusicTracks', 'OfficeProducts', 'OutdoorLiving', 
  'PCHardware', 'PetSupplies', 'Photo', 'Shoes', 'Software', 'SportingGoods', 
  'Tools', 'Toys', 'UnboxVideo', 'VHS', 'Video', 'VideoGames', 'Watches', 
  'Wireless', 'WirelessAccessories'
];


// https://github.com/dmcquay/node-apac //

var amazon = function (money, searchindices, callback) {
  var minprice = (money * 90).toString(); // prices are in cents
  var maxprice = (money * 110).toString();
  var Page = Math.floor(Math.random() * 5);

  // give a random search indix if there is no indices provided
  if (!searchindices) {
    searchindices = searchindiceslist[Math.floor(Math.random() * searchindiceslist.length)];
  }

  //itemsearch function
  opHelper.execute('ItemSearch', {
    'Keywords': ' ',
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
      callback({'result':false});
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
      } else if (Number(minprice) > Number(parsed.ItemSearchResponse.Items[0].Item[index].OfferSummary[0].LowestNewPrice[0].Amount[0])
        || Number(parsed.ItemSearchResponse.Items[0].Item[index].OfferSummary[0].LowestNewPrice[0].Amount[0]) > Number(maxprice)) {
        index = Math.floor(Math.random() * parsed.ItemSearchResponse.Items[0].Item.length);
        continue;
      } else {
        break;
      }
    }

    //wrap the useful info in variables

    var listofitems = parsed.ItemSearchResponse.Items[0].Item;
    var title = listofitems[index].ItemAttributes[0].Title[0]
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

}

module.exports = amazon;
