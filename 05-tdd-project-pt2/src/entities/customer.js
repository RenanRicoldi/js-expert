const BaseEntity = require('./base/base-entity')

class Customer extends BaseEntity {
  constructor({
    id,
    name,
    age,
  }) {
    super({id, name})
    this.age = age
  }
}

module.exports = Customer