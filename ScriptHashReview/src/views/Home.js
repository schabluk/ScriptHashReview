import React from 'react'
import PropTypes from 'prop-types'

import AddReview from './../components/AddReview'
import GetReview from './../components/GetReview'

import './Home.css'

class Home extends React.Component {
  static displayName = 'Home'

  static propTypes = {
    tokens: PropTypes.array,
    tokenIndex: PropTypes.number,
    reviews: PropTypes.array
  }

  render () {
    const { tokens, tokenIndex, reviews } = this.props

    console.log(reviews)

    return (
      <div className='home'>
        <h3 className='jumbotron'>
          Script Hash Review
        </h3>
        <div className='description'>
          ScriptHashReview aims at allowing users to review every smart contract and their
          script hash associated, that are made available on the NEO Smart Economy.
        </div>
        <div className='media'>
          <div style={{flex: 1}}>
            {
              reviews.map((review, key) => <GetReview key={key} {...review} />)
            }
          </div>
          <AddReview tokens={tokens} active={tokenIndex} />
        </div>
      </div>
    )
  }
}

export default Home
