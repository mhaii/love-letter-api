import { createController } from 'awilix-koa'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = blockchainService => ({
  root: async ctx => ctx.ok(),
  lineWebHook: async ctx => {
    console.log('------')
    console.log(ctx.request.body.source.userId)
    console.log('------')
    // blockchainService.testSentMesaage(ctx.request.body)
    ctx.ok()
  }
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .get('', 'root')
  .post('/linewebhook', 'lineWebHook')
