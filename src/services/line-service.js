import request from 'request'

const secret = 'glrGIT7wBrr5mmjaA3mDlI0DLt6M6Ryi4rCipE3Y6w3OcL3o9pxdNjy/wHsb0eN29k4ibYQiCbK4oFH9nDycKr+W5m1rIDJKNjBl+bnQR9WaxwSNQIU9JvklJ/XCHzDGaNY9esQcEBEDNmThFGXF8wdB04t89/1O/w1cDnyilFU='

const card_type = {
  "1" : {
    "name" : "Jib",
    "pic"  : "https://s3-ap-southeast-1.amazonaws.com/love-letter/jib.png",
    "desc" : "Date of birth : 4 July 2002"
  },
  "2" : {
    "name" : "Jane",
    "pic"  : "https://s3-ap-southeast-1.amazonaws.com/love-letter/jane.png",
    "desc" : "Date of birth : 9 March 2000"
  },
  "3" : {
    "name" : "Satchan",
    "pic"  : "https://s3-ap-southeast-1.amazonaws.com/love-letter/satchan.png",
    "desc" : "Date of birth : 13 December 2003"
  },
  "4" : {
    "name" : "Kaimook",
    "pic"  : "https://s3-ap-southeast-1.amazonaws.com/love-letter/kaimook.png",
    "desc" : "Date of birth : 27 August 1997"
  },
  "5" : {
    "name" : "Music",
    "pic"  : "https://s3-ap-southeast-1.amazonaws.com/love-letter/music.png",
    "desc" : "Date of birth : 9 February 2000"
  },
  "6" : {
    "name" : "Orn",
    "pic"  : "https://s3-ap-southeast-1.amazonaws.com/love-letter/orn.png",
    "desc" : "Date of birth : 3 Febrauary 1997"
  },
  "7" : {
    "name" : "Pun",
    "pic"  : "https://s3-ap-southeast-1.amazonaws.com/love-letter/pun.png",
    "desc" : "Date of birth : 9 November 2000"
  },
  "8" : {
    "name" : "Cherprang",
    "pic"  : "https://s3-ap-southeast-1.amazonaws.com/love-letter/charprang.png",
    "desc" : "Date of birth : 2 May 1996"
  }
}

const mock_users_name = {
  "0x9B6cD7B6fFaC89085a41730d27B1e839D8A4520D" : "Bright",
  "0x9AcF7Acdd3325CD488c853F72aF3814Fc7345DA7" : "Ben",
  "0xBf290BD2fF6Bac19Cd1D620b2d4d238B43db649d" : "Film2",
  "0x98df09FE1872AB90dbdbF746e559df00b0aCa4d8" : "Film"
}

