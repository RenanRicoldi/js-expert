const { expect } = require('chai')
const { describe, it, before, beforeEach, afterEach } = require('mocha')
const { join } = require('path')
const sinon = require('sinon')

const carsDatabase = join(__dirname, '..', '..', 'database', "cars.json")
const CarService = require('../../src/service/car-service')
const Transaction = require('../../src/entities/transaction')

const mocks = {
  validCarCategory: require('../mocks/valid-car-category.json'),
  validCar: require('../mocks/valid-car.json'),
  validCustomer: require('../mocks/valid-customer.json'),
}

describe('Car Service Suite Tests', () => {
  let carService = {}

  // sandbox object of sinon with its own spies, stubs and mocks
  let sandbox = {}
  
  before(() => {
    carService = new CarService({
      cars: carsDatabase
    })
  })
  
  // creates a new sandbox instance each time
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should retrieve a random position from an array', () => {
    const data = [0, 1, 2, 3, 4]
    const result = carService.getRandomPositionFromArray(data)

    expect(result).to.be.lte(data.length).and.be.gte(0)
  })

  it('should choose the first id from carIds in carCategory', () => {
    const carCategory = mocks.validCarCategory
    const carIdIndex = 0

    // since we already tested getRandomPositionFromArray, we can simulate its behavior...
    // to validate a part of our test
    sandbox.stub(
      carService,
      carService.getRandomPositionFromArray.name
    ).returns(carIdIndex)

    const result = carService.chooseRandomCarInCarCategory(carCategory)
    const expected = carCategory.carIds[carIdIndex]
    
    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
    expect(result).to.be.equal(expected)
  })

  it('given a carCategory it should return an available car', async () => {
    const car = mocks.validCar
    const carCategory = Object.create(mocks.validCarCategory)
    carCategory.carIds = [car.id]
    
    sandbox.stub(
      carService.carRepository,
      carService.carRepository.find.name,
    ).resolves(car)

    sandbox.spy(
      carService,
      carService.chooseRandomCarInCarCategory.name,
    )
    
    const result = await carService.getAvailableCarInCarCategory(carCategory)
    const expected = car
    
    expect(carService.chooseRandomCarInCarCategory.calledOnce).to.be.ok
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok
    expect(result).to.be.deep.equal(expected)
  })

  it('given a car category, customer and number of days, it should calculate the final amount in BRL', async() => {
    const customer = Object.create(mocks.validCustomer)
    const carCategory = Object.create(mocks.validCarCategory)
    const numberOfDays = 5
    
    customer.age = 50
    carCategory.price = 37.6

    // do not depend on external data.
    sandbox.stub(
        carService,
        "taxesBasedOnAge"
    ).get(() => [{ from: 40, to: 50, then: 1.3 }])
    
    const expected = carService.currencyFormat.format(436.93)
    const result = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    )

    expect(result).to.be.deep.equal(expected)
  })

  it('given a customer and a car category it should return a transaction receipt', async () => {
    const car = mocks.validCar
    const customer = Object.create(mocks.validCustomer)
    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id]
    }

    const numberOfDays = 5
    const dueDate = "10 de novembro de 2020"
    const now = new Date(2020, 10, 5)
    
    customer.age = 20
    
    sandbox.useFakeTimers(now.getTime())

    sandbox.stub(
      carService.carRepository,
      carService.carRepository.find.name,
    ).resolves(car)
    
    const expectedAmount = carService.currencyFormat.format(369.71)
    
    const result = await carService.rent(
      customer, carCategory, numberOfDays
    )

    const expected = new Transaction({
      customer,
      car,
      dueDate,
      amount: expectedAmount,
    })

    expect(result).to.be.deep.equal(expected)
  })
})