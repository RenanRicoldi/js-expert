const BaseRepository = require('../repository/base')

class CarService {
  constructor({ carsFile }) {
    this.carRepository = new BaseRepository({ file: carsFile })
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
}

module.exports = CarService