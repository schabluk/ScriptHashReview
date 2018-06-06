import axios, { get } from 'axios'
import nOS from '@nosplatform/api-functions'

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
const contractHash = 'f6329adf3ad3f0028b2c9ea63a3247ab51710bed'

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
      console.log('invoke', {scriptHash: contractHash, operation, args})
      try {
        return await nOS.testInvoke({scriptHash: contractHash, operation, args})
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
        return await nOS.getBalance({ asset: scriptHash})
      } catch (error) {
        throw new Error(`nOS API getAddress: ${error.message}`)
      }
    },
    async send (amount, scriptHash, receiver) {
      try {
        return await nOS.send({ amount, asset: scriptHash, receiver})
      } catch (error) {
        throw new Error(`nOS API send: ${error.message}`)
      }
    },
  },
}

export default Service
