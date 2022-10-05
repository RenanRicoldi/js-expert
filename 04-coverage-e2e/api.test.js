const { describe, it } = require('mocha')
const request = require('supertest')
const app = require('./api')
const assert = require('assert')

describe('API Suite test', () => {
  describe('/contact', () => {
    it('should request the contact page and return HTTP Status 200', async () => {
      const response = await request(app)
        .get('/contact')
        .expect(200)
      assert.deepStrictEqual(response.text, JSON.stringify({
        phone: '+55 (43) 99839-2240'
      }))
    })
  })

  describe('/hello', () => {
    it('should request an inexistent route /hi and redirect to /hello', async () => {
      const response = await request(app)
        .get('/hi')
        .expect(200)

      assert.deepStrictEqual(response.text, JSON.stringify({
        error: 'route not found!'
      }))
    })
  })
  describe('/login', () => {
    it('should login successfully on the login route and return HTTP Status 200', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: "Admin", password: "password"})
        .expect(200)

      assert.deepStrictEqual(response.text, JSON.stringify({
        token: "$123123asdf.adasf2134m123fsda.asf",
      }))
    })
      
    it('should unauthorize a request when requesting it using wrong credentials and return HTTP Status 401', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: "User", password: "wrong password"})
        .expect(401)

      assert.ok(response.unauthorized)
      assert.deepStrictEqual(response.text, JSON.stringify({
        error: 'Invalid credentials'
      }))
    })
  })
})