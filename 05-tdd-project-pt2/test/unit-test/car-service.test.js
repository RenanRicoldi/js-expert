const { expect } = require('chai')
const { describe, it, before, beforeEach, afterEach } = require('mocha')
const { join } = require('path')
const sinon = require('sinon')

const carsDatabase = join(__dirname, './../../database', "cars.json")
const CarService = require('./../../src/service/car-service')

const mocks = {
  validCarCategory: require('./../mocks/valid-car-category.json'),
  validCar: require('./../mocks/valid-car.json'),
  validCustomer: require('./../mocks/valid-customer.json'),
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
})