import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import { StickyContainer, Sticky } from 'react-sticky'

import AddReview from './../components/AddReview'
import GetReview from './../components/GetReview'
import Placeholder from './../components/Placeholder'

import './Home.css'

class Home extends React.Component {
  static displayName = 'Home'

  static propTypes = {
    tokens: PropTypes.array,
    tokenIndex: PropTypes.number,
    reviews: PropTypes.array,
    onChangeToken: PropTypes.func,
    onAddReview: PropTypes.func,
  }

  getStickyStyle = style => {
    return style.hasOwnProperty('top')
      ? {...style, marginTop: '1rem'}
      : style
  }

  render () {
    const { tokens, tokenIndex, reviews, onChangeToken, onAddReview, loading } = this.props

    return (
      <StickyContainer>
        <div className='home'>
          <h3 className='jumbotron'>
            Script Hash Review
          </h3>
          <div className='media'>
            <div style={{flex: 1}}>
              {
                !reviews.length && loading && Array.from({length: 1}).map((v, i) => {
                  return <Placeholder key={i} />
                })
              }
              {
                !reviews.length && !loading && (
                  <Card className='get-review not-found' title='No reviews found'>
                    <h3 style={{textAlign: 'center', margin: '2rem 0'}}>
                      Fill in the form to add your own review.
                    </h3>
                  </Card>
                )
              }
              {
                reviews.map((review, key) => <GetReview key={key} {...review} />)
              }
            </div>
            <div style={{flex: 1}}>
              <Sticky topOffset={110}>
                {({style}) => (
                  <div style={this.getStickyStyle(style)}>
                    <AddReview
                      tokens={tokens}
                      active={tokenIndex}
                      onSelectToken={onChangeToken}
                      onSubmit={onAddReview}
                    />
                  </div>
                )}
              </Sticky>
            </div>
          </div>
        </div>
      </StickyContainer>
    )
  }
}

export default Home
