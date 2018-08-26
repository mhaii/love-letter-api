import fs from 'fs'
import path from 'path'

const userFilePath = path.join(__dirname, '../../files/users.json')

export default class UserService {
  async getUserMapping() {
    if (!this.users) {
      try {
        const userJson = fs.readFileSync(userFilePath, 'utf8')
        this.users = JSON.parse(userJson)
      } catch (e) {
        console.log(e)
        this.users = {}
      }
    }

    return this.users
  }

  async getReverseUserMapping() {
    if (!this.addresses) {
      this.addresses = await this.getUserMapping().then(users =>
        Object.keys(users).reduce((col, key) => {
          col[users[key]] = key
          return col
        }, {})
      )
    }

    return this.addresses
  }

  async addUserMapping({ user, address }) {
    console.log('addUserMapping')
    await Promise.all([
      this.getUserMapping().then(list => {
        list[user] = address
      }),
      this.getReverseUserMapping().then(list => {
        list[address] = user
      })
    ]).then(async () => this._saveToFile())
   /* let users = await this.getUserMapping()
    console.log(users[user])
    if(!users[user]) {
      users[user] = address
      console.log(users)
      fs.writeFileSync(userFilePath, JSON.stringify(users))
    } */
    
  }

  async _saveToFile() {
    fs.writeFileSync(userFilePath, JSON.stringify(await this.getUserMapping()))
  }
}
