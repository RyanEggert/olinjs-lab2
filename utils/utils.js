utilities = {};

var module_exists = function (name) {
  try {
    var modloc = require.resolve(name);
    return true;
  } catch (e) {
    return false;
  }
};
utilities.module_exists = module_exists;

var grouped_each = function (every, context, options) {
  var out = "",
    subcontext = [],
    i;
  if (context && context.length > 0) {
    for (i = 0; i < context.length; i++) {
      if (i > 0 && i % every === 0) {
        out += options.fn(subcontext);
        subcontext = [];
      }
      subcontext.push(context[i]);
    }
    out += options.fn(subcontext);
  }
  return out;
};

// grouped_each found @ http://funkjedi.com/technology/412-every-nth-item-in-handlebars/

utilities.grouped_each = grouped_each;

module.exports = utilities;
