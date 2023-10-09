const getAddress = require('./get-address');
const BaseXform = require('../base-xform');

const SortStateConditionXform = require('./sort-state-condition-xform');

class SortStateXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      sortStateCondition: new SortStateConditionXform(),
    };
  }

  get tag() {
    return 'sortState';
  }

  render(xmlStream, model) {
    if (model) {
      const firstAddress = getAddress(model.from);
      const secondAddress = getAddress(model.to);
      if (firstAddress && secondAddress) {
        xmlStream.openNode(this.tag, {ref: `${firstAddress}:${secondAddress}`});
        this.map.sortStateCondition.render(xmlStream, model.condition);
        xmlStream.closeNode();
      }
    }
  }

  parseOpen(node) {
    if (node.name === this.tag) {
      this.model = node.attributes.ref;
    }
  }
}

module.exports = SortStateXform;
