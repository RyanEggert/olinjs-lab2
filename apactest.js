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

//keyword dictionary?

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

var amazon = function (money, searchindices) {
  var matchprod = [];
  var minprice = (money * 0.9).toString; // prices are in cents
  var maxprice = (money * 1.1).toString;

  // give a random search indix if there is no indices provided
  if (!searchindices) {
    searchindices = searchindiceslist[Math.floor(Math.random() * searchindices.length)];
  }

  opHelper.execute('ItemSearch', {
    'Keywords': ' ',
    'SearchIndex': searchindices,
    'Avaliability': 'Avaliable',
    'MinimumPrice': minprice,
    'MaximumPrice': maxprice,
    'ResponseGroup': 'ItemAttributes, Offers, Images'
  }, function (err, parsed, raw) {
    if (err) {
      console.log(err);
    }
    var listofitems = parsed.ItemSearchResponse.Items[0].Item;
    console.log(listofitems[0].LargeImage[0].Height); // accessing a main image and its height.
    // console.log(listofitems[0].ImageSets[0].ImageSet) // image sets are all of a product's images.
    // try except: find in js

    // try:
    //   find large image
    // except someerror,e:
    //   find medium image


    // Verify that prices are within our range.
    var itemres = parsed.ItemSearchResponse.Items;

    var items = itemres[0].Item;
    for (var i = 0; i <= items.length - 1; i++) {
      console.log(items[i].OfferSummary[0].LowestNewPrice);
      if (Number(minprice) < Number(items[i].OfferSummary[0].LowestNewPrice) < Number(maxprice)) {
        matchprod.push(items[i]);
      }
    }
    console.log('res');
    console.log(matchprod[1].OfferSummary[0].LowestNewPrice);
  });

}

// In the end, we want a product name, a product image (as url), a product price, link to product page on amazon, description text.

//put this into a function
  // input: maxprice, ...
  // output: object of desired attributes for one product

module.exports = Amazon;
