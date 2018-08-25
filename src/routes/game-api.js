import { createController } from 'awilix-koa'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = (blockchainService, userService) => ({
  root: async ctx => ctx.ok(),

  lineWebHook: async ctx => {
    console.log('------')
    console.log(JSON.stringify(ctx.request.body))
    console.log('------')
    // blockchainService.testSentMesaage(ctx.request.body)
    ctx.ok()
  },

  listUsers: async ctx => {
    ctx.ok(await userService.getReverseUserMapping())
  },

  joinGame: async ctx => {
    const address = (await userService.getUserMapping())['1234']
    const a = blockchainService.addPlayerToGame(address)

    console.log('wait for await')
    console.log(await a)
    ctx.ok()
  }
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .get('', 'root')
  .get('/users', 'listUsers')
  .post('/linewebhook', 'lineWebHook')
  .get('/join', 'joinGame')
