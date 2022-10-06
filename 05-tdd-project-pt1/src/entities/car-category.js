const BaseEntity = require('./base/base-entity')

class CarCategory extends BaseEntity {
  carIds

  constructor({
    id,
    name,
    pricePerDay,
  }) {
    super({id, name})
    this.pricePerDay = pricePerDay
    this.carIds = []
  }
}

module.exports = CarCategory