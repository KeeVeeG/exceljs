const colCache = require('../../../utils/col-cache');

const getAddress = function(addr) {
  if (typeof addr === 'string') {
    return addr;
  }
  return colCache.getAddress(addr.row, addr.column).address;
};

module.exports = getAddress;
