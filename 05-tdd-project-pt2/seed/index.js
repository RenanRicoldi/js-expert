const { writeFile } = require('fs/promises')
const { join } = require('path')
const faker = require('faker')

const CarCategory = require('../src/entities/car-category')
const Car = require('../src/entities/car')
const Customer = require('../src/entities/customer')

const seederBaseFolder = join(__dirname, '..', 'database')
const ITENS_AMOUNT = 13

const carCategory = new CarCategory({
  id: faker.random.uuid(),
  name: faker.vehicle.type(),
  pricePerDay: faker.finance.amount(20, 100)
})

const cars = []
const customers = []

for(let i = 0; i < ITENS_AMOUNT; i += 1) {
  const car = new Car({
    id: faker.random.uuid(),
    name: faker.vehicle.model(),
    available: true
  })

  carCategory.carIds.push(car.id)

  cars.push(
    car  
  )

  customers.push(new Customer({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    age: faker.random.number({ min: 18, max: 70 })
  }))
}

const write = (filename, data) => writeFile(join(seederBaseFolder, filename), JSON.stringify(data))

;(async () => {
  await write('cars.json', cars)
  await write('car-categories.json', carCategory)
  await write('customers.json', customers)
})()