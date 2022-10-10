const BaseEntity = require('./base/base-entity')

class Car extends BaseEntity {
  constructor({
    id,
    name,
    available,
  }) {
    super({id, name})
    this.available = available
  }
}

module.exports = Car