const BaseRepository = require('../repository/base')
const Tax = require('../entities/tax')
const Transaction = require('../entities/transaction')

class CarService {
  constructor({ carsFile }) {
    this.carRepository = new BaseRepository({ file: carsFile })
    this.taxesBasedOnAge = Tax.taxesBasedOnAge
    this.currencyFormat = new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  getRandomPositionFromArray(list) {
    return Math.floor(
      Math.random() * (list.length)
    )
  }

  chooseRandomCarInCarCategory(carCategory) {
    const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds)

    return carCategory.carIds[randomCarIndex]
  }

  async getAvailableCarInCarCategory(carCategory) {
    const carId = this.chooseRandomCarInCarCategory(carCategory)

    return this.carRepository.find(carId)
  }

  calculateFinalPrice({ age }, carCategory, numberOfDays) {
    const price = carCategory.price 

    const { then: tax } = this.taxesBasedOnAge
      .find(tax => age >= tax.from && age <= tax.to)

    const finalPrice = ((tax * price) * (numberOfDays))
    const formattedPrice = this.currencyFormat.format(finalPrice)

    return formattedPrice
  }

  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCarInCarCategory(carCategory)
    const finalPrice = await this.calculateFinalPrice(customer, carCategory, numberOfDays)

    const today = new Date()
    today.setDate(today.getDate() + numberOfDays)

    const options = { year: "numeric", month: "long", day: "numeric"}
    const dueDate = today.toLocaleDateString("pt-br", options)

    const transaction = new Transaction({
      customer,
      dueDate,
      car,
      amount: finalPrice
    })
    
    return transaction;
  }
}

module.exports = CarService