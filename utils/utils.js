utilities = {};

var module_exists = function(name) {
  try {
    var modloc = require.resolve(name);
    return true;
  } catch (e) {
    return false;
  }
};
utilities.module_exists = module_exists;

module.exports = utilities;
