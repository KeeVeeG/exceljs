const getAddress = require('./get-address');
const BaseXform = require('../base-xform');

const SortStateXform = require('./sort-state-xform');

class AutoFilterXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      sortState: new SortStateXform(),
    };
  }

  get tag() {
    return 'autoFilter';
  }

  render(xmlStream, model) {
    if (model) {
      if (typeof model === 'string') {
        // assume range
        xmlStream.leafNode(this.tag, {ref: model});
      } else {
        const firstAddress = getAddress(model.from);
        const secondAddress = getAddress(model.to);
        if (firstAddress && secondAddress) {
          const ref = `${firstAddress}:${secondAddress}`;
          if (model.state) {
            xmlStream.openNode(this.tag, {ref});
            this.map.sortState.render(xmlStream, model.state);
            xmlStream.closeNode();
          } else {
            xmlStream.leafNode(this.tag, {ref});
          }
        }
      }
    }
  }

  parseOpen(node) {
    if (node.name === this.tag) {
      this.model = node.attributes.ref;
    }
  }
}

module.exports = AutoFilterXform;
