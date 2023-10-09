const getAddress = require('./get-address');
const BaseXform = require('../base-xform');

class SortStateConditionXform extends BaseXform {
  get tag() {
    return 'sortCondition';
  }

  render(xmlStream, model) {
    if (model) {
      const address = getAddress(model.address);
      if (address) {
        xmlStream.leafNode(this.tag, {ref: address, descending: +!!model.desc});
      }
    }
  }

  parseOpen(node) {
    if (node.name === this.tag) {
      this.model = node.attributes.ref;
    }
  }
}

module.exports = SortStateConditionXform;
