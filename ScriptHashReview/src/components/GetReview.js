import React from 'react'
import PropTypes from 'prop-types'
import { Card, Rate, Avatar } from 'antd'
import Identicon from 'identicon.js'

import ImageLoader from './ImageLoader'
import './GetReview.css'

const { Meta } = Card

class GetReview extends React.Component {
  static propTypes = {
    reviewOwner: PropTypes.string.isRequired,
    scriptHash: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired
  }

  render() {
    const { reviewOwner, scriptHash, rating, comment } = this.props

    // Generate Address Avatar.
    const avatarData = new Identicon(reviewOwner, 48).toString()

    // Possible values: 0 - 0.5 - 1 - 1.5 - 2 - 2.5 - 3 - 3.5 - 4 - 4.5 - 5
    const ratingValue = rating > 0 ? rating / 2 : 0

    return (
      <Card className='get-review'
        extra={
          <Rate disabled allowHalf defaultValue={0} value={ratingValue} />
        }>
        <Meta
          avatar={<Avatar src={`data:image/png;base64,${avatarData}`} />}
          description={comment}
        />
      </Card>
    )
  }
}

export default GetReview
