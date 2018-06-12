import React from 'react'
import PropTypes from 'prop-types'
import { Card, Form, Select, Input, Button, Rate } from 'antd'

import ImageLoader from './ImageLoader'
import './AddReview.css'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

class AddReview extends React.Component {
  static propTypes = {
    defaultRating: PropTypes.number,
    active: PropTypes.number,
    tokens: PropTypes.array,
    onSelectToken: PropTypes.func
  }

  static defaultProps = {
    defaultRating: 4.5
  }

  state = {}

  handleSubmit = e => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  getTokenLogo = (key, symbol, image) => {
    return (
      <ImageLoader
        key={key}
        src={image}
        alt={symbol}
        style={{ width: '24px', height: '24px' }}
      />
    )
  }

  renderTokenOptions = () => {
    const { tokens } = this.props

    return tokens.map(({ symbol, name, image, hash }, key) => (
      <Option key={key} value={hash}>
        {this.getTokenLogo(key, symbol, image)}{' '}
        <span className='token-option'>{name}</span>
      </Option>
    ))
  }

  componentWillReceiveProps (next) {
    if (this.props.active !== next.active) {
      const { hash: nextHash } = next.tokens[next.active]
      const { hash: currHash } = this.props.form.getFieldsValue(['hash'])

      /* If next hash is euqal to current hash, that means the value was changed
       * by form Select element, and we don't need to update it. Else, the value
       * was changed from outside, and we have to change value of the Select. */
      if (nextHash !== currHash) {
        this.props.form.setFieldsValue({hash: nextHash})
      }
    }
  }

  render() {
    const {
      defaultRating,
      tokens,
      active,
      form: { getFieldDecorator },
      className,
      onSelectToken
    } = this.props

    const activeToken = tokens[active]
    const initialHash = activeToken && activeToken.hash

    return (
      <Card title='Add Review' className='add-review' bordered={false}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label='Token' hasFeedback>
            {getFieldDecorator('hash', {
              initialValue: initialHash,
              rules: [
                {
                  required: true,
                  message: 'Please select a Token from the list'
                }
              ]
            })(
              <Select
                placeholder='Select Token'
                size='large'
                onChange={onSelectToken}
              >
                {
                  this.renderTokenOptions()
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='Rating'>
            {getFieldDecorator('rate', {
              initialValue: defaultRating
            })(<Rate allowHalf allowClear />)}
          </FormItem>
          <FormItem {...formItemLayout} label='Comment'>
            {getFieldDecorator('comment', {})(
              <TextArea rows={4} placeholder='Write your comment here' />
            )}
          </FormItem>
          <FormItem wrapperCol={{ span: 12, offset: 6 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(AddReview)
