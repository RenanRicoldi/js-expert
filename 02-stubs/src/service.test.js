const Service = require('./service')
const sinon = require('sinon')

const BASE_URL_1 = 'https://swapi.dev/api/planets/1'
const BASE_URL_2 = 'https://swapi.dev/api/planets/2'
const mocks = {
  tatooine: require('./mocks/tatooine.json'),
  alderaan: require('./mocks/alderaan.json')
}

;(async () => {
  // Really calls the API on the web
  // {
  //   const service = new Service()
  //   const withoutStub = await service.get(BASE_URL_2)
  //   console.log(JSON.stringify(withoutStub))
  // }

  const service = new Service()
    const stub = sinon.stub(service, service.get.name)

    stub
    .withArgs(BASE_URL_1)
    .resolves(mocks.tatooine)
    
    stub
    .withArgs(BASE_URL_2)
    .resolves(mocks.alderaan)
  
  {
    const response = await service.get(BASE_URL_1)
    console.log('response', response)
  }
  {
    const response = await service.get(BASE_URL_2)
    console.log('response', response)
  }
})()