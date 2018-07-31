import axios, { get } from 'axios'
import nOS from '@nosplatform/api-functions'
import { u, wallet } from '@cityofzion/neon-js'

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

/*
 * Smart Contract Script Hash.
 */
const contractHash = 'f2e06fbd4c58c2ab8e0a942e3da50b4ea8759e7f'
const contractAddress = 'ATQfHpuX3UFCvD1zYUtApNjRrDk6rkL7jy'

/*
 * Service Bus.
 */
const Service = {
  // Tokens API.
  notifications: {
    async tokens () {
      try {
        return await get(`http://notifications.neeeo.org/v1/tokens`, config)
      } catch ({message}) {
        throw new Error(`Failed to fetch tokens data: ${message}`)
      }
    },
  },
  // Smart Contract API.
  contract: {
    async invoke (args, operation) {
      try {
        // const encodeArgs = args => args.map(arg => {
        //   if (typeof arg === 'string') return u.str2hexstring(arg)
        //   if (typeof arg === 'number') return u.int2hex(arg)
        //   if (Array.isArray(arg)) return encodeArgs(arg)
        //   if (wallet.isAddress(arg)) {
        //     return u.reverseHex(wallet.getScriptHashFromAddress(arg))
        //   }
        //   return arg
        // })

        // return await nOS.testInvoke({
        //   scriptHash: contractHash,
        //   operation,
        //   args: encodeArgs(args),
        //   encodeArgs: false
        // })
        return await nOS.testInvoke({
          scriptHash: contractHash, operation, args
        })
        .then(data => {
          const { script } = data

          return data
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
    editReview (reviewOwner, scriptHash, rating, comment) {
      return this.invoke(Array.from(arguments), 'editReview')
    },
    getNumberOfReviewsFrom (reviewOwner) {
      return this.invoke(Array.from(arguments), 'getNumberOfReviewsFrom')
    },
    getNumberOfReviewsFor (scriptHash) {
      return this.invoke(Array.from(arguments), 'getNumberOfReviewsFor')
    },
    getReviewFromAddress (reviewOwner, number) {
      return this.invoke(Array.from(arguments), 'getReviewFromAddress')
    },
    getReviewForScriptHash (scriptHash, number) {
      return this.invoke(Array.from(arguments), 'getReviewFromAddress')
    },
    getToken (number) {
      return this.invoke(Array.from(arguments), 'getToken')
    },
    getTokenFromIndex (number) {
      return this.invoke(Array.from(arguments), 'getTokenFromIndex')
    },
    //
    getNumberOfTokens () {
      return this.invoke(Array.from(arguments), 'getNumberOfTokens')
    },
    addToken (scriptHash, name, symbol, supply, IPFSHash) {
      return this.invoke(Array.from(arguments), 'addToken')
    },
    async getTokens () {
      try {
        return await this.getNumberOfTokens().then(data => {
          return []
        })
      } catch (error) {
        // Return static token data if method returns error.
        return Object.values(Tokens).map(
          ({ companyName: name, symbol, image, networks }) => ({
            name,
            symbol,
            image,
            hash: networks[1].hash
          })
        )
        // throw new Error(`Fake API getTokens: ${error.message}`);
      }
    },
    async getReviews (scriptHash) {
      try {
        return await this.getNumberOfReviewsFor(scriptHash).then(
          (length = 0) => Promise.all(
            Array.from(
              {length}, (v, k) => this.getReviewForScriptHash(scriptHash, k)
            )
          )
        )
      } catch (error) {
        throw new Error(`Fake API getTokens: ${error.message}`);
      }
    }
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
