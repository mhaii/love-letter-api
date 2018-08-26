import Web3 from 'web3'
import fs from 'fs'
// import net from 'net'
import path from 'path'

import Transaction from 'ethereumjs-tx'

const contractAddr = '0x577572b53Ea3f14841dcAbe028b376A6f5D27119'

let httpProvider = new Web3.providers.HttpProvider(
  'https://kovan.infura.io/e5754c82c46a4ea8aeb0e76296b541e7'
)
let wsProvider = new Web3.providers.WebsocketProvider(
  'wss://kovan.infura.io/ws'
)
// let localRpcProvider = new Web3.providers.IpcProvider('https://kovan.infura.io/e5754c82c46a4ea8aeb0e76296b541e7', net.Socket())

const web3 = new Web3(httpProvider)
const web3e = new Web3(wsProvider)

const addr = '0x791AC60628ed34b989CC8FC7359cebd96a220455'
const pk = 'ae2ff12b13903ebc048f3c4d6956cb3235aeace66a60de148fd24e2634511b97'

export default class BlockchainService {
  constructor() {
    const abi = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../files/abi.json'))
    )
    this.contract = new web3.eth.Contract(abi, contractAddr)
    this.contractEvent = new web3e.eth.Contract(abi, contractAddr)
  }

  async createTransaction({ abi, gasLimit = 3000000 }) {
    const txCountPromise = web3.eth.getTransactionCount(addr, 'pending')
    const gasPricePromise = web3.eth.getGasPrice()
    const [txCount, gasPrice] = await Promise.all([
      txCountPromise,
      gasPricePromise
    ])

    const tx = new Transaction({
      nonce: txCount,
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      to: contractAddr,
      value: '0x00',
      data: abi.encodeABI()
    })

    tx.sign(Buffer.from(pk, 'hex'))

    return web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'))
  }

  async getEventPromise(){
    const eventPromise = new Promise((resolve, reject) => {
      this.contractEvent.once('NextTurn', {}, (err, res) => {
        console.log('NextTurn')
        console.log(`${JSON.stringify(res.returnValues)}`.replace('Result ',''))
        const obj = JSON.parse(`${JSON.stringify(res.returnValues)}`.replace('Result ',''))

        if (!err) resolve({
          "type" : "NextTurn",
          "values" : {player: obj.player, cardId: obj.cardId, drawnCardId: obj.drawnCardId}
        })
        else reject(err)
      })

      this.contractEvent.once('PlayerLose', {}, (err, res) => {
        console.log('PlayerLose')
        console.log(`${JSON.stringify(res.returnValues)}`.replace('Result ',''))
        const obj = JSON.parse(`${JSON.stringify(res.returnValues)}`.replace('Result ',''))
        
        if (!err) resolve({
          "type" : "PlayerLose",
          "values" : {player: obj.loser}
        })
        else reject(err)
      })

      
    })

    eventPromise.then(e => {
      console.log('3')
    })

    return eventPromise
  }

  async playerDisCard({player,cardId}) {
    const eventPromise = new Promise((resolve, reject) => {
      this.contractEvent.once('GuessingPlayerHand', {}, (err, res) => {
        console.log('GuessingPlayerHand')
        console.log(`${JSON.stringify(res.returnValues)}`.replace('Result ',''))
        const obj = JSON.parse(`${JSON.stringify(res.returnValues)}`.replace('Result ',''))

        if (!err) resolve(obj)
        else reject(err)
      })
    })

    eventPromise.then(e => {
      console.log('1')
    })

    this.createTransaction({
      abi: this.contract.methods.useCard(cardId,player)
    })
      .then(e => {
        // console.log(e)
        console.log('done discard')
      })
      .catch(e => {
        console.log(e)
        console.log('fuck discard')
      })

      return eventPromise

  }

  async guessPlayerHand({player,cardId}) {

    console.log('guessPlayerHand')
    console.log(player)
    console.log(cardId)
    this.createTransaction({
      abi: this.contract.methods.guessPlayerHand(player,cardId)
    })
      .then(e => {
        // console.log(e)
        console.log('done guessPlayerHand')
      })
      .catch(e => {
        console.log(e)
        console.log('fuck guessPlayerHand')
      })

  }

  async addPlayerToGame(addr) {
    const eventPromise = new Promise((resolve, reject) => {
      this.contractEvent.once('PlayerAdded', {}, (err, res) => {
        console.log('PlayerAdded')
        if (!err) resolve('ok')
        else reject(err)
      })
      this.contractEvent.once('PlayerBalanceInsufficient', {}, (err, res) => {
        console.log('PlayerBalanceInsufficient')
        if (!err) resolve(res)
        else reject(err)
      })
    })

    eventPromise.then(e => {
      console.log('1')
    })

    this.createTransaction({
      abi: this.contract.methods.addPlayer(addr)
    })
      .then(e => {
        // console.log(e)
        console.log('done addPlayer')
      })
      .catch(e => {
        console.log(e)
        console.log('fuck addPlayer')
      })

      return eventPromise
  }
}
