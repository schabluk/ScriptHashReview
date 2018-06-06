import React from 'react'
// import PropTypes from 'prop-types'

import './Home.css'

class Home extends React.Component {
  static displayName = 'Home'

  static propTypes = {
    // service: PropTypes.object.isRequired
  }

  render () {
    return (
      <div className='home'>
        <section className='mb-0'>
          <div className='container'>
            <h2 className='text-center mt-5 mb-5'>What is ScriptHashReview?</h2>
            <div className='row'>
              <div className='col-12'>
                <p>
                  ScriptHashReview aims at allowing users to review every smart contract and their
                  script hash associated, that are made available on the NEO Smart Economy. For each
                  unique script hash on the NEO Blockchain, every user (public key) can leave a review
                  with containing a rating as well as a comment associated to it.
                </p>
                <p>
                  Down below, you will find all the functionalities available at the moment that
                  interact with the blockchain to store and retrieve information from it.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Home
