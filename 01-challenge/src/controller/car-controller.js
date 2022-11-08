const { join } = require('path')
const CarService = require('../service/car-service')
const carsDatabase = join(__dirname, '..', '..', 'database', "cars.json")
const carCategoriesDatabase = join(__dirname, '..', '..', 'database', "car-categories.json")

const carService = new CarService({
  carsFile: carsDatabase,
  carCategoriesFile: carCategoriesDatabase
})

const getRandomCarInCategory = async (request) => {
  const pathParam = request.url.split(':').pop()

  if(!pathParam)
    throw new Error(JSON.stringify({
      status: 400,
      message: "Missing car category id"
    }))

  return {
    carId: carService.chooseRandomCarInCarCategory(await carService.getCarCategoryById(pathParam))
  }
}

const getAvailableCarInCategory = async (request) => {
  const pathParam = request.url.split(':').pop()

  if(!pathParam)
    throw new Error(JSON.stringify({
      status: 400,
      message: "Missing car category id"
    }))

  return {
    car: await carService.getAvailableCarInCarCategory(await carService.getCarCategoryById(pathParam))
  }
}

const calculateRentalPrice = async (request, response) => {
  let rentalPrice = 'R$ 0,00'
  for await (const data of request) {
    const { customerAge, carCategoryId, numberOfDays } = JSON.parse(data)

    if(!customerAge || !carCategoryId || !numberOfDays) {
      response.writeHead(400, { 
        'Content-Type': 'application/json'
      })
  
      response.write(JSON.stringify({
        error: "Missing information on body"
      }))
      response.end()
      continue
    }

    const carCategory = await carService.getCarCategoryById(carCategoryId)

    rentalPrice = carService.calculateFinalPrice({age: Number(customerAge)}, carCategory, Number(numberOfDays))
  }

  return {
    rentalPrice
  }
}

const rentACar = async (request, response) => {
  let transaction = {}
  for await (const data of request) {
    const { customer, carCategoryId, numberOfDays } = JSON.parse(data)

    if(!customer || !carCategoryId || !numberOfDays) {
      response.writeHead(400, { 
        'Content-Type': 'application/json'
      })
  
      response.write(JSON.stringify({
        error: "Missing information on body"
      }))
      response.end()
      continue
    }

    const carCategory = await carService.getCarCategoryById(carCategoryId)

    transaction = await carService.rent(customer, carCategory, Number(numberOfDays))
  }

  return {
    transaction
  }
}

const carController = {
  baseRoute: 'car',
  routes: {
    'random-car-in-category': {
      get: getRandomCarInCategory
    },
    'available-car-in-category': {
      get: getAvailableCarInCategory
    },
    'calculate-rental-price': {
      post: calculateRentalPrice
    },
    'rent': {
      post: rentACar
    }
  },
  
}

module.exports = carController