import Web3 from 'web3'
import fs from 'fs'
// import net from 'net'
import path from 'path'

import Transaction from 'ethereumjs-tx'

const contractAddr = '0x7FCD6D483eE3B7110bCeBAE9f25CEBA917e9DCd9'

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

  async addPlayerToGame(addr) {
    const eventPromise = new Promise((resolve, reject) => {
      this.contractEvent.once('PlayerAdded', {}, (err, res) => {
        if (!err) resolve(res)
        else reject(err)
      })
      this.contractEvent.once('PlayerBalanceInsufficient', {}, (err, res) => {
        if (!err) resolve(res)
        else reject(err)
      })
    })

    eventPromise.then(e => {
      console.log(1)
      console.log(e)
      console.log('2')
    })

    this.createTransaction({
      abi: this.contract.methods.addPlayer(addr)
    })
      .then(e => {
        console.log(e)
        console.log('aha')
      })
      .catch(e => {
        console.log(e)
        console.log('fuck')
      })

    console.log('returning promise')
    return eventPromise
  }
}
