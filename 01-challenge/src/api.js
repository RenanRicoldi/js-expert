const http = require('http')
const carController = require("./controller/car-controller")

const routes = {
  [carController.baseRoute]: carController.routes
}

async function handler (request, response) {
  try {
    const { url, method } = request
    const [baseRoute, relativeRoute] = url.slice(1).split(':')[0].split('/')
    const routeHandler = routes[baseRoute][relativeRoute]
    const methodHandler = routeHandler 
    ? routeHandler[method.toLowerCase()] 
    : routes.default
  
    const result = await methodHandler(request, response)
    response.writeHead(200, { 
      'Content-Type': 'application/json'
    })
    response.write(JSON.stringify(result))
    return response.end()
  } catch(error) {
    error = JSON.parse(error.message)

    response.writeHead(error.status ?? 500, { 
      'Content-Type': 'application/json'
    })

    response.write(JSON.stringify({
      error: error.message || "Internal server error"
    }))
    return response.end()
  } 
}

const app = http.createServer(handler)
  .listen(3000, () => console.log('app running at', 3000))

module.exports = app