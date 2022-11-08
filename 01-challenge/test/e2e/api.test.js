const app = require('../../src/api')
const { describe, it } = require('mocha')
const { expect } = require('chai')
const request = require('supertest')

const mocks = {
  validCarCategory: require('../mocks/valid-car-category.json'),
  validCustomer: require('../mocks/valid-customer.json'),
}

describe('API Suite test', () => {
  describe('GET /car/random-car-in-category', () => {
    it('should get a random car in the given category', async () => {{
      const carCategory = mocks.validCarCategory

      const response = await request(app)
        .get(`/car/random-car-in-category:${carCategory.id}`)
        .expect(200)

      expect(response.body.carId).to.be.oneOf(carCategory.carIds)
    }})
  })

  describe('GET /car/available-car-in-category', () => {
    it('should get an available car in the given category', async () => {{
      const carCategory = mocks.validCarCategory

      const response = await request(app)
        .get(`/car/available-car-in-category:${carCategory.id}`)
        .expect(200)

      expect(response.body.car.available).to.be.equal(true)
    }})
  })

  describe('POST /car/calculate-rental-price', () => {
    it('should get an available car in the given category', async () => {{
      const carCategory = mocks.validCarCategory

      const body = {
        customerAge: 21,
        carCategoryId:  carCategory.id,
        numberOfDays: 2
      }

      const response = await request(app)
        .post(`/car/calculate-rental-price`)
        .send(body)
        .expect(200)

      expect(response.body.rentalPrice).to.be.equal("R$ 147,88")
    }})
  })

  describe('POST /car/rent', () => {
    it('should get an available car in the given category', async () => {{
      const carCategory = mocks.validCarCategory
      const customer = mocks.validCustomer

      const body = {
        customer,
        carCategoryId: carCategory.id,
        numberOfDays: 23
      }
      

      const {body: responseBody} = await request(app)
        .post(`/car/rent`)
        .send(body)
        .expect(200)

      expect(responseBody.transaction.customer).to.be.deep.equal(customer)
      expect(responseBody.transaction.car.id).to.be.oneOf(carCategory.carIds)
      expect(responseBody.transaction.amount).to.be.equal('R$ 2.009,88')
      expect(responseBody.transaction.dueDate).to.exist
    }})
  })
})