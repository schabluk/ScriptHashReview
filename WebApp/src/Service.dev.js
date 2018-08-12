import axios, { get } from 'axios'
import nOS from '@nosplatform/api-functions'
import { u, wallet } from '@cityofzion/neon-js'
import faker from 'faker'

import Tokens from './Tokens'

/*
 * Axios config.
 */
const config = {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json',
  },
  timeout: 3000,
  validateStatus (status) {
    return status >= 200 && status < 300
  },
}

/*
 * Only 'data' property will be returned from the request. This will simplify
 * data processing, as it won't be neccesary to call .then()
 * to return the request.data.
 * See: https://github.com/axios/axios#response-schema
 */
axios.interceptors.response.use(({data}) => data)

// Fake request delay.
const Delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random()*(max-min+1)+min)
}

const { finance, random, lorem } = faker

const tokens = Object.values(Tokens).map(
  ({ companyName: name, symbol, image, networks }) => ({
    name,
    symbol,
    image,
    hash: networks[1].hash
  })
)

/*
 * Smart Contract Script Hash.
 * Deployed via API.
 */
const contractHash = '7f02c3462f5c6ea49dcbc28442857f2c0102e5ce'
const contractAddress = 'AaU3jaE9Hm3YYG7ydBgWmZ3L3TbGPSpcLn'

/*
 * Service Bus.
 */
const Service = {
  notifications: {
    async tokens () {
      try {
        return await get(`http://notifications.neeeo.org/v1/tokens`, config)
      } catch ({message}) {
        throw new Error(`Failed to fetch tokens data: ${message}`)
      }
    },
  },
  contract: {
    async invoke (args, operation) {
      try {
        console.log(JSON.stringify({
          scriptHash: contractHash, operation, args
        }))
        const encodeArgs = args => args.map(arg => {
          if (typeof arg === 'string') return u.str2hexstring(arg)
          if (typeof arg === 'number') return u.int2hex(arg)
          if (Array.isArray(arg)) return encodeArgs(arg)
          if (wallet.isAddress(arg)) {
            return u.reverseHex(wallet.getScriptHashFromAddress(arg))
          }
          return arg
        })
        return await nOS.testInvoke({
          scriptHash: contractHash, operation, args: encodeArgs(args), encodeArgs: false
        })
        .then(data => {
          const { stack, state } = data

          // console.log(JSON.stringify(state))
          // console.log(JSON.stringify(stack))

          const print = stack =>
            stack.map(o => {
              if (Array.isArray(o.value)) {
                return print(o.value)
              } else {
                if (wallet.isAddress(wallet.getAddressFromScriptHash(u.reverseHex(o.value)))) {
                  return wallet.getAddressFromScriptHash(u.reverseHex(o.value))
                } else {
                  return u.hexstring2str(o.value)
                }
              }
            })

          return print(stack)
        })
        .catch(error => console.error(error))
      } catch (error) {
        throw new Error(`Operation '${operation}': ${error.message}`)
      }
    },
    addReview (reviewOwner, scriptHash, rating, comment) {
      return this.invoke(Array.from(arguments), 'addReview')
    },
    getReview (reviewOwner, scriptHash) {
      return this.invoke(Array.from(arguments), 'getReview')
    },
    getNumberOfReviews (address, scriptHash) {
      return this.invoke(Array.from(arguments), 'getNumberOfReviews')
    },
    getReviewForScriptHash (address, scriptHash, number) {
      return this.invoke(Array.from(arguments), 'getReviewForScriptHash')
    },
    async getReviews (address, scriptHash) {
      try {
        return await this.getNumberOfReviews(address, scriptHash)
        .then(count => count[0])
        .then(
          (length = 0) => Promise.all(
            Array.from(
              {length}, (v, i) => this.getReviewForScriptHash(address, scriptHash, (i + 1).toString())
            )
          )
        )
      } catch (error) {
        throw new Error(`Fake API getTokens: ${error.message}`);
      }
    },
    async getNumberOfTokens () {
      try {
        return await Delay(500).then(() => tokens.length)
      } catch (error) {
        throw new Error(`Fake API getReviewFromAddress: ${error.message}`)
      }
    },
    async getToken (number) {
      try {
        return await Delay(500).then(() => {
          const { hash, name, symbol, image } = tokens[number]
          return {
            hash,
            name,
            symbol,
            supply: 1000000000,
            image,
          }
        });
      } catch (error) {
        throw new Error(`Fake API getReview: ${error.message}`);
      }
    },
    async getTokens () {
      try {
        return await this.getNumberOfTokens().then((length = 0) => Promise.all(
          Array.from({length}, (v, k) => this.getToken(k))
        ))
      } catch (error) {
        throw new Error(`Fake API getTokens: ${error.message}`);
      }
    },
  },
  // nOS native API.
  nos: {
    async getAddress () {
      try {
        return await nOS.getAddress()
      } catch (error) {
        throw new Error(`nOS API getAddress: ${error.message}`)
      }
    },
    async getBalance (scriptHash) {
      try {
        return await nOS.getBalance({asset: scriptHash})
      } catch (error) {
        throw new Error(`nOS API getAddress: ${error.message}`)
      }
    },
    async send (amount, scriptHash, receiver) {
      try {
        return await nOS.send({amount, asset: scriptHash, receiver})
      } catch (error) {
        throw new Error(`nOS API send: ${error.message}`)
      }
    },
  },
}

export default Service
