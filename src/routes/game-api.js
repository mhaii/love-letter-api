import { createController } from 'awilix-koa'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = (blockchainService, userService, lineService) => ({
  root: async ctx => ctx.ok(),

  lineWebHook: async ctx => {
    lineService.handleWebhook(ctx.request.body)
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
  },
  runEvents : async ctx => {
  	console.log('event running')
  	while(true){
      let result = await blockchainService.getEventPromise();
      console.log(result)
      if(result.type == 'NextTurn'){
      	lineService.sendNextTurn(result.values)
      }else if(result.type == 'PlayerLose'){
      	console.log('come come')
      	lineService.sentPlayerLost(result.values)
      }
  	}
  }
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .get('', 'root')
  .get('/users', 'listUsers')
  .get('/runEvents', 'runEvents')
  .post('/linewebhook', 'lineWebHook')
  .get('/join', 'joinGame')