function sentLineMessage({user, messages}){
    console.log("sentLineMessage")
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`
    }
    let body = JSON.stringify({
        "to": 'U1a845d6acdfafde68f058205b3189753',
        messages: messages
    })
    console.log(body)
    request.post({
        url: 'https://api.line.me/v2/bot/message/push',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}


export default class LineService {
    
    constructor(userService, blockchainService) {
      this.userService = userService
      this.blockchainService = blockchainService
    }

    async handleWebhook(data){
    if(data.events[0].type == "message"){
       const message = data.events[0].message.text;
       const user = data.events[0].source.userId;
       // sending addr
       if(message.indexOf('0x') == 0 && message.length == 42){
         // To do
         // map line_user_id -> addr
         console.log('mapping')
         console.log(`${user} , ${message}`)
         this.userService.addUserMapping({ user: user, address: message})

         const messageBody = [{ type: "text", text : 'Type "start" to begin the game'}]
         sentLineMessage({user : user, messages: messageBody})
       }else if(message.indexOf('discard-') == 0 ){ // discard
          const card_id = message.split('-')[1]
          // call discard
          const users = await this.userService.getUserMapping()
           const  m1 = [{type:"text", text: `${mock_users_name[users[user]]} discards ${card_type[card_id].name}`}]

           for(var key in mock_users_name) {
              sentLineMessage({user : revesrsUsers[key], messages: m1})
           }

          const targetPlayers = await this.blockchainService.playerDisCard({player: users[user], cardId: card_id})
          let messageBody =        [  { type: "text", text : "Guessing a player's hand (choose only one)"}, {
            "type": "template",
            "altText": "Cards in hand",
            "template": {
              "type": "carousel",
              "actions": [],
              "columns": [
                {
                  "thumbnailImageUrl": `${card_type[1].pic}`,
                  "title": `${card_type[1].name}`,
                  "text": `${card_type[1].desc}`,
                  "actions": [
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[0].toLowerCase()]}`,
                      "text": `guess-1-${targetPlayers.applicableTargetPlayers[0]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[1].toLowerCase()]}`,
                      "text": `guess-1-${targetPlayers.applicableTargetPlayers[1]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[2].toLowerCase()]}`,
                      "text": `guess-1-${targetPlayers.applicableTargetPlayers[2]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${card_type[2].pic}`,
                  "title": `${card_type[2].name}`,
                  "text": `${card_type[2].desc}`,
                  "actions": [
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[0].toLowerCase()]}`,
                      "text": `guess-2-${targetPlayers.applicableTargetPlayers[0]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[1].toLowerCase()]}`,
                      "text": `guess-2-${targetPlayers.applicableTargetPlayers[1]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[2].toLowerCase()]}`,
                      "text": `guess-2-${targetPlayers.applicableTargetPlayers[2]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${card_type[3].pic}`,
                  "title": `${card_type[3].name}`,
                  "text": `${card_type[3].desc}`,
                  "actions": [
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[0].toLowerCase()]}`,
                      "text": `guess-3-${targetPlayers.applicableTargetPlayers[0]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[1].toLowerCase()]}`,
                      "text": `guess-3-${targetPlayers.applicableTargetPlayers[1]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[2].toLowerCase()]}`,
                      "text": `guess-3-${targetPlayers.applicableTargetPlayers[2]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${card_type[4].pic}`,
                  "title": `${card_type[4].name}`,
                  "text": `${card_type[4].desc}`,
                  "actions": [
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[0].toLowerCase()]}`,
                      "text": `guess-4-${targetPlayers.applicableTargetPlayers[0]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[1].toLowerCase()]}`,
                      "text": `guess-4-${targetPlayers.applicableTargetPlayers[1]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[2].toLowerCase()]}`,
                      "text": `guess-4-${targetPlayers.applicableTargetPlayers[2]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${card_type[5].pic}`,
                  "title": `${card_type[5].name}`,
                  "text": `${card_type[5].desc}`,
                  "actions": [
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[0].toLowerCase()]}`,
                      "text": `guess-5-${targetPlayers.applicableTargetPlayers[0]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[1].toLowerCase()]}`,
                      "text": `guess-5-${targetPlayers.applicableTargetPlayers[1]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[2].toLowerCase()]}`,
                      "text": `guess-5-${targetPlayers.applicableTargetPlayers[2]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${card_type[6].pic}`,
                  "title": `${card_type[6].name}`,
                  "text": `${card_type[6].desc}`,
                  "actions": [
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[0].toLowerCase()]}`,
                      "text": `guess-6-${targetPlayers.applicableTargetPlayers[0]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[1].toLowerCase()]}`,
                      "text": `guess-6-${targetPlayers.applicableTargetPlayers[1]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[2].toLowerCase()]}`,
                      "text": `guess-6-${targetPlayers.applicableTargetPlayers[2]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${card_type[7].pic}`,
                  "title": `${card_type[7].name}`,
                  "text": `${card_type[7].desc}`,
                  "actions": [
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[0].toLowerCase()]}`,
                      "text": `guess-7-${targetPlayers.applicableTargetPlayers[0]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[1].toLowerCase()]}`,
                      "text": `guess-7-${targetPlayers.applicableTargetPlayers[1]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[2].toLowerCase()]}`,
                      "text": `guess-7-${targetPlayers.applicableTargetPlayers[2]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${card_type[8].pic}`,
                  "title": `${card_type[8].name}`,
                  "text": `${card_type[8].desc}`,
                  "actions": [
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[0].toLowerCase()]}`,
                      "text": `guess-8-${targetPlayers.applicableTargetPlayers[0]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[1].toLowerCase()]}`,
                      "text": `guess-8-${targetPlayers.applicableTargetPlayers[1]}`
                    },
                    {
                      "type": "message",
                      "label": `${mock_users_name[targetPlayers.applicableTargetPlayers[2].toLowerCase()]}`,
                      "text": `guess-8-${targetPlayers.applicableTargetPlayers[2]}`
                    }
                  ]
                }
              ]
            }
          }]

          sentLineMessage({user : user, messages: messageBody})
      
       }else if(message.indexOf('guess-') == 0 ){ // guess
         const card_id = message.split('-')[1]
         const target_player = message.split('-')[2]
         
         
         const users = await this.userService.getUserMapping()
         const revesrsUsers = await this.userService.getReverseUserMapping()
          const addr = users[user]

         // boardcase message
         const messageBody = [{type:"text", text: `${mock_users_name[addr]} guess ${mock_users_name[target_player.toLowerCase()]} has ${card_type[card_id].name}`}]

         for(var key in mock_users_name) {
            sentLineMessage({user : revesrsUsers[key], messages: messageBody})
         } 
          
         // call guessplayer
         this.blockchainService.guessPlayerHand({player: target_player, cardId : card_id})
         
       }else if(message == 'start'){
          // call addPlayer
          const users = await this.userService.getUserMapping()
          const addr = users[user]
          
          let results = await Promise.all([this.blockchainService.addPlayerToGame(addr)])
          
       }
    }
  }

  async sentPlayerLost({player}){
    console.log('sentPlayerLost')
    const messageBody = [{type:"text", text: `${mock_users_name[player]} is dead!!!`}]
    const users = await this.userService.getUserMapping()

     for(var key in mock_users_name) {
            sentLineMessage({user : users[key], messages: messageBody})
      }
  }

  async sendNextTurn({player,cardId,drawnCardId}){
    console.log('sendNextTurn')

    const messageBody = [ { type: "text", text : "Draw!! You can keep only one card. Please choose a card to be discarded."} ,        {
            "type": "template",
            "altText": "Cards in hand",
            "template": {
              "type": "carousel",
              "actions": [],
              "columns": [
                {
                  "thumbnailImageUrl": `${card_type[cardId].pic}`,
                  "title": `${card_type[cardId].name}`,
                  "text": `${card_type[cardId].desc}`,
                  "actions": [
                    {
                      "type": "message",
                      "label": "discard",
                      "text": `discard-${cardId}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${card_type[drawnCardId].pic}`,
                  "title": `${card_type[drawnCardId].name}`,
                  "text": `${card_type[drawnCardId].desc}`,
                  "actions": [
                    {
                      "type": "message",
                      "label": "discard",
                      "text": `discard-${drawnCardId}`
                    }
                  ]
                }
              ]
            }
          }]

    const revesrsUsers = await this.userService.getReverseUserMapping()
    console.log(revesrsUsers)
    consoel.log(revesrsUsers[player])
    sentLineMessage({user: revesrsUsers[player], messages: messageBody})
  }


}
