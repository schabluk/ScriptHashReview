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
    tokens: PropTypes.array
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

  render() {
    const {
      defaultRating,
      tokens,
      active,
      form: { getFieldDecorator },
      className
    } = this.props

    const activeToken = tokens[active]
    const activeValue = activeToken && activeToken.hash

    return (
      <Card title='Add Review' className='add-review'>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label='Token' hasFeedback>
            {getFieldDecorator('hash', {
              initialValue: activeValue,
              rules: [
                {
                  required: true,
                  message: 'Please select a Token from the list'
                }
              ]
            })(
              <Select placeholder='Select a Token' size='large'>
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
