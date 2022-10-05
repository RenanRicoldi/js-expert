const http = require('http')
const DEFAULT_USER = { username: "Admin", password: "password"}

const routes = {
  contact: {
    get: (_req, res) => {
      res.write(JSON.stringify({
        phone: '+55 (43) 99839-2240'
      }))
      return res.end();
    }
  },
  login: {
    post: async (req, res) => {
      for await (const data of req) {
        const user = JSON.parse(data)
        if(
            user.username !== DEFAULT_USER.username ||
            user.password !== DEFAULT_USER.password
        ) {
          res.writeHead(401)
          res.write(JSON.stringify({
            error: 'Invalid credentials'
          })  ) 
          return res.end()
        }

        res.write(JSON.stringify({
          token: "$123123asdf.adasf2134m123fsda.asf",
        }))
        return res.end()
      }
    }
  },
    default: (_req, res) => {
        res.write(JSON.stringify({
          error: 'route not found!'
        }))
        return res.end();
    }
}

const handler = function (request, response) {
    const { url, method } = request
    const routeHandler = routes[url.slice(1)]
    const methodHandler = routeHandler ? routeHandler[method.toLowerCase()] : routes.default
    
    response.writeHead(200, { 
      'Content-Type': 'application/json'
    })
    return methodHandler(request, response)
}

const app = http.createServer(handler)
  .listen(3000, () => console.log('app running at', 3000))

module.exports = app