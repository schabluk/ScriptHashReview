import React from 'react'
import PropTypes from 'prop-types'

import AddReview from './../components/AddReview'
import GetReview from './../components/GetReview'
import Placeholder from "./../components/Placeholder";


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
              !reviews.length && Array.from({length: 5}).map((v, i) => {
                return <Placeholder key={i} />
              })
            }
            {
              reviews.map((review, key) => <GetReview key={key} {...review} />)
            }
          </div>
          <div style={{flex: 1}}>
            <AddReview tokens={tokens} active={tokenIndex} />
          </div>
        </div>
      </div>
    )
  }
}

export default Home
